import { Injectable } from '@nestjs/common';
import { Counter, Histogram, Registry, collectDefaultMetrics } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly registry = new Registry();
  private readonly scenarioRunsTotal: Counter<string>;
  private readonly scenarioRunDurationSeconds: Histogram<string>;
  private readonly httpRequestsTotal: Counter<string>;

  constructor() {
    collectDefaultMetrics({
      register: this.registry,
      prefix: 'signal_lab_',
    });

    this.scenarioRunsTotal = new Counter({
      name: 'scenario_runs_total',
      help: 'Total scenario runs by type and status',
      labelNames: ['type', 'status'],
      registers: [this.registry],
    });

    this.scenarioRunDurationSeconds = new Histogram({
      name: 'scenario_run_duration_seconds',
      help: 'Scenario run duration in seconds by type',
      labelNames: ['type'],
      buckets: [0.05, 0.1, 0.25, 0.5, 1, 2, 3, 5, 8, 13],
      registers: [this.registry],
    });

    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total HTTP requests by method, path, and status code',
      labelNames: ['method', 'path', 'status_code'],
      registers: [this.registry],
    });
  }

  recordScenario(type: string, status: string, durationMs?: number) {
    this.scenarioRunsTotal.inc({ type, status });
    if (durationMs !== undefined) {
      this.scenarioRunDurationSeconds.observe({ type }, durationMs / 1000);
    }
  }

  recordHttpRequest(method: string, path: string, statusCode: number) {
    this.httpRequestsTotal.inc({
      method,
      path: this.normalizePath(path),
      status_code: String(statusCode),
    });
  }

  metrics() {
    return this.registry.metrics();
  }

  contentType() {
    return this.registry.contentType;
  }

  private normalizePath(path: string) {
    return path.replace(/[a-z0-9]{20,}/gi, ':id');
  }
}
