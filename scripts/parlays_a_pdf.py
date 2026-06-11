#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""parlays_a_pdf.py — PDF imprimible del portafolio J1 (a ganador, >$35k)."""
import html, json, os, subprocess

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENT = os.path.join(BASE, "entregables")
P = json.load(open(os.path.join(ENT, "parlays.json"), encoding="utf-8"))
B, R = P["boletos"], P["resumen"]
esc = lambda s: html.escape(str(s))

CSS = """<style>
@page{size:A4;margin:1.1cm;} body{font-family:'Liberation Sans',Arial;font-size:9px;color:#1a1a1a;}
h1{color:#1F4E79;font-size:19px;margin:0;} .sub{color:#555;font-size:10px;margin:2px 0 8px;}
.warn{background:#FFF2CC;border-left:4px solid #d4a017;padding:8px 10px;margin:8px 0;font-size:10px;}
.tier{background:#1F4E79;color:#fff;font-weight:bold;padding:5px 9px;margin-top:12px;border-radius:3px;font-size:13px;}
.bol{border:1px solid #ccc;border-radius:4px;margin:5px 0;padding:5px 8px;page-break-inside:avoid;}
.bolh{font-weight:bold;font-size:11px;color:#1F4E79;} .pay{color:#1a7a1a;} .odd{color:#b00;font-weight:bold;}
table{border-collapse:collapse;width:100%;font-size:8px;}
th{background:#D9E1F2;text-align:left;padding:2px 4px;} td{border-bottom:1px solid #e8e8e8;padding:2px 4px;}
.r{color:#1a7a1a;} .e{color:#b07000;}</style>"""

out = [f"<html><head><meta charset='utf-8'>{CSS}</head><body>",
       "<h1>Portafolio J1 — 74 parlays a GANADOR · Mundial 2026</h1>",
       f"<div class='sub'>$370 · 74 boletos × $5 · Caliente · hasta 16 GANADORES de la Jornada 1 · <b>TODOS pagan &gt;$35,000</b> · sin empates ni sorpresas absurdas</div>",
       f"""<div class='warn'><b>⚠️ LA VERDAD.</b> Cada boleto son <b>16 partidos a ganador</b> que TODOS deben acertar.
       P(que CUALQUIERA de los 74 pegue): <b>~{R['p_al_menos_uno_pegue']*100:.2f}% ≈ 1 entre {R['uno_entre_global']:,}</b>.
       Para llegar a $35,000 hay que incluir los partidos CERRADOS de J1 (favoritos que pagan 1.7-2.5: Turquía, Suecia, Corea, Bélgica, USA…) — no son empates ni absurdos, pero acertar los 16 seguidos es muy difícil.
       Momios <span class='e'>EST</span> = PENDIENTE-CAPTURA en Caliente. Lo más probable es perder los $370.</div>"""]
nombres = {"SOÑADOR": "🌙 44 SOÑADOR · las más alcanzables (~$35-37K)",
           "SÚPER SOÑADOR": "🚀 15 SÚPER (~$38-40K)",
           "LOTERÍA MÁXIMA": "🎰 15 LOTERÍA MÁXIMA (~$45-48K)"}
for tier in ("SOÑADOR", "SÚPER SOÑADOR", "LOTERÍA MÁXIMA"):
    out.append(f"<div class='tier'>{nombres[tier]}</div>")
    for b in [b for b in B if b["tier"] == tier]:
        out.append(f"<div class='bol'><div class='bolh'>{b['emoji']} #{b['boleto']} — {b['n_patas']} ganadores — "
                   f"{b['multiplicador']:,.0f}x → <span class='pay'>${b['pago_potencial_mxn']:,.0f} MXN</span> "
                   f"· <span class='odd'>~1 entre {b['uno_entre']:,}</span></div>"
                   "<table><tr><th>Selección (gana)</th><th>Momio</th><th>Prob</th><th>Estatus</th></tr>")
        for l in b["patas"]:
            cls = "r" if l["estatus"] == "REAL" else "e"
            out.append(f"<tr><td>{esc(l['descripcion'])}</td><td>{l['momio_decimal']} ({l['momio_americano']})</td>"
                       f"<td>{l['prob_real']*100:.0f}%</td><td class='{cls}'>{l['estatus']}</td></tr>")
        out.append("</table></div>")
out.append("</body></html>")

open("/tmp/parlays_j1.html", "w").write("".join(out))
subprocess.run(["soffice", "--headless", "-env:UserInstallation=file:///tmp/loprofile",
                "--convert-to", "pdf", "--outdir", ENT, "/tmp/parlays_j1.html"],
               check=True, capture_output=True, timeout=180)
os.replace(os.path.join(ENT, "parlays_j1.pdf"), os.path.join(ENT, "PORTAFOLIO_74_PARLAYS_J1.pdf"))
print("OK → entregables/PORTAFOLIO_74_PARLAYS_J1.pdf")
