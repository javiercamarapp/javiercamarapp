#!/usr/bin/env python3
"""Auditoría independiente Sección A: Excel."""
import json, openpyxl, unicodedata

BASE='/home/user/javiercamarapp'
ORIG=f'{BASE}/entregables/QUINIELA_2026_JAVIER_FINAL.xlsx'
RECALC='/tmp/recalc/QUINIELA_2026_JAVIER_FINAL.xlsx'

cal = json.load(open(f'{BASE}/data/calendario.json'))
pred = json.load(open(f'{BASE}/data/predicciones_104.json'))

wb_f = openpyxl.load_workbook(ORIG)                 # fórmulas
wb_v = openpyxl.load_workbook(RECALC, data_only=True)  # valores recalculados

fails=[]
def report(tag, ok, ev):
    print(f"[{'PASS' if ok else 'FAIL'}] {tag}: {ev}")
    if not ok: fails.append((tag, ev))

# ---------- A1: Grupos 72 partidos ----------
ws = wb_f['Grupos']
starts = {g: 6+9*i for i,g in enumerate('ABCDEFGHIJKL')}
partidos = {}
bad_scores=[]
for g,s in starts.items():
    for r in range(s, s+6):
        num = ws.cell(r,1).value
        loc = ws.cell(r,3).value; gl = ws.cell(r,4).value
        gv = ws.cell(r,5).value;  vis = ws.cell(r,6).value
        if num is None: bad_scores.append(f'fila {r} sin num'); continue
        partidos[num]=(loc,gl,gv,vis,r)
        if not (isinstance(gl,int) and isinstance(gv,int) and gl>=0 and gv>=0):
            bad_scores.append(f'#{num} fila{r} GL={gl!r} GV={gv!r}')
report('A1.conteo', len(partidos)==72, f'{len(partidos)} partidos encontrados (esperados 72), nums {min(partidos)}-{max(partidos)}')
report('A1.marcadores', not bad_scores, f'marcadores no enteros/negativos: {bad_scores or "ninguno"}')
mism=[]
calmap={m['num']:m for m in cal}
for num,(loc,gl,gv,vis,r) in sorted(partidos.items()):
    cm = calmap.get(num)
    if not cm: mism.append(f'#{num} no existe en calendario'); continue
    if cm['local']!=loc or cm['visitante']!=vis:
        mism.append(f"#{num} fila{r}: Excel {loc} vs {vis} | calendario {cm['local']} vs {cm['visitante']}")
report('A1.equipos', not mism, f'discrepancias local/visitante: {mism or "ninguna (72/72 coinciden)"}')
# y que los GL/GV coincidan con predicciones (informativo)
pmap={p['num']:p for p in pred['predicciones']}
dif=[f"#{n}: Excel {v[1]}-{v[2]} vs JSON {pmap[n]['gl']}-{pmap[n]['gv']}" for n,v in partidos.items() if n in pmap and (v[1],v[2])!=(pmap[n]['gl'],pmap[n]['gv'])]
report('A1.marcadores_vs_json(info)', not dif, f'marcadores Excel vs predicciones_104: {dif or "72/72 idénticos"}')

# ---------- A2: posiciones recalculadas vs tablas_grupos ----------
wsv = wb_v['Grupos']
pos_fails=[]
for g,s in starts.items():
    calc={}
    for r in range(s, s+4):
        eq = wsv.cell(r,8).value; pos = wsv.cell(r,15).value
        calc[pos]=eq
    esperado=[t['equipo'] for t in pred['tablas_grupos'][g]]
    obtenido=[calc.get(i) for i in range(1,5)]
    if obtenido!=esperado:
        pos_fails.append(f'Grupo {g}: Excel {obtenido} vs JSON {esperado}')
report('A2.posiciones', not pos_fails, pos_fails or '12/12 grupos: orden 1-4 idéntico a tablas_grupos')

# ---------- A3: Terceros ----------
wst = wb_v['Terceros']
si=set(); todos={}
for r in range(4,16):
    eq=wst.cell(r,2).value; av=wst.cell(r,8).value; rk=wst.cell(r,7).value
    todos[eq]=(rk,av)
    if av=='SÍ': si.add(eq)
esp8={t['equipo'] for t in pred['terceros_ranking'][:8]}
report('A3.terceros', si==esp8, f'Excel SÍ={sorted(si)} | JSON top8={sorted(esp8)} | diff={si^esp8 or "vacío"} ({len(si)} con SÍ)')

# ---------- A4: Bracket ----------
wsbf = wb_f['Bracket']; wsbv = wb_v['Bracket']
ko={}; ties=[]; win_fails=[]
for r in range(5,37):
    num=wsbf.cell(r,1).value
    gl=wsbf.cell(r,7).value; gv=wsbf.cell(r,8).value
    loc=wsbv.cell(r,6).value; vis=wsbv.cell(r,9).value
    ko[num]=(loc,gl,gv,vis,r)
    if not (isinstance(gl,int) and isinstance(gv,int) and gl>=0 and gv>=0) or gl==gv:
        ties.append(f'#{num} fila{r} GL={gl!r} GV={gv!r}')
report('A4.conteo', sorted(ko)==list(range(73,105)), f'{len(ko)} partidos KO, nums {min(ko)}-{max(ko)}')
report('A4.sin_empates', not ties, f'empates/valores inválidos: {ties or "ninguno (32/32 con ganador)"}')
for num,(loc,gl,gv,vis,r) in sorted(ko.items()):
    w = loc if gl>gv else vis
    esp = pmap[num].get('ganador')
    if w!=esp: win_fails.append(f"#{num}: Excel ganador={w!r} vs JSON {esp!r} ({loc} {gl}-{gv} {vis})")
report('A4.ganadores', not win_fails, win_fails or '32/32 ganadores recalculados == JSON')
campeon = wsbv.cell(38,2).value
g104 = pmap[104]['ganador']
w104 = ko[104][0] if ko[104][1]>ko[104][2] else ko[104][3]
report('A4.campeon', campeon==g104==w104, f'celda B38={campeon!r}, ganador #104 Excel={w104!r}, JSON={g104!r}')

# ---------- A5: Extras ----------
wse = wb_f['Extras']
bota=wse.cell(3,2).value; ultimo=wse.cell(4,2).value
nom=wse.cell(7,2).value; mail=wse.cell(8,2).value; tel=wse.cell(9,2).value
report('A5.extras_llenos', bool(bota) and bool(ultimo), f'Bota de Oro={bota!r}, Último lugar={ultimo!r}')
report('A5.personales_vacios', nom is None and mail is None and tel is None, f'Nombre={nom!r}, Email={mail!r}, Teléfono={tel!r}')

print('\nTOTAL FAILS A:', len(fails))
for t,e in fails: print('  FAIL', t, e)
