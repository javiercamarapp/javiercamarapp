# El playbook del TAM — cómo se consiguen leads (aprendido el 17-ago-2026)

La lección de la noche en una línea: **la DENUE del INEGI ES el "scraper de
Google Maps" legal y $0** — nombre, teléfono, correo, sitio, coordenadas y
tamaño de TODO negocio formal de México. Antes de scrapear nada, pregúntale
a la DENUE.

## Las 4 fuentes, en orden de costo

1. **CSV masivo DENUE** (gratis, sin token, sin límite):
   `https://www.inegi.org.mx/contenidos/masiva/denue/denue_00_<SECTOR>_csv.zip`
   Sectores que ya usamos: `48-49` (transporte: 4841/4842 carga, 4921
   paquetería), `43` (mayoreo: 4311 abarrotes/alimentos, 4312 bebidas),
   `31-33` (manufactura: 3121 embotelladoras). Cortes de tamaño por sector
   en `sembrar_denue_universo.py` (transportistas desde 11 personas; el
   resto desde 31 — un mayorista chico no tiene flota).
2. **API DENUE** (token gratis `INEGI_TOKEN` en likida/.env.local): busca
   por texto en TODOS los giros — para lo que el CSV sectorial no trae.
   `enriquecer_censo_api.py`. Peculiaridad: contesta `HTTP/1.1 000` a token
   inválido; se llama con curl `--http1.1 -A "Mozilla/5.0"`.
3. **Crawler de sitios propios** (`crawlear_sitios.py`): la DENUE lista el
   sitio web → se visita portada + /contacto y se extrae el correo con
   regex. Legal, sin Google, ~26% de acierto.
4. **Bolsas de trabajo** (`scraper_liquidacion.py`, diario 07:00): la
   DEMANDA — la vacante publicada es la confesión del dolor. Su agregado
   sube solo a la base (`subir_censo.py`, encadenado al cazador).

## Las 5 trampas que YA nos mordieron (no repetir)

- **PostgREST recorta a 1,000 filas EN SILENCIO**: todo GET de dedupe se
  pagina hasta vaciar, y SIEMPRE con `order=id` (created_at se repite en
  lotes y duplica/salta filas entre páginas — nos costó 30 duplicados).
- **El insert masivo exige llaves homogéneas**: los huecos van como `null`
  explícito, nunca se quitan del dict.
- **Solo identidad plena escribe** (score ≥1.0; 1 solo token ancla exige
  ciudad confirmada — "Kelly"/"Sigma" cruzan contra homónimos ajenos).
- **Solo se llenan huecos**: jamás pisar un dato existente; procedencia
  SIEMPRE en notas (`DENUE 05/2026: «match» …`).
- **"Confidencial"/"Reclutamiento X" no son empresas**: filtro antirruido
  en `subir_censo.py`.

## La cadena viva (quién corre qué)

- 07:00 diario — cazador scrapea bolsas → `subir_censo.py --aplicar`.
- 12:30 diario — `prospeccion-decisores` (likida) busca dueño/LinkedIn/
  conmutador y guarda mensajes IA (0129).
- dom 08:30 — `expandir-tam.sh` (este repo): re-siembra sectores nuevos del
  CSV masivo + API DENUE (tope 300) + crawler (tope 300) + coords.

Para AGREGAR un sector: mide primero (`codigo_act` + estrato), añade la
línea a `SECTORES` en `sembrar_denue_universo.py` con SU corte de tamaño, y
corre en dry-run antes de aplicar. El Cerebro clasifica el giro solo
(lib/admin/prospectos-mapa.ts:giroDe) — si el sector nuevo necesita
categoría propia, se agrega ahí CON su prueba.
