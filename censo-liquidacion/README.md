# Censo de vacantes de liquidación (Indeed MX + Computrabajo)

Scraper que busca vacantes de liquidación en transporte (14 keywords: Indeed 12 plazas + Computrabajo nacional), obtiene la descripción COMPLETA de cada vacante una por una, las clasifica SEÑAL / RUIDO / REVISAR y genera `censo_liquidacion_indeed.xlsx` (5 hojas) + `respaldo_crudo.csv` + capturas PNG de evidencia en `capturas/`.

1. Instala dependencias: `pip install -r requirements.txt && playwright install chromium`
2. Corrida completa (90 días, toma 1–3 h por los sleeps): `python scraper_liquidacion.py`
3. Si Computrabajo pide captcha/Cloudflare: `python scraper_liquidacion.py --headful`, resuélvelo una vez y las cookies quedan en `ct_storage_state.json` para el resto.
4. Tarea diaria incremental: `python scraper_liquidacion.py --hours-old 24 --append` (agrega solo vacantes nuevas, sin duplicar). Cron sugerido: `0 7 * * * cd /ruta/censo-liquidacion && python scraper_liquidacion.py --hours-old 24 --append`
5. Checkpoint cada 25 vacantes en `respaldo_crudo_incremental.csv`; si algo truena, vuelve a correr y salta lo ya descargado.
6. Vacantes sin descripción completa van a la hoja "Sin verificar" para reintento; nada se clasifica con solo el título o snippet.
7. Dedup entre fuentes por empresa + título similar (fuzzy ≥85) + ciudad; si está en ambas se conserva la versión de Computrabajo y fuente = "ambas".
8. Fallos por búsqueda quedan en `censo_scraper.log` y el proceso continúa. Validar el pipeline sin red: `python scraper_liquidacion.py --test`. Para reprocesar con otras reglas sin volver a scrapear, parte de `respaldo_crudo.csv`.
