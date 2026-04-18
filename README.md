# Signal Lab

Signal Lab is an observability playground and Cursor AI-layer demo. It lets an interviewer run backend scenarios from a Next.js UI and verify the resulting PostgreSQL row, Prometheus metrics, Loki logs, Grafana dashboard panels, and Sentry exception capture.

## Stack

- Frontend: Next.js App Router, Tailwind CSS, shadcn-style UI components, TanStack Query, React Hook Form
- Backend: NestJS, TypeScript strict mode
- Data: PostgreSQL 16, Prisma
- Observability: Prometheus, Grafana, Loki, Promtail, Sentry
- Infra: Docker Compose

## Prerequisites

- Docker Desktop or Docker Engine with Compose v2
- Node.js 22 and pnpm 9 if running outside Docker
- Optional: a real Sentry DSN for full Sentry verification

## Start

```bash
cp .env.example .env
docker compose up -d
```

The first boot builds the app images, installs dependencies during image build, generates Prisma Client, applies migrations, and starts hot-reload dev servers.

First boot takes about 2-3 minutes because dependencies are installed during image build, Prisma Client is generated, migrations are applied, and dev servers start. Subsequent restarts are faster.

## Verify

```bash
curl http://localhost:3001/api/health
curl http://localhost:3001/metrics
```

Open:

- UI: http://localhost:3000
- Swagger: http://localhost:3001/api/docs
- Metrics: http://localhost:3001/metrics
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3100/d/signal-lab/signal-lab-observability
- Grafana Explore for Loki: http://localhost:3100/explore

Grafana default credentials are `admin` / `admin`. Anonymous Editor access is enabled for the local demo so the dashboard and Explore links open without a login.

If the default PostgreSQL host port is already used locally, keep the internal Docker networking unchanged and override only the host PostgreSQL port:

```bash
POSTGRES_PORT=55432 docker compose up -d
```

For submission review, keep the frontend on the assignment default: `http://localhost:3000`.

## Stop

```bash
docker compose down
```

To remove persisted local data:

```bash
docker compose down -v
```

## Demo Walkthrough

Target duration: 5-10 minutes from a warm stack.

1. Run `docker compose up -d`.
2. Open http://localhost:3000.
3. Run `success`; the history table should show a green `completed` badge.
4. Run `system_error`; the UI should show an error toast and a red `error` history badge.
5. Open http://localhost:3001/metrics and confirm `scenario_runs_total` exists.
6. Open Grafana at http://localhost:3100/d/signal-lab/signal-lab-observability and confirm panels update.
7. In Grafana Explore, choose Loki and run:

```logql
{app="signal-lab"} | json
```

8. Run `system_error`. Without `SENTRY_DSN`, verify the local Sentry fallback log in backend logs or Loki by searching `sentryEvent="exception"`. With `SENTRY_DSN`, open Sentry and confirm the remote exception event.
9. Run `teapot`; the API returns HTTP 418 with `signal: 42`, and the run is stored with bonus metadata.

## Scenario Types

| Type | Expected behavior | Signals |
|---|---|---|
| `success` | Saves a completed run and returns 200 | info log, counter, latency histogram |
| `validation_error` | Saves a validation failure and returns 400 | warn log, error counter, Sentry breadcrumb |
| `system_error` | Saves an error and returns 500 | error log, error counter, Sentry exception |
| `slow_request` | Waits 2-5 seconds, then succeeds | warn log, counter, latency spike |
| `teapot` | Saves bonus run and returns 418 with `signal: 42` | warn log, teapot counter label |

## Local Development Without Docker

```bash
pnpm install
pnpm --filter @signal-lab/backend prisma:generate
pnpm --filter @signal-lab/backend prisma:migrate
pnpm dev
```

Use a local PostgreSQL instance and set `DATABASE_URL` accordingly.

## Sentry Modes

Signal Lab supports two Sentry verification modes:

- Without `SENTRY_DSN`, the backend logs local fallback events with `sentryMode: "local"` and `sentryEvent: "exception"` or `sentryEvent: "breadcrumb"`. This proves the application reached the Sentry capture path without needing a secret.
- With a real HTTPS `SENTRY_DSN`, the backend initializes `@sentry/node`, queues real remote events, flushes on shutdown, and logs `sentryMode: "remote"` plus the Sentry event id.
- Placeholder or invalid DSN values are treated as local mode to avoid noisy first-boot failures.

## AI Layer

The `.cursor` directory is designed so a new Cursor chat can continue work without manual onboarding.

The AI layer is built as one operating system, not a loose folder dump. Rules prevent stack and observability drift, skills encode repeatable implementation workflows, commands shortcut common review paths, hooks catch missed migrations/metrics/secrets before handoff, and marketplace skills provide generic framework expertise where custom Signal Lab rules should stay small.

### Rules

| File | Purpose |
|---|---|
| `.cursor/rules/stack-constraints.mdc` | Locks required stack and prevents unsupported substitutions. |
| `.cursor/rules/frontend-patterns.mdc` | Enforces App Router, TanStack Query, RHF, and UI component conventions. |
| `.cursor/rules/prisma-patterns.mdc` | Defines Prisma schema, migration, and query rules. |
| `.cursor/rules/observability-conventions.mdc` | Fixes metric names, log shape, Loki labels, and Sentry behavior. |
| `.cursor/rules/error-handling.mdc` | Defines backend/frontend error handling expectations. |

### Custom Skills

| Skill | When to use |
|---|---|
| `signal-lab-observability` | Add or review metrics, JSON logs, Loki, Grafana, and Sentry behavior. |
| `nestjs-endpoint` | Add a backend route with DTO validation, Swagger, errors, logs, and metrics. |
| `shadcn-form` | Add a frontend form with RHF, shadcn-style components, mutation, and toasts. |
| `prisma-change` | Change schema or migrations safely. |
| `signal-lab-orchestrator` | Execute PRDs through analysis, decomposition, delegation, review, resume, and report. |

### Commands

| Command | Purpose |
|---|---|
| `/add-endpoint` | Scaffold or modify a NestJS endpoint with observability requirements. |
| `/check-obs` | Review whether metrics, logs, Sentry, Prometheus, and Grafana are wired correctly. |
| `/run-prd` | Run a PRD through the orchestrator skill. |
| `/health-check` | Verify Docker services, API health, metrics, UI, and dashboard reachability. |

### Hooks

| Hook | Problem solved |
|---|---|
| `schema-change` | Prevents schema edits without migrations or generated client updates. |
| `new-endpoint` | Prevents routes without validation, Swagger, logs, metrics, or frontend docs. |
| `before-commit-secrets` | Catches accidental secrets before final handoff. |

The hook policies are markdown files, and executable checks live under `.cursor/hooks/scripts`.

```bash
pnpm hooks:install
.cursor/hooks/scripts/check-prisma-change.sh
.cursor/hooks/scripts/check-endpoint-observability.sh
.cursor/hooks/scripts/check-secrets.sh
```

### Marketplace Skills

See `.cursor/marketplace-skills.md` for the selected marketplace skills and rationale. The custom skills cover Signal Lab-specific semantics that marketplace skills cannot know: exact scenario types, metric names, Loki labels, Sentry behavior, and the orchestrator context file.

## Orchestrator

The orchestrator lives at `.cursor/skills/signal-lab-orchestrator`.

It accepts PRD text or a PRD path, creates `.execution/<timestamp>/context.json`, runs seven phases, marks tasks as `fast` or `default`, retries failed domain work up to three times, and resumes from the context file if interrupted. The skill documents Cursor-specific delegation fallback: native Task/subagent tool, focused separate chats, or one local atomic task at a time when no subagent runtime exists.

Example:

```text
/run-prd prds/002_prd-observability-demo.md
```

Smoke-test evidence and schema examples are in `.cursor/skills/signal-lab-orchestrator/SMOKE_TEST.md` and `.cursor/skills/signal-lab-orchestrator/context.example.json`.

## Implementation Tracker

The live checklist is in `PLAN/plan-06-04-26.md`. Completed items should be checked only after the corresponding artifact exists and behavior has been verified.
