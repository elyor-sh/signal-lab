# /health-check

Use to verify the local Signal Lab stack.

Run or ask the user to run:
1. `docker compose ps`
2. `curl http://localhost:3001/api/health`
3. `curl http://localhost:3001/metrics`
4. Open `http://localhost:3000`
5. Open `http://localhost:3100/d/signal-lab/signal-lab-observability`

Report:
- Which services are healthy.
- Whether API health returned 200.
- Whether metrics include `scenario_runs_total`.
- Whether the dashboard is reachable.
- Any likely next fix.
