# /check-obs

Use to review whether a Signal Lab change is observability-ready.

Checklist:
1. Confirm every scenario path records `scenario_runs_total`.
2. Confirm successful or slow scenarios record `scenario_run_duration_seconds`.
3. Confirm HTTP requests are visible in `http_requests_total`.
4. Confirm logs are JSON and include `app`, `context`, and scenario fields.
5. Confirm `system_error` calls Sentry exception capture.
6. Confirm Prometheus scrape config still points to `/metrics`.
7. Confirm Grafana dashboard queries refer to existing metric names.
8. Report gaps with exact files and proposed fixes.
