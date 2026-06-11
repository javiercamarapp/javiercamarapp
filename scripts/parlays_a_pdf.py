#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""parlays_a_pdf.py — convierte entregables/parlays.json a un PDF imprimible
(vía HTML + LibreOffice Writer headless)."""
import html, json, os, subprocess, sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENT = os.path.join(BASE, "entregables")
P = json.load(open(os.path.join(ENT, "parlays.json"), encoding="utf-8"))
B, R = P["boletos"], P["resumen"]
esc = lambda s: html.escape(str(s))

CSS = """<style>
@page{size:A4;margin:1.1cm;} body{font-family:'Liberation Sans',Arial;font-size:9px;color:#1a1a1a;}
h1{color:#1F4E79;font-size:20px;margin:0;} .sub{color:#555;font-size:10px;margin:2px 0 8px;}
.warn{background:#FFF2CC;border-left:4px solid #d4a017;padding:8px 10px;margin:8px 0;font-size:10px;}
.tier{background:#1F4E79;color:#fff;font-weight:bold;padding:5px 9px;margin-top:12px;border-radius:3px;font-size:13px;}
.bol{border:1px solid #ccc;border-radius:4px;margin:5px 0;padding:5px 8px;page-break-inside:avoid;}
.bolh{font-weight:bold;font-size:11px;color:#1F4E79;} .pay{color:#1a7a1a;} .odd{color:#b00;font-weight:bold;}
.meta{color:#666;font-size:8.5px;margin:1px 0 3px;} table{border-collapse:collapse;width:100%;font-size:8px;}
th{background:#D9E1F2;text-align:left;padding:2px 4px;} td{border-bottom:1px solid #e8e8e8;padding:2px 4px;}
.r{color:#1a7a1a;} .e{color:#b07000;}</style>"""

out = [f"<html><head><meta charset='utf-8'>{CSS}</head><body>",
       "<h1>Portafolio SOÑADOR — 74 Parlays · Mundial 2026</h1>",
       f"<div class='sub'>$370 MXN · 74 boletos × $5 · Caliente · <b>TODOS pagan &gt;$35,000</b></div>",
       f"""<div class='warn'><b>⚠️ ESTO ES UN SUEÑO, NO UN PLAN DE INVERSIÓN.</b>
       P(que CUALQUIERA de los 74 pegue): <b>~{R['p_al_menos_uno_pegue']*100:.2f}% ≈ 1 entre {R['uno_entre_global']:,}</b>.
       Cada boleto es ~1 entre decenas de miles a millones. Casi todos los momios son
       <span class='odd'>EST · PENDIENTE-CAPTURA</span>: valídalos en Caliente. Lo más probable es perder los $370.</div>"""]
nombres = {"SOÑADOR": "🌙 44 SOÑADORES · $35k–$150k",
           "SÚPER SOÑADOR": "🚀 15 SÚPER SOÑADORES · $150k–$750k",
           "LOTERÍA MÁXIMA": "🎰 15 LOTERÍA MÁXIMA · $750k–$3.6M"}
for tier in ("SOÑADOR", "SÚPER SOÑADOR", "LOTERÍA MÁXIMA"):
    out.append(f"<div class='tier'>{nombres[tier]}</div>")
    for b in [b for b in B if b["tier"] == tier]:
        cap = " · <span class='odd'>pago TOPADO $3.6M</span>" if b.get("pago_topado") else ""
        out.append(f"<div class='bol'><div class='bolh'>{b['emoji']} #{b['boleto']} — {b['n_patas']} patas — "
                   f"{b['multiplicador']:,.0f}x → <span class='pay'>${b['pago_potencial_mxn']:,.0f} MXN</span> "
                   f"· <span class='odd'>~1 entre {b['uno_entre']:,}</span>{cap}</div>"
                   f"<div class='meta'>Se resuelve a más tardar: {b['fecha_ultima_pata']}</div>"
                   "<table><tr><th>Pata</th><th>Mercado</th><th>Momio</th><th>Prob</th><th>Estatus</th></tr>")
        for l in b["patas"]:
            cls = "r" if l["estatus"] == "REAL" else "e"
            out.append(f"<tr><td>{esc(l['descripcion'])}</td><td>{esc(l['mercado'])}</td>"
                       f"<td>{l['momio_decimal']} ({l['momio_americano']})</td><td>{l['prob_real']*100:.1f}%</td>"
                       f"<td class='{cls}'>{l['estatus']}</td></tr>")
        out.append("</table></div>")
out.append("</body></html>")

open("/tmp/sonadores.html", "w").write("".join(out))
subprocess.run(["soffice", "--headless", "-env:UserInstallation=file:///tmp/loprofile",
                "--convert-to", "pdf", "--outdir", ENT, "/tmp/sonadores.html"],
               check=True, capture_output=True, timeout=180)
os.replace(os.path.join(ENT, "sonadores.pdf"), os.path.join(ENT, "PORTAFOLIO_74_SONADORES.pdf"))
print("OK → entregables/PORTAFOLIO_74_SONADORES.pdf")
