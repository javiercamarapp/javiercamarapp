#!/usr/bin/env python3
"""Auditoría independiente Secciones B, C, D."""
import json, re, math, collections, os

BASE='/home/user/javiercamarapp'
P = json.load(open(f'{BASE}/entregables/parlays.json'))
cal = json.load(open(f'{BASE}/data/calendario.json'))
mom = json.load(open(f'{BASE}/data/momios_mx.json'))
bol = P['boletos']
fails=[]
def report(tag, ok, ev):
    print(f"[{'PASS' if ok else 'FAIL'}] {tag}: {ev}")
    if not ok: fails.append((tag,ev))

# ---------- B1 ----------
tiers = collections.Counter(b['tier'] for b in bol)
total = sum(b['apuesta_mxn'] for b in bol)
report('B1.conteo', len(bol)==100, f'{len(bol)} boletos')
report('B1.suma', total==500, f'suma apuestas = ${total} MXN')
report('B1.estructura', tiers=={'CONSERVADOR':60,'MEDIO':20,'JACKPOT':20}, dict(tiers))

# ---------- B2 ----------
bad_casa=[b['boleto'] for b in bol if b['casa']!='Caliente']
bad_patas=[(b['boleto'],b['n_patas']) for b in bol if b['n_patas']>8 or b['n_patas']!=len(b['patas'])]
report('B2.casa', not bad_casa, f'boletos con casa != Caliente: {bad_casa or "ninguno"}')
report('B2.n_patas', not bad_patas, f'boletos con n_patas>8 o inconsistente: {bad_patas or "ninguno (max="+str(max(b["n_patas"] for b in bol))+")"}')

# ---------- B3: Jackpots ----------
jk=[b for b in bol if b['tier']=='JACKPOT']
bad_mult=[(b['boleto'],b['multiplicador']) for b in jk if b['multiplicador']<7000]
bad_pago=[(b['boleto'],b['pago_potencial_mxn']) for b in jk if b['pago_potencial_mxn']<35000]
over=[(b['boleto'],b['pago_potencial_mxn']) for b in bol if b['pago_potencial_mxn']>3600000]
mn=min(b['multiplicador'] for b in jk); mx=max(b['pago_potencial_mxn'] for b in bol)
report('B3.jackpot_mult', not bad_mult, f'jackpots <7000x: {bad_mult or "ninguno"} (mín={mn}x)')
report('B3.jackpot_pago', not bad_pago, f'jackpots <$35,000: {bad_pago or "ninguno"}')
report('B3.tope_caliente', not over, f'pagos >$3.6M: {over or "ninguno"} (máx pago=${mx:,.2f})')

# ---------- B4 ----------
con=[b for b in bol if b['tier']=='CONSERVADOR']
med=[b for b in bol if b['tier']=='MEDIO']
bc=[(b['boleto'],b['multiplicador'],b['n_patas']) for b in con if not(1.5<=b['multiplicador']<=4.0) or not(2<=b['n_patas']<=3)]
bm=[(b['boleto'],b['multiplicador'],b['n_patas']) for b in med if not(20<=b['multiplicador']<=300) or not(4<=b['n_patas']<=6)]
report('B4.conservadores', not bc, f'fuera de rango (mult 1.5-4.0, 2-3 patas): {bc or "ninguno"}; mult [{min(b["multiplicador"] for b in con)}, {max(b["multiplicador"] for b in con)}]')
report('B4.medios', not bm, f'fuera de rango (mult 20-300, 4-6 patas): {bm or "ninguno"}; mult [{min(b["multiplicador"] for b in med)}, {max(b["multiplicador"] for b in med)}]')

# ---------- B5: aritmética ----------
bad_m=[]; bad_p=[]; bad_pay=[]
for b in bol:
    prod=1.0; pr=1.0
    for pa in b['patas']:
        prod*=pa['momio_decimal']; pr*=pa['prob_real']
    if abs(prod-b['multiplicador'])/prod > 0.005:
        bad_m.append(f"#{b['boleto']}: decl {b['multiplicador']} vs calc {prod:.2f}")
    if abs(pr-b['prob_real'])/pr > 0.005:
        bad_p.append(f"#{b['boleto']}: decl {b['prob_real']} vs calc {pr:.6g}")
    if abs(5*b['multiplicador']-b['pago_potencial_mxn']) > 0.005*5*b['multiplicador']+0.01:
        bad_pay.append(f"#{b['boleto']}: pago {b['pago_potencial_mxn']} vs 5x{b['multiplicador']}={5*b['multiplicador']:.2f}")
report('B5.multiplicador', not bad_m, bad_m or '100/100 multiplicadores = producto de momios (tol 0.5%)')
report('B5.prob_real', not bad_p, bad_p or '100/100 prob_real = producto de probs (tol 0.5%)')
report('B5.pago', not bad_pay, bad_pay or '100/100 pagos = 5 x multiplicador')

# ---------- B6: diversificación ----------
div_fails=[]
det=[]
for tier in ['CONSERVADOR','MEDIO','JACKPOT']:
    tb=[b for b in bol if b['tier']==tier]
    cnt=collections.Counter()
    for b in tb:
        for d in {pa['descripcion'] for pa in b['patas']}:
            cnt[d]+=1
    lim=0.30*len(tb)
    top=cnt.most_common(1)[0]
    det.append(f"{tier}: máx '{top[0][:45]}' en {top[1]}/{len(tb)} ({top[1]/len(tb):.0%})")
    for d,c in cnt.items():
        if c>lim: div_fails.append(f"{tier}: '{d}' en {c}/{len(tb)} boletos ({c/len(tb):.0%} > 30%)")
report('B6.diversificacion', not div_fails, div_fails or '; '.join(det))

# ---------- B7: correlaciones ----------
ALIAS={'bosnia':'bosnia y herzegovina','eua':'estados unidos','rd congo':'república democrática del congo',
 'corea':'corea del sur','arabia':'arabia saudita','países bajos':'países bajos'}
def norm(s):
    import unicodedata
    s=s.lower()
    s=''.join(c for c in unicodedata.normalize('NFD',s) if unicodedata.category(c)!='Mn')
    return s
teams={norm(t) for m in cal for t in (m['local'],m['visitante'])}
alias_n={norm(k):norm(v) for k,v in ALIAS.items()}
matches=[(m['num'], norm(m['local']), norm(m['visitante']), m['fecha']) for m in cal]

MESES={'jun':'06','jul':'07'}
def pata_match_key(pa):
    """Devuelve num de partido del calendario si la pata es a nivel partido."""
    if pa['mercado'] not in ('1X2','Marcador exacto','1X2 empate'): return None
    d=norm(pa['descripcion'])
    for a,full in alias_n.items():
        d=re.sub(r'\b'+re.escape(a)+r'\b', full, d)
    found=[t for t in teams if t in d]
    # quitar subcadenas (p.ej. 'corea del sur' contiene...)
    found=[t for t in found if not any(t!=u and t in u for u in found)]
    fecha=None
    mfecha=re.search(r'(\d{1,2})-(jun|jul)', d)
    if mfecha: fecha=f"2026-{MESES[mfecha.group(2)]}-{int(mfecha.group(1)):02d}"
    cands=[n for n,l,v,f in matches if l in found and v in found and (fecha is None or f==fecha)]
    if len(cands)==1: return cands[0]
    # fallback: por fecha + un equipo
    cands=[n for n,l,v,f in matches if fecha and f==fecha and (l in found or v in found)]
    if len(cands)==1: return cands[0]
    return ('UNRESOLVED', pa['descripcion'])

corr_fails=[]; unresolved=[]
# partido Portugal vs Colombia:
pc=[n for n,l,v,f in matches if {l,v}=={'portugal','colombia'}]
for b in bol:
    keys=[]
    for pa in b['patas']:
        k=pata_match_key(pa)
        if isinstance(k,tuple): unresolved.append((b['boleto'],k[1])); continue
        if k is not None: keys.append((k,pa['descripcion']))
    seen={}
    for k,d in keys:
        if k in seen:
            corr_fails.append(f"#{b['boleto']}: dos patas del partido {k}: '{seen[k][:40]}' + '{d[:40]}'")
        seen[k]=d
    descs=[pa['descripcion'] for pa in b['patas']]
    if any('Colombia gana el Grupo K' in d for d in descs):
        for k,d in keys:
            if k in pc:
                corr_fails.append(f"#{b['boleto']}: 'Colombia gana el Grupo K' + pata del partido Portugal vs Colombia (#{k}: '{d[:40]}')")
report('B7.correlaciones', not corr_fails, corr_fails or f'0 boletos con patas del mismo partido; 0 con tesis Grupo K + Portugal-Colombia (partido #{pc}); patas a nivel partido mapeadas: {sum(1 for b in bol for pa in b["patas"] if not isinstance(pata_match_key(pa),(tuple,type(None))))}')
if unresolved:
    print('  AVISO patas no mapeadas a partido (revisión manual):', sorted(set(d for _,d in unresolved)))

# ---------- B8: markdown ----------
md=open(f'{BASE}/entregables/PORTAFOLIO_100_PARLAYS.md').read()
nb=len(re.findall(r'^### Boleto #', md, re.M))
nums=sorted(int(x) for x in re.findall(r'^### Boleto #(\d+)', md, re.M))
report('B8.markdown', nb==100 and nums==list(range(1,101)), f'{nb} encabezados "### Boleto #", nums 1-100 {"completos" if nums==list(range(1,101)) else "INCOMPLETOS: faltan "+str(sorted(set(range(1,101))-set(nums)))}')

# ---------- C ----------
c1=[(b['boleto'],pa['descripcion']) for b in bol for pa in b['patas'] if not str(pa.get('fuente') or '').strip()]
report('C1.fuentes', not c1, f'patas sin fuente: {c1 or "ninguna (350/350 con fuente)"}')
c2=[(b['boleto'],pa['descripcion'],pa['fuente']) for b in bol for pa in b['patas'] if pa['estatus']=='EST' and 'PENDIENTE-CAPTURA' not in pa['fuente']]
nest=sum(1 for b in bol for pa in b['patas'] if pa['estatus']=='EST')
report('C2.est_pendiente', not c2, c2[:5] if c2 else f'{nest}/{nest} patas EST llevan PENDIENTE-CAPTURA en fuente')
CASAS=['http','caliente','bet365','espn','fox','flashscore','polymarket','legalsportsreport','gambling.com','oddschecker','draftkings','fanduel','betmgm','codere','playdoit']
c3=[(b['boleto'],pa['descripcion'],pa['fuente']) for b in bol for pa in b['patas'] if pa['estatus']=='REAL' and not any(c in pa['fuente'].lower() for c in CASAS)]
nreal=sum(1 for b in bol for pa in b['patas'] if pa['estatus']=='REAL')
report('C3.real_citado', not c3, c3[:5] if c3 else f'{nreal}/{nreal} patas REAL citan URL/casa reconocible')
# C4 spot-check
mx=[m for m in mom['partidos'] if m['local']=='México' and m['visitante']=='Sudáfrica']
ok_mx = mx and mx[0]['momios_decimal']['local']==1.38 and 'http' in mx[0]['fuente']
col=[g for g in mom['ganador_grupo'] if g.get('grupo')=='K' and g.get('equipo')=='Colombia']
ok_col = col and col[0]['momio_decimal']==3.5 and 'http' in col[0]['fuente']
report('C4.spotcheck', bool(ok_mx and ok_col), f"México-Sudáfrica local={mx[0]['momios_decimal']['local'] if mx else 'NO HALLADO'} fuente={'URL ok' if mx and 'http' in mx[0]['fuente'] else 'sin URL'}; Colombia Grupo K={col[0]['momio_decimal'] if col else 'NO HALLADO'} fuente={'URL ok' if col and 'http' in col[0]['fuente'] else 'sin URL'}")

# ---------- D ----------
rp=f'{BASE}/entregables/RESUMEN.md'
ex=os.path.exists(rp)
txt=open(rp).read() if ex else ''
pj=P['resumen']['p_al_menos_un_jackpot']
menciona = bool(re.search(r'AL MENOS UN', txt, re.I)) and ('0.12%' in txt or '0,12%' in txt or f'{pj}' in txt)
capturas = 'faltan' in txt.lower() or 'FALTAN' in txt
coincide = abs(pj - 0.0012) < 0.0002 and ('0.12%' in txt or str(pj) in txt)
report('D.existe', ex, rp)
report('D.menciona_jackpot', menciona, f"texto contiene 'AL MENOS UN' y 0.12%: {menciona}")
report('D.capturas', capturas, "sección 4 'Capturas que FALTAN' presente" if capturas else 'NO lista capturas faltantes')
report('D.numero', coincide, f'parlays.json p_al_menos_un_jackpot={pj} ↔ RESUMEN dice ~0.12% (0.12% = {pj*100:.3f}% redondeado)')

print('\nTOTAL FAILS B/C/D:', len(fails))
for t,e in fails: print('  FAIL', t, str(e)[:300])
