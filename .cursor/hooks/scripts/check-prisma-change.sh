#!/usr/bin/env sh
set -eu

if ! git diff --name-only --cached -- . ':!node_modules' | grep -q '^prisma/schema.prisma$'; then
  exit 0
fi

if git diff --name-only --cached -- . ':!node_modules' | grep -q '^prisma/migrations/'; then
  echo "Prisma hook: schema change has a migration."
  exit 0
fi

echo "Prisma hook: prisma/schema.prisma changed but no prisma/migrations file is staged." >&2
echo "Create a migration before committing the schema change." >&2
exit 1
