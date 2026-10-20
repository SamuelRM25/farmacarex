#!/usr/bin/env bash
# Genera los ads PNG (1080x1350) de cada producto usando agent-browser.
# Uso:
#   ./scripts/generate-ads.sh [ids-file] [out-dir] [port]
set -uo pipefail

IDS_FILE="${1:-/tmp/med-ids.txt}"
OUT_DIR="${2:-$HOME/Desktop/Farmacarex-Ads}"
PORT="${3:-8765}"
BASE="http://127.0.0.1:${PORT}/ads"

mkdir -p "$OUT_DIR"
TOTAL=$(wc -l < "$IDS_FILE" | tr -d ' ')
OK=0
FAIL=0

echo "Generando ${TOTAL} ads en ${OUT_DIR} (puerto ${PORT})..."

# Viewport fijo 1080x1350 una sola vez (persiste en la sesión del browser).
agent-browser set viewport 1080 1350 >/dev/null 2>&1

while IFS= read -r med; do
  [ -z "$med" ] && continue
  target="${OUT_DIR}/${med}.png"

  if agent-browser open "${BASE}/${med}" >/dev/null 2>&1; then
    # Pequeña espera para que React monte y la imagen cargue.
    sleep 0.6
    if agent-browser screenshot "$target" >/dev/null 2>&1 && [ -s "$target" ]; then
      OK=$((OK + 1))
      printf '\r[%d/%d] %-42s ok' "$OK" "$TOTAL" "$med"
    else
      FAIL=$((FAIL + 1))
      printf '\r[%d/%d] %-42s FALLÓ' "$OK" "$TOTAL" "$med"
    fi
  else
    FAIL=$((FAIL + 1))
    printf '\r[%d/%d] %-42s ERROR-NAV' "$OK" "$TOTAL" "$med"
  fi
done < "$IDS_FILE"

printf '\n\nListo: %d generados, %d fallidos -> %s\n' "$OK" "$FAIL" "$OUT_DIR"
[ "$FAIL" -eq 0 ]
