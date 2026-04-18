#!/usr/bin/env sh
set -eu

files="$(git diff --name-only --cached -- . ':!pnpm-lock.yaml' ':!node_modules' ':!.pnpm-store' || true)"
if [ -z "$files" ]; then
  exit 0
fi

matches="$(printf '%s\n' "$files" | xargs grep -nE '(SENTRY_DSN=.+[A-Za-z0-9]{20,}|api[_-]?key["'\'']?[=:][[:space:]]*["'\''][A-Za-z0-9_-]{20,}|token["'\'']?[=:][[:space:]]*["'\''][A-Za-z0-9_-]{20,}|password["'\'']?[=:][[:space:]]*["'\''][^"'\''[:space:]]{12,})' 2>/dev/null || true)"

if [ -n "$matches" ]; then
  echo "Secret hook: possible hardcoded secret found:" >&2
  echo "$matches" >&2
  exit 1
fi

echo "Secret hook: no likely secrets found."
