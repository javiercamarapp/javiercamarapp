#!/bin/bash
# La ronda semanal del TAM (dom 08:30) — ver PLAYBOOK-TAM.md. Cada paso es
# idempotente (solo llena huecos, dedupe estable) y tolera fallar: el
# siguiente domingo lo reintenta. Reporta al WhatsApp de Javier al cierre.
set -uo pipefail
cd "$(dirname "$0")"
WA="$HOME/javiercamarapp/likida/scripts/mejora-diaria/wa-notificar.sh"
LOG="expansion_tam.log"
{
  echo "═══ expandir-tam $(date '+%F %H:%M') ═══"
  python3 sembrar_denue_universo.py --aplicar
  python3 enriquecer_censo_api.py --aplicar --tope 300
  python3 crawlear_sitios.py --aplicar --tope 300
  python3 backfill_coords.py
} >> "$LOG" 2>&1
RESUMEN=$(tail -30 "$LOG" | grep -E "sembrados|escritos|correos escritos|coords escritas" | tr '\n' ' · ')
bash "$WA" "🕸 TAM semanal: ${RESUMEN:-sin cambios esta semana} — detalle en censo-liquidacion/expansion_tam.log" || true
