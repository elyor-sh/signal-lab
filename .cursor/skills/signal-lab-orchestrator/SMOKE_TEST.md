# Orchestrator Smoke Test

This smoke test validates the orchestrator instructions without requiring a native Cursor Task tool.

## Command

```text
/run-prd prds/002_prd-observability-demo.md
```

## Expected Result

1. The orchestrator creates `.execution/<timestamp>/context.json`.
2. The context file uses the structure shown in `context.example.json`.
3. Completed phases are not rerun on resume.
4. Each task has `skill`, `complexity`, `model`, `dependencies`, and `status`.
5. If Cursor has no subagent tool, the orchestrator follows the fallback in `SKILL.md`: focused chats or one local atomic task at a time.

## Local Evidence

`context.example.json` is a committed smoke fixture for PRD 002. A real run should create an ignored `.execution/<timestamp>/context.json` with the same schema.
