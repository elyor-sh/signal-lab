---
name: signal-lab-orchestrator
description: Execute Signal Lab PRDs through context-efficient analysis, decomposition, implementation, review, resume, and reporting.
---

# Signal Lab Orchestrator

## When to Use

Use when the user asks to run or implement a PRD, execute a plan with subagents, resume a paused implementation, or split work into atomic tasks.

## Operating Rule

The orchestrator coordinates. It does not do all implementation itself. It writes durable state to `.execution/<timestamp>/context.json`, delegates atomic tasks to focused agents/skills, reviews results, and resumes from context after interruption.

## Cursor Delegation Mechanism

Use the strongest available Cursor mechanism in this order:

1. If Cursor exposes a Task/subagent tool, create one task per atomic item and pass the matching prompt from `COORDINATION.md`.
2. If no Task tool is available, open a new focused chat for each delegation group, paste the role prompt plus only the relevant `context.json` task, choose the requested model (`fast` or `default`), and paste the result back into the orchestrator chat.
3. If neither is possible, execute the task locally but keep the same discipline: one atomic task, assigned skill, minimal context, update `context.json` immediately after completion.

Every delegated result must include changed files, verification performed, and whether the task is complete, failed, or needs retry.

## Required Input

Accept either:
- a PRD file path such as `prds/002_prd-observability-demo.md`
- pasted PRD text

If a matching `.execution/*/context.json` already exists for the PRD and is not complete, resume it.

## Context File Shape

Create `.execution/<timestamp>/context.json`:

```json
{
  "executionId": "2026-04-16-16-30",
  "prdPath": "prds/002_prd-observability-demo.md",
  "status": "in_progress",
  "currentPhase": "analysis",
  "metadata": {
    "hiddenSignal": 42
  },
  "phases": {
    "analysis": { "status": "pending" },
    "codebase": { "status": "pending" },
    "planning": { "status": "pending" },
    "decomposition": { "status": "pending" },
    "implementation": { "status": "pending", "completedTasks": 0, "totalTasks": 0 },
    "review": { "status": "pending" },
    "report": { "status": "pending" }
  },
  "tasks": []
}
```

## Phases

1. PRD Analysis: extract requirements, constraints, public interfaces, acceptance criteria, and hidden details.
2. Codebase Scan: inspect current structure and identify existing implementation.
3. Planning: define implementation sequence and integration boundaries.
4. Decomposition: create 5-10 minute atomic tasks with dependencies.
5. Implementation: delegate tasks by dependency group.
6. Review: run readonly reviewers for database, backend, frontend, observability, and AI layer.
7. Report: summarize completed tasks, failed tasks, retries, duration, and model usage.

## Task Requirements

Every task must include:
- `id`
- `title`
- `type`
- `skill`
- `complexity`: `low`, `medium`, or `high`
- `model`: `fast` or `default`
- `dependencies`
- `status`

## Skill Routing

Route tasks by domain before choosing a model:

| Task type | Required skill |
|---|---|
| `database` | `prisma-change` |
| `backend` | `nestjs-endpoint` |
| `frontend` | `shadcn-form` |
| `observability` | `signal-lab-observability` |
| `review` | `signal-lab-orchestrator` |

If a task crosses domains, assign the skill that owns the riskiest contract and list secondary skills in the task notes.

Use fast model for 80%+ of low-risk mechanical work:
- DTOs
- Prisma field additions
- simple UI components
- metric/log additions
- documentation updates

Use default model for:
- architecture planning
- cross-system integration
- review with trade-offs
- failure recovery decisions

## Review Loop

For each domain:
1. Run readonly reviewer.
2. If failed, delegate fix with reviewer feedback.
3. Retry up to 3 times.
4. If still failed, mark failed and continue with remaining independent tasks.

## Final Report

Return:
- completed count
- failed count
- retry count
- approximate duration
- model usage
- completed artifacts
- failed artifacts
- next manual steps
