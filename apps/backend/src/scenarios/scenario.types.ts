export const SCENARIO_TYPES = ['success', 'validation_error', 'system_error', 'slow_request', 'teapot'] as const;

export type ScenarioType = (typeof SCENARIO_TYPES)[number];

export interface ScenarioResponse {
  id: string;
  type: ScenarioType;
  status: string;
  duration: number | null;
  createdAt: Date;
  signal?: number;
  message?: string;
}
