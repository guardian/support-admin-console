#!/usr/bin/env bash
set -euo pipefail

MAX_ROUNDS=5
LINT_CMD="pnpm lint"

for i in $(seq 1 "$MAX_ROUNDS"); do
  echo "Lint round $i..."

  if $LINT_CMD > /tmp/lint-output.txt 2>&1; then
    echo "✅ Lint passed"
    exit 0
  fi

  codex exec "
The project lint is failing.

Run the lint command:
$LINT_CMD

Fix only the lint errors shown below.
Do not refactor unrelated code.
After fixing, stop.

Lint output:
$(cat /tmp/lint-output.txt)
"
done

echo "❌ Lint still failing after $MAX_ROUNDS rounds"
exit 1
