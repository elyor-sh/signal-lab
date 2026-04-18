---
name: signal-lab-observability
description: Add or review Signal Lab metrics, structured logs, Sentry capture, and Grafana/Loki wiring.
---

# Signal Lab Observability Skill

## When to Use

Use this skill when adding a backend scenario, endpoint, background task, or review that must emit observability signals.

## Instructions

1. Read `.cursor/rules/observability-conventions.mdc`.
2. Identify every success, validation, slow, and failure path.
3. For scenario execution, record:
   - `scenario_runs_total{type,status}`
   - `scenario_run_duration_seconds{type}` when a duration exists
4. For HTTP traffic, keep `http_requests_total{method,path,status_code}` handled by middleware.
5. Emit one JSON log per scenario path with:
   - `scenarioType`
   - `scenarioId`
   - `duration`
   - `error` when present
6. Capture Sentry exceptions only for unexpected/system failures.
7. Add breadcrumbs for expected validation failures when useful.
8. If metric names change, update Prometheus queries, Grafana dashboard, README, and `/check-obs`.

## Done Criteria

- Prometheus exposes the metric.
- Loki can filter logs by `{app="signal-lab"}` and `scenarioType`.
- Sentry receives `system_error` when `SENTRY_DSN` is set.
- Grafana panels use real metric names.
