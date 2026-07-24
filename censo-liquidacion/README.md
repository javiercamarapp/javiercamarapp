# Censo de vacantes de liquidación (Indeed MX)

Scraper que busca vacantes de liquidación en transporte (14 keywords × 12 plazas), las clasifica como SEÑAL / RUIDO / REVISAR y genera `censo_liquidacion_indeed.xlsx` (4 hojas) + `respaldo_crudo.csv`.

1. Instala dependencias: `pip install -r requirements.txt`
2. Corrida completa (90 días): `python scraper_liquidacion.py`
3. Tarea diaria incremental: `python scraper_liquidacion.py --hours-old 24 --append` (agrega solo vacantes nuevas al Excel existente, sin duplicar)
4. Validar el pipeline sin red: `python scraper_liquidacion.py --test`
5. Cron diario sugerido (7am): `0 7 * * * cd /ruta/censo-liquidacion && python scraper_liquidacion.py --hours-old 24 --append`
6. Los fallos por búsqueda se registran en `censo_scraper.log` y el proceso continúa; Indeed es la fuente primaria y LinkedIn el fallback.
7. Para reprocesar con otras reglas sin volver a scrapear, parte de `respaldo_crudo.csv`.
