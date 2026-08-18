# Agentic Workflow Orchestration Rules

## 1. Conditional Orchestration Override
* **Bypass System-Level Planning on Feature Mention**: When the user explicitly mentions or references the `feature` orchestrator skill (e.g. `@feature`, `@[# feature — Master Orchestrator]`, or any mention of the local feature skill), bypass the system-level `implementation_plan.md` planning mode. Do not generate or demand approvals for `implementation_plan.md`.
* **Execute Feature Skill Instructions**: Instead, proceed directly by driving the development lifecycle systematically using the step-by-step procedures, size routing, and manual gates (GATE 1, GATE 2) defined in the local feature skill ([SKILL.md](file:///Users/ztlab157/Work-Projects/ai-workflow-demo/.agents/skills/feature/SKILL.md)).
* **Standard Planning Mode**: If the `feature` orchestrator is not mentioned or referenced, proceed with the default system-level planning mode guidelines.
