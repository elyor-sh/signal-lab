export const scenarioTypes = ['success', 'validation_error', 'system_error', 'slow_request', 'teapot'] as const;

export type ScenarioType = (typeof scenarioTypes)[number];

export interface ScenarioRun {
  id: string;
  type: ScenarioType;
  status: string;
  duration: number | null;
  error?: string | null;
  metadata?: unknown;
  createdAt: string;
}

export interface RunScenarioInput {
  type: ScenarioType;
  name?: string;
}

export class ScenarioRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly signal?: number,
  ) {
    super(message);
    this.name = 'ScenarioRequestError';
  }
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

export async function runScenario(input: RunScenarioInput) {
  const response = await fetch(`${apiBaseUrl}/api/scenarios/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const signal = typeof payload.signal === 'number' ? payload.signal : undefined;
    const message =
      typeof payload.message === 'string'
        ? payload.message
        : Array.isArray(payload.message)
          ? payload.message.join(', ')
          : `Request failed with ${response.status}`;
    throw new ScenarioRequestError(signal ? `${message} signal=${signal}` : message, response.status, signal);
  }

  return payload as ScenarioRun;
}

export async function getScenarioRuns() {
  const response = await fetch(`${apiBaseUrl}/api/scenarios/runs?limit=20`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`Failed to load run history: ${response.status}`);
  }
  return (await response.json()) as ScenarioRun[];
}

export async function getHealth() {
  const response = await fetch(`${apiBaseUrl}/api/health`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }
  return (await response.json()) as { status: string; timestamp: string };
}
