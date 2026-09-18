#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null && pwd)
cd "$SCRIPT_DIR"

# Build
npm ci || npm install
npm run build

# Serve via plain python to avoid tool interference
PORT=5181
if lsof -iTCP:${PORT} -sTCP:LISTEN >/dev/null 2>&1; then
  kill $(lsof -t -iTCP:${PORT} -sTCP:LISTEN) || true
fi
nohup python3 -m http.server ${PORT} --bind 127.0.0.1 --directory "$SCRIPT_DIR/dist" >/tmp/demo-288-py.log 2>&1 &
SERVER_PID=$!
sleep 1

# Run tests with BASE_URL
export BASE_URL="http://127.0.0.1:${PORT}/"

npx playwright install --with-deps chromium
npm run test:a11y || (echo "A11y tests failed" && exit 1)
npm run test:uat || (echo "UAT tests failed" && exit 1)
npx playwright test tests/interaction.spec.ts || (echo "Interaction tests failed" && exit 1)

echo "All tests passed. Demo verified at $BASE_URL"
