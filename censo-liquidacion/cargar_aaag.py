#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
El padrón de transportistas de la AAAG (Asociación de Agentes Aduanales de
Guadalajara) → prospecto. Orden del 17-ago: "scrapea aaag.org.mx".

Esto es EXACTAMENTE lo que la DENUE no trae: un padrón gremial — el
transportista afiliado que mueve carga aduanal en el corredor GDL. Página
pública, tabla estática (EMPRESA · RAZÓN SOCIAL · TELÉFONOS).

Doble acción, mismo contrato del pipeline:
 · si la empresa YA está en la base → solo RELLENA el teléfono si falta
   (y anota la procedencia);
 · si no está → la inserta como fuente 'aaag'.
"""
import json
import re
import subprocess
import sys
import urllib.request

from enriquecer_censo import leer_env, normalizar

URL_PAGINA = "https://pagina.aaag.org.mx/transportistas/"


def telefono_de(crudo):
    """El primer teléfono de 10 dígitos que se arme de la celda."""
    for tramo in re.split(r"[,/]| y ", crudo):
        digitos = re.sub(r"\D", "", tramo)
        if len(digitos) == 10:
            return digitos
        if len(digitos) in (11, 12) and digitos.startswith(("52", "01")):
            return digitos[-10:]
    return None


def main():
    aplicar = "--aplicar" in sys.argv
    url, key = leer_env("NEXT_PUBLIC_SUPABASE_URL"), leer_env("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        sys.exit("faltan credenciales en likida/.env.local")

    def api(m, r, c=None, extra=None):
        h = {"apikey": key, "Authorization": f"Bearer {key}", "Content-Type": "application/json"}
        h.update(extra or {})
        req = urllib.request.Request(f"{url}/rest/v1/{r}",
                                     data=json.dumps(c).encode() if c is not None else None,
                                     method=m, headers=h)
        crudo = urllib.request.urlopen(req, timeout=60).read()
        return json.loads(crudo) if crudo else None

    html = subprocess.run(["curl", "-sSL", "-m", "30", "-A", "Mozilla/5.0", URL_PAGINA],
                          capture_output=True, text=True, timeout=45).stdout
    filas = re.findall(r"<tr[^>]*>(.*?)</tr>", html, re.S)
    padron = []
    for f in filas:
        celdas = [re.sub(r"<[^>]+>", " ", c) for c in re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", f, re.S)]
        celdas = [re.sub(r"\s+", " ", c).strip() for c in celdas]
        if len(celdas) < 2 or celdas[0].upper() == "EMPRESA":
            continue
        comercial, razon = celdas[0], celdas[1]
        tel = telefono_de(celdas[2]) if len(celdas) > 2 else None
        nombre = razon if len(razon) > 3 else comercial
        if len(nombre) < 4:
            continue
        padron.append({"nombre": nombre[:200], "comercial": comercial[:80], "tel": tel})
    print(f"padrón AAAG: {len(padron)} transportistas ({sum(1 for p in padron if p['tel'])} con teléfono)")

    # La base entera (paginada estable) para decidir rellenar vs insertar.
    existentes, desde = {}, 0
    while True:
        pagina = api("GET", f"prospecto?select=id,empresa,telefono,notas&order=id&limit=1000&offset={desde}")
        for p in pagina:
            existentes.setdefault(normalizar(p["empresa"]), p)
        if len(pagina) < 1000:
            break
        desde += 1000

    rellenos, nuevos = 0, []
    for p in padron:
        nota = f"PADRÓN AAAG (agentes aduanales GDL): afiliado «{p['comercial']}»"
        ya = existentes.get(normalizar(p["nombre"])) or existentes.get(normalizar(p["comercial"]))
        if ya:
            if p["tel"] and not ya.get("telefono") and aplicar:
                previas = (ya.get("notas") or "").strip()
                api("PATCH", f"prospecto?id=eq.{ya['id']}&telefono=is.null",
                    {"telefono": p["tel"], "notas": (previas + "\n" if previas else "") + nota},
                    {"Prefer": "return=minimal"})
                rellenos += 1
            elif p["tel"] and not ya.get("telefono"):
                rellenos += 1
        else:
            nuevos.append({
                "empresa": p["nombre"], "ciudad": None, "vacante": None, "fuente": "aaag",
                "telefono": p["tel"], "correo": None, "lat": None, "lng": None,
                "notas": nota + " · corredor aduanal Guadalajara",
            })
    print(f"a rellenar teléfono: {rellenos} · nuevos a insertar: {len(nuevos)}")
    if aplicar and nuevos:
        for i in range(0, len(nuevos), 100):
            api("POST", "prospecto", nuevos[i:i + 100], {"Prefer": "return=minimal"})
        print(f"insertados: {len(nuevos)}")


if __name__ == "__main__":
    main()
