# Signal Lab — Submission Checklist

Заполни этот файл перед сдачей. Он поможет интервьюеру быстро проверить решение.

---

## Репозиторий

- **URL**: `git@github.com:NVBespalov/Signal-Lab.git`
- **Ветка**: `main`
- **Время работы** (приблизительно): `8-10` часов

---

## Запуск

```bash
# Команда запуска:
docker compose up -d

# Команда проверки:
curl http://localhost:3001/api/health
curl http://localhost:3001/metrics

# Команда остановки:
docker compose down
```

**Предусловия**: Docker Compose v2. Node.js 22 и pnpm 9 нужны только для запуска вне Docker. Для remote Sentry нужен реальный HTTPS `SENTRY_DSN` в `.env`; пустой или placeholder DSN включает local fallback logs.

---

## Стек — подтверждение использования

| Технология | Используется? | Где посмотреть |
|-----------|:------------:|----------------|
| Next.js (App Router) | ☑ | `apps/frontend/src/app` |
| shadcn/ui | ☑ | `apps/frontend/src/components/ui` |
| Tailwind CSS | ☑ | `apps/frontend/tailwind.config.ts`, `apps/frontend/src/app/globals.css` |
| TanStack Query | ☑ | `apps/frontend/src/app/page.tsx`, `apps/frontend/src/app/providers.tsx` |
| React Hook Form | ☑ | `apps/frontend/src/app/page.tsx` |
| NestJS | ☑ | `apps/backend/src` |
| PostgreSQL | ☑ | `docker-compose.yml` service `postgres` |
| Prisma | ☑ | `prisma/schema.prisma`, `apps/backend/src/prisma` |
| Sentry | ☑ | `apps/backend/src/common/sentry.service.ts` |
| Prometheus | ☑ | `observability/prometheus/prometheus.yml`, `apps/backend/src/metrics` |
| Grafana | ☑ | `observability/grafana` |
| Loki | ☑ | `observability/loki`, `observability/promtail` |

---

## Observability Verification

Опиши, как интервьюер может проверить каждый сигнал:

| Сигнал | Как воспроизвести | Где посмотреть результат |
|--------|-------------------|------------------------|
| Prometheus metric | Run `success` or `system_error` from UI | `http://localhost:3001/metrics`, search `scenario_runs_total` |
| Grafana dashboard | Run several scenario types | `http://localhost:3100/d/signal-lab/signal-lab-observability` |
| Loki log | Run any scenario | Click `Loki Explore` from the UI or use Grafana Explore query `{app="signal-lab"} | json` |
| Sentry exception | Run `system_error` without DSN for local fallback, or set `SENTRY_DSN` for remote mode | Backend/Loki log with `sentryEvent="exception"` or Sentry project issues/events |

---

## Cursor AI Layer

Эта AI layer устроена как система контроля качества, а не как набор разрозненных файлов. Rules постоянно держат стек и observability conventions в контексте, skills кодируют повторяемые workflows, commands ускоряют типовые проверки, hooks ловят забытые migration/metrics/secrets до сдачи, а marketplace skills закрывают общие best practices там, где custom Signal Lab knowledge не нужен.

### Custom Skills

| # | Skill name | Назначение |
|---|-----------|-----------|
| 1 | `signal-lab-observability` | Добавлять и проверять метрики, JSON-логи, Loki, Grafana, Sentry. |
| 2 | `nestjs-endpoint` | Создавать NestJS endpoint по conventions проекта. |
| 3 | `shadcn-form` | Создавать frontend формы с RHF, TanStack Query и shadcn-style UI. |
| 4 | `prisma-change` | Безопасно менять Prisma schema и миграции. |
| 5 | `signal-lab-orchestrator` | Исполнять PRD через фазы, context file, decomposition, review и resume. |

### Commands

| # | Command | Что делает |
|---|---------|-----------|
| 1 | `/add-endpoint` | Ведёт агента по добавлению backend endpoint с observability. |
| 2 | `/check-obs` | Проверяет метрики, логи, Sentry, Prometheus, Grafana. |
| 3 | `/run-prd` | Запускает PRD через orchestrator skill. |
| 4 | `/health-check` | Проверяет Docker stack, API health, metrics, UI, dashboard. |

### Hooks

| # | Hook | Какую проблему решает |
|---|------|----------------------|
| 1 | `schema-change` | Не даёт забыть миграцию и Prisma generate после schema change; executable check: `.cursor/hooks/scripts/check-prisma-change.sh`. |
| 2 | `new-endpoint` | Не даёт забыть validation, Swagger, logs, metrics для endpoint; executable check: `.cursor/hooks/scripts/check-endpoint-observability.sh`. |
| 3 | `before-commit-secrets` | Ловит реальные секреты перед сдачей; executable check: `.cursor/hooks/scripts/check-secrets.sh`. |

Install hook runner: `pnpm hooks:install`, which points Git to `.githooks/pre-commit`.

### Rules

| # | Rule file | Что фиксирует |
|---|----------|---------------|
| 1 | `stack-constraints.mdc` | Обязательный стек и запрещённые замены. |
| 2 | `frontend-patterns.mdc` | Next App Router, TanStack Query, RHF, UI conventions. |
| 3 | `prisma-patterns.mdc` | Prisma schema, migrations, запрет других ORM/raw SQL без причины. |
| 4 | `observability-conventions.mdc` | Naming метрик, JSON log shape, Loki labels, Sentry rules. |
| 5 | `error-handling.mdc` | Backend/frontend error handling. |

### Marketplace Skills

| # | Skill | Зачем подключён |
|---|-------|----------------|
| 1 | `next-best-practices` | Next.js App Router и production patterns. |
| 2 | `shadcn-ui` | shadcn компоненты и composition patterns. |
| 3 | `tailwind-v4-shadcn` | Tailwind tokens и shadcn styling conventions. |
| 4 | `nestjs-best-practices` | Nest modules, DTOs, providers, filters, Swagger. |
| 5 | `prisma-orm` | Prisma schema, migrations, generated client. |
| 6 | `docker-expert` | Compose, volumes, health checks, service networking. |
| 7 | `postgresql-table-design` | Table design, indexes, migration review. |

**Что закрыли custom skills, чего нет в marketplace:**

Signal Lab-specific scenario semantics, exact metric names, JSON log fields, Loki query labels, Sentry rules, hidden `teapot` scenario, and PRD orchestrator context/resume flow.

---

## Orchestrator

- **Путь к skill**: `.cursor/skills/signal-lab-orchestrator/SKILL.md`
- **Путь к context file** (пример реального запуска): `.execution/<timestamp>/context.json`
- **Committed smoke fixture**: `.cursor/skills/signal-lab-orchestrator/context.example.json`
- **Local smoke context**: `.execution/2026-04-16-review-smoke/context.json` (ignored by git)
- **Сколько фаз**: `7`
- **Какие задачи для fast model**: DTOs, Prisma field/migration edits, simple endpoint wiring, simple UI components, metric/log additions, documentation updates.
- **Поддерживает resume**: да

---

## Скриншоты / видео

- [ ] UI приложения
- [ ] Grafana dashboard с данными
- [ ] Loki logs
- [ ] Sentry local fallback log (`sentryEvent="exception"`)
- [ ] Sentry remote event (optional, only with real `SENTRY_DSN`)

(Приложи файлы или ссылки ниже)

---

## Что не успел и что сделал бы первым при +4 часах

Before final submission, run the full Docker walkthrough. Without a real Sentry DSN, capture the local fallback Sentry log. With a real Sentry DSN, attach the remote Sentry event screenshot. If more time is available, add automated e2e tests for the browser demo path.

---

## Вопросы для защиты

1. Почему именно такая декомпозиция skills?
2. Какие задачи подходят для малой модели и почему?
3. Какие marketplace skills подключил, а какие заменил custom — и почему?
4. Какие hooks реально снижают ошибки в повседневной работе?
5. Как orchestrator экономит контекст по сравнению с одним большим промптом?
