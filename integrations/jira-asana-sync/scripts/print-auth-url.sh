#!/usr/bin/env bash
# Minimal helper to print authorization URLs without secrets in output
set -euo pipefail
PROVIDER=${1:-jira}
case "$PROVIDER" in
  jira)
    node -e "import('./src/index.ts').then(()=>{}).catch(()=>{});" || true
    echo "Use: npm run dev -- --provider=jira --action=auth --dry-run in integrations/jira-asana-sync"
    ;;
  asana)
    node -e "import('./src/index.ts').then(()=>{}).catch(()=>{});" || true
    echo "Use: npm run dev -- --provider=asana --action=auth --dry-run in integrations/jira-asana-sync"
    ;;
  *) echo "Unknown provider"; exit 1;;
esac

