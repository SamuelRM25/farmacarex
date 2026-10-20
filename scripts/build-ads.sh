#!/usr/bin/env bash
# Pipeline completo de generación de ads:
#   1. build de la app
#   2. servidor con fallback SPA + endpoint de guardado
#   3. recorte de fondo blanco (alpha key) de las imágenes
#   4. rebuild con las imágenes recortadas
#   5. screenshots 1080x1350 de cada producto
#
# Uso: ./scripts/build-ads.sh [ids-file] [out-dir] [port]
set -uo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IDS_FILE="${1:-$REPO/.med-ids.txt}"
OUT_DIR="${2:-$HOME/Desktop/Farmacarex-Ads}"
PORT="${3:-8765}"
BASE="http://127.0.0.1:${PORT}"

cd "$REPO" || exit 1
mkdir -p "$OUT_DIR"

cleanup() {
  pkill -f "serve-spa.py ${PORT}" 2>/dev/null
  pkill -f "vite preview" 2>/dev/null
  agent-browser close --all >/dev/null 2>&1
}
trap cleanup EXIT

echo "==> 1/5 Build de la app"
npm run build || exit 1

echo "==> 2/5 Servidor local (SPA fallback + guardado)"
nohup python3 scripts/serve-spa.py "$PORT" "$REPO/dist" > /tmp/ads-server.log 2>&1 &
sleep 2

echo "==> 3/5 Recorte de fondo blanco (alpha key)"
python3 - << 'PY'
import os, json
files = sorted([f for f in os.listdir('public/medicamentos') if f.lower().endswith(('.png', '.jpg', '.jpeg'))])
tpl = open('scripts/alpha-key.html', encoding='utf-8').read().replace('__FILES__', json.dumps(files))
open('dist/alpha-key.html', 'w', encoding='utf-8').write(tpl)
print(f'    {len(files)} imágenes a procesar')
PY
rm -rf dist/medicamentos/alpha
agent-browser open "${BASE}/alpha-key.html" >/dev/null 2>&1
sleep 30
agent-browser eval "document.title" 2>&1 | head -1

echo "==> 4/5 Copia de recortes + rebuild"
mkdir -p public/medicamentos/alpha
cp dist/medicamentos/alpha/*.png public/medicamentos/alpha/ 2>/dev/null
cp dist/medicamentos/alpha/__manifest__.json public/medicamentos/ 2>/dev/null
python3 - << 'PY'
import json, os, re
m = json.load(open('public/medicamentos/__manifest__.json', encoding='utf-8'))
p = 'src/data/medicationImages.ts'
s = open(p, encoding='utf-8').read()
block = re.search(r'const MEDICATION_IMAGES_RAW: Record<string, string> = \{(.*?)\n\};', s, re.S).group(1)
entries = re.findall(r"^\s*([a-z0-9_]+):\s*'([^']+)'", block, re.M)
alpha = {k: True for k, path in entries
         if re.sub(r'\.[^.]+$', '', os.path.basename(path)) + '.png'
         in set(os.listdir('public/medicamentos/alpha'))}
new_block = "const ALPHA: Record<string, true> = {\n" + ''.join(f"  {k}: true,\n" for k in sorted(alpha)) + "};"
s = re.sub(r'const ALPHA: Record<string, true> = \{.*?\n\};', new_block, s, flags=re.S)
open(p, 'w', encoding='utf-8').write(s)
out = ["// Imágenes con fondo blanco recortado (canal alfa) — generadas por",
       "// scripts/alpha-key.html: flood fill desde bordes + despeckle + crop al bbox.",
       f"// {len(alpha)} imágenes con versión recortada; el resto son fotos reales.",
       "export const ALPHA_IMAGES: Record<string, true> = {"]
out += [f"  {k}: true," for k in sorted(alpha)]
out += ["};", "", "export const ALPHA_IMAGE_COUNT = Object.keys(ALPHA_IMAGES).length;"]
open('src/data/medicationImagesAlpha.ts', 'w', encoding='utf-8').write('\n'.join(out))
print(f'    {len(alpha)} con alfa')
PY
npm run build || exit 1

echo "==> 5/5 Screenshots de cada producto"
if [ ! -f "$IDS_FILE" ]; then
  grep -oE "^    id: '[^']+'" src/data/medications.ts | sed "s/^    id: '//; s/'$//" > "$IDS_FILE"
fi
./scripts/generate-ads.sh "$IDS_FILE" "$OUT_DIR" "$PORT" || exit 1

echo
echo "Listo. $(ls "$OUT_DIR"/*.png 2>/dev/null | wc -l | tr -d ' ') ads en $OUT_DIR"
