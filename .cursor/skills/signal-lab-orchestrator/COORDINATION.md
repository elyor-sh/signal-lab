# Orchestrator Coordination Prompts

## Analysis Agent

Read the PRD and return requirements, constraints, public APIs, acceptance criteria, and hidden/bonus details. Do not implement.

## Codebase Scan Agent

Inspect the repository and summarize existing directories, implemented features, missing artifacts, and likely integration points. Do not modify files.

## Implementer Agent

Implement exactly one task from `context.json`. Follow the assigned skill and only edit files needed for that task. Report changed paths and verification performed.

## Reviewer Agent

Review one domain readonly. Prioritize bugs, missing requirements, unverified behavior, and conflicts with `.cursor/rules`.

## Reporter Agent

Summarize execution state from `context.json`, including completed, failed, retries, model usage, and next steps.
