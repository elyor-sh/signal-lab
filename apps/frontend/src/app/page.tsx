'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  getHealth,
  getScenarioRuns,
  runScenario,
  scenarioTypes,
  ScenarioRequestError,
  ScenarioRun,
  ScenarioType,
} from '@/lib/api';

type FormValues = {
  type: ScenarioType;
  name: string;
};

const grafanaUrl = process.env.NEXT_PUBLIC_GRAFANA_URL ?? 'http://localhost:3100/d/signal-lab/signal-lab-observability';
const metricsUrl = process.env.NEXT_PUBLIC_METRICS_URL ?? 'http://localhost:3001/metrics';
const lokiExploreUrl = toGrafanaExploreUrl(process.env.NEXT_PUBLIC_LOKI_EXPLORE_URL ?? 'http://localhost:3100/explore');

export default function Home() {
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({
    defaultValues: {
      type: 'success',
      name: '',
    },
  });

  const healthQuery = useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
    refetchInterval: 15000,
  });

  const historyQuery = useQuery({
    queryKey: ['scenario-runs'],
    queryFn: getScenarioRuns,
    refetchInterval: 5000,
  });

  const mutation = useMutation({
    mutationFn: runScenario,
    onSuccess: (run) => {
      toast.success(`Scenario ${run.type} finished as ${run.status}`);
      form.reset({ type: run.type, name: '' });
    },
    onError: (error) => {
      if (error instanceof ScenarioRequestError && error.signal === 42) {
        toast.warning('Teapot signal received: 42');
        form.reset({ type: form.getValues('type'), name: '' });
        return;
      }
      toast.error(error instanceof Error ? error.message : 'Scenario failed');
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['scenario-runs'] });
    },
  });

  function onSubmit(values: FormValues) {
    mutation.mutate({
      type: values.type,
      name: values.name.trim() || undefined,
    });
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-3 rounded-lg border border-border bg-white/90 px-5 py-4 shadow-panel sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-teal-700">Signal Lab</p>
            <h1 className="mt-1 text-3xl font-bold text-foreground">Scenario observability playground</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Run a scenario, then inspect the resulting metrics, logs, dashboard panels, and Sentry event.
            </p>
          </div>
          <Badge tone={healthQuery.data?.status === 'ok' ? 'success' : 'warning'}>
            API {healthQuery.data?.status ?? 'checking'}
          </Badge>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)_minmax(260px,320px)]">
          <Card>
            <CardHeader>
              <CardTitle>Run Scenario</CardTitle>
              <CardDescription>Each run writes a database row and emits observability signals.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <label className="block space-y-2">
                  <span className="text-sm font-medium">Scenario type</span>
                  <Controller
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select scenario" />
                        </SelectTrigger>
                        <SelectContent>
                          {scenarioTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-medium">Name</span>
                  <Input placeholder="Optional label for this run" {...form.register('name')} />
                </label>
                <Button className="w-full" type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? 'Running...' : 'Run Scenario'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Run History</CardTitle>
              <CardDescription>Latest 20 runs, refreshed every 5 seconds.</CardDescription>
            </CardHeader>
            <CardContent>
              {historyQuery.isLoading ? (
                <p className="text-sm text-muted-foreground">Loading runs...</p>
              ) : historyQuery.isError ? (
                <p className="text-sm text-red-700">Run history is unavailable.</p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="min-w-[620px] w-full border-collapse bg-white text-sm">
                    <thead className="bg-muted text-left text-muted-foreground">
                      <tr>
                        <th className="w-[170px] px-3 py-2 font-medium">Type</th>
                        <th className="w-[160px] px-3 py-2 font-medium">Status</th>
                        <th className="w-[110px] px-3 py-2 font-medium">Duration</th>
                        <th className="w-[180px] px-3 py-2 font-medium">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(historyQuery.data ?? []).map((run) => (
                        <RunRow key={run.id} run={run} />
                      ))}
                      {historyQuery.data?.length === 0 ? (
                        <tr>
                          <td className="px-3 py-8 text-center text-muted-foreground" colSpan={4}>
                            No runs yet.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Observability Links</CardTitle>
              <CardDescription>Use these after running a scenario.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <ObsLink href={metricsUrl} label="Prometheus metrics" />
                <ObsLink href={grafanaUrl} label="Grafana dashboard" />
                <ObsLink href={lokiExploreUrl} label="Loki Explore" />
                <div className="rounded-md border border-border bg-muted p-3">
                  <p className="font-medium">Loki query</p>
                  <code className="mt-1 block break-words text-xs">{'{app="signal-lab"} | json'}</code>
                </div>
                <div className="rounded-md border border-border bg-muted p-3">
                  <p className="font-medium">Sentry</p>
                  <p className="mt-1 text-muted-foreground">Set SENTRY_DSN, run system_error, then check the project dashboard.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

function RunRow({ run }: { run: ScenarioRun }) {
  return (
    <tr className="border-t border-border">
      <td className="whitespace-nowrap px-3 py-3 font-medium">{run.type}</td>
      <td className="whitespace-nowrap px-3 py-3">
        <Badge className="whitespace-nowrap" tone={toneForStatus(run.status)}>
          {run.status}
        </Badge>
      </td>
      <td className="whitespace-nowrap px-3 py-3">{run.duration === null ? '-' : `${run.duration}ms`}</td>
      <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{new Date(run.createdAt).toLocaleString()}</td>
    </tr>
  );
}

function toneForStatus(status: string): 'success' | 'warning' | 'danger' | 'neutral' {
  if (status === 'completed') {
    return 'success';
  }
  if (status === 'error') {
    return 'danger';
  }
  if (status === 'validation_error' || status === 'teapot') {
    return 'warning';
  }
  return 'neutral';
}

function toGrafanaExploreUrl(rawUrl: string) {
  const url = new URL(rawUrl);

  if (url.pathname === '' || url.pathname === '/') {
    url.pathname = '/explore';
  }

  url.searchParams.set('orgId', '1');
  url.searchParams.set('schemaVersion', '1');
  url.searchParams.set('timezone', 'browser');

  if (!url.searchParams.has('panes')) {
    url.searchParams.set(
      'panes',
      JSON.stringify({
        signalLabLogs: {
          datasource: 'Loki',
          queries: [
            {
              refId: 'A',
              datasource: {
                type: 'loki',
                uid: 'Loki',
              },
              editorMode: 'code',
              expr: '{app="signal-lab"} | json',
              queryType: 'range',
            },
          ],
          range: {
            from: 'now-6h',
            to: 'now',
          },
        },
      }),
    );
  }

  return url.toString();
}

function ObsLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      className="flex items-center justify-between rounded-md border border-border bg-white px-3 py-2 font-medium hover:border-primary"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <span>{label}</span>
      <span aria-hidden="true">open</span>
    </a>
  );
}
