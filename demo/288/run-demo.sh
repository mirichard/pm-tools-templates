#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
cd "$SCRIPT_DIR"

# Install deps if needed
if [ ! -d node_modules ]; then
  npm ci || npm install
fi

# Build and preview
npm run build
# Kill any prior preview on 5179
if lsof -iTCP:5179 -sTCP:LISTEN >/dev/null 2>&1; then
  kill $(lsof -t -iTCP:5179 -sTCP:LISTEN) || true
fi
nohup npm run preview >/tmp/demo-288.log 2>&1 &
PREVIEW_PID=$!
# Wait a moment for server
sleep 1

# Quick verification: fetch index
curl -sSf http://127.0.0.1:5179/ >/dev/null

echo "Demo 288 running at http://127.0.0.1:5179/ (pid $PREVIEW_PID)"
