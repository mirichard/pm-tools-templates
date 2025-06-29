#!/bin/bash

# Start the Dashboard MVP demo from the repository root
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="${SCRIPT_DIR}/.."
cd "$ROOT_DIR/dashboard-mvp"

if [ ! -d node_modules ]; then
  echo "Installing dashboard-mvp dependencies..."
  npm install
fi

# Copy environment template if missing
test -f .env.local || cp .env.example .env.local

npm run dev
