# Cursor Hooks

The markdown files in this directory describe the agent policy for each hook. The executable scripts in `scripts/` provide concrete checks that can be called manually, by Git hooks, or by Cursor workflows when shell execution is available.

Install the repo pre-commit hook:

```bash
pnpm hooks:install
```

This points Git at `.githooks/pre-commit`, which runs the three scripts below against staged files.

## Scripts

- `scripts/check-prisma-change.sh`: verifies schema changes have migration files.
- `scripts/check-endpoint-observability.sh`: scans staged backend controller/service/main changes for Swagger response metadata, DTO-backed mutating routes, structured logging, metrics, global validation, and exception-filter wiring.
- `scripts/check-secrets.sh`: scans tracked files for likely hardcoded secrets.

Run all checks manually after staging candidate changes with `git add`:

```bash
.cursor/hooks/scripts/check-prisma-change.sh
.cursor/hooks/scripts/check-endpoint-observability.sh
.cursor/hooks/scripts/check-secrets.sh
```
