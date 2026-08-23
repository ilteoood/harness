#!/bin/bash
set -euo pipefail

if [ -n "${CONTEXT7_API_KEY:-}" ]; then
  npx -y ctx7 setup --claude --cli --api-key "$CONTEXT7_API_KEY"
fi

exec paseo daemon start --foreground