# /run-prd

Use the `signal-lab-orchestrator` skill to execute a PRD.

Instructions:
1. Read the target PRD or ask for a path if none was provided.
2. Invoke `.cursor/skills/signal-lab-orchestrator/SKILL.md`.
3. Create or resume `.execution/<timestamp>/context.json`.
4. Run the phases in order: analysis, codebase scan, planning, decomposition, implementation, review, report.
5. Delegate atomic tasks to the custom skills named in the context file.
6. Update `PLAN/plan-06-04-26.md` after verified completion.
