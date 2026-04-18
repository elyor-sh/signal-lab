# Example

User:

```text
/run-prd prds/002_prd-observability-demo.md
```

Expected behavior:

1. Create `.execution/<timestamp>/context.json`.
2. Analyze PRD 002 and identify scenario types, metrics, logs, Sentry, Grafana, Loki, and the `teapot` bonus.
3. Scan the codebase for existing scenario implementation.
4. Decompose missing work into atomic tasks.
5. Delegate simple UI/API/metric tasks to fast model and cross-system review to default model.
6. Resume from `context.json` if interrupted.
7. Produce a final report with verification commands.

Final report example:

```text
Signal Lab PRD Execution Report

Execution: .execution/2026-04-16-16-30/context.json
Status: completed
Duration: 42 minutes

Completed tasks: 10/10
Failed tasks: 0
Retries used: 1

Model usage:
- fast: 8 tasks
- default: 2 tasks

Completed artifacts:
- Prisma ScenarioRun migration and generated client
- NestJS scenario endpoints with DTO validation and Swagger
- Scenario metrics, structured JSON logs, Loki labels, and Sentry capture
- Next.js scenario form, toast feedback, and latest-run history
- Grafana dashboard panels for runs, latency, errors, HTTP rate, and Loki logs

Verification:
- pnpm --filter @signal-lab/backend typecheck
- pnpm --filter @signal-lab/frontend typecheck
- docker compose config
- curl http://localhost:3001/api/health
- curl http://localhost:3001/metrics

Next steps:
- Add real SENTRY_DSN and confirm the system_error event in Sentry
- Capture final UI, Grafana, Loki, and Sentry screenshots for submission
```
