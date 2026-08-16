# El cron del Cazador (C1) — activación en un comando

El agente corre DIARIO a las 7:00 con la corrida incremental del README
(`--hours-old 24 --append`): agrega solo vacantes nuevas, sin duplicar, con
checkpoint. Para activarlo:

    cp cron/com.likida.cazador-censo.plist ~/Library/LaunchAgents/
    launchctl load ~/Library/LaunchAgents/com.likida.cazador-censo.plist

Para pausarlo: `launchctl unload ~/Library/LaunchAgents/com.likida.cazador-censo.plist`

## Por qué local y no GitHub Actions

Computrabajo/Indeed levantan Cloudflare y captcha que a veces exigen rescate
HEADFUL humano (`--headful`, una vez, y las cookies quedan en
`ct_storage_state.json`). Esas cookies viven en ESTA máquina. Un cron en la
nube correría sin ellas, se estrellaría contra el muro anti-bot y quedaría
"verde" con cero vacantes — el fallo silencioso exacto que ningún agente de
Likida acepta. El día que exista un runner con navegador residencial y
custodia de cookies, se migra; hoy lo honesto es local.

## La señal de que murió

`censo_cron.log` deja el rastro de cada corrida. Si dos corridas seguidas
terminan sin vacantes nuevas Y el log trae errores de Cloudflare, toca una
corrida `--headful` para renovar las cookies.
