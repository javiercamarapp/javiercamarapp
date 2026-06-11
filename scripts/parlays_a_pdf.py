#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""parlays_a_pdf.py — PDF imprimible del portafolio REALISTA J1 (vía HTML + LibreOffice)."""
import html, json, os, subprocess

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
.bolh{font-weight:bold;font-size:11px;color:#1F4E79;} .pay{color:#1a7a1a;} .pr{color:#1a5276;font-weight:bold;}
table{border-collapse:collapse;width:100%;font-size:8px;}
th{background:#D9E1F2;text-align:left;padding:2px 4px;} td{border-bottom:1px solid #e8e8e8;padding:2px 4px;}
.r{color:#1a7a1a;} .e{color:#b07000;} .dud{color:#b00;}</style>"""

b9, b10 = R["bandera_9_sin_dudoso"], R["bandera_10_todas"]
out = [f"<html><head><meta charset='utf-8'>{CSS}</head><body>",
       "<h1>Portafolio REALISTA J1 — 74 boletos · Mundial 2026</h1>",
       f"<div class='sub'>$370 · 74 boletos × $5 · Caliente · SOLO favoritos fuertes (sin empates ni sorpresas) · {esc(', '.join(R['picks']))}</div>",
       f"""<div class='warn'><b>LA VERDAD SOBRE LOS PAGOS.</b>
       Tus 9 selecciones (sin México) juntas: <b>{b9['mult']}x → ${b9['pago_mxn']:,.0f}</b> (prob ~{b9['prob_pct']}%).
       Las 10 con México: <b>{b10['mult']}x → ${b10['pago_mxn']:,.0f}</b> (prob ~{b10['prob_pct']}%).
       Con puros favoritos NO se llega a $35,000 — eso exigía patas irreales que quitamos.
       Lo más probable es cobrar las combinadas chicas (2-3 fuertes). Momios <span class='e'>EST</span> = PENDIENTE-CAPTURA en Caliente.</div>"""]
nombres = {"SEGURAS": "✅ 44 SEGURAS · 2-3 fuertes · pago $6-$16 · prob alta",
           "MEDIAS": "⚡ 15 MEDIAS · 4-6 fuertes · pago $10-$80",
           "GRANDES": "🔥 15 GRANDES · 7-10 fuertes · pago $80-$166"}
for tier in ("SEGURAS", "MEDIAS", "GRANDES"):
    out.append(f"<div class='tier'>{nombres[tier]}</div>")
    for b in [b for b in B if b["tier"] == tier]:
        dud = " · <span class='dud'>incluye México (dudoso)</span>" if any(p.get("dudoso") for p in b["patas"]) else ""
        out.append(f"<div class='bol'><div class='bolh'>{b['emoji']} #{b['boleto']} — {b['n_patas']} patas — "
                   f"{b['multiplicador']:.2f}x → <span class='pay'>${b['pago_potencial_mxn']:,.0f} MXN</span> "
                   f"· <span class='pr'>prob ~{b['prob_pct']}%</span>{dud}</div>"
                   "<table><tr><th>Selección</th><th>Momio</th><th>Prob</th><th>Estatus</th></tr>")
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
