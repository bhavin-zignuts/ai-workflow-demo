---
name: feature
description: >-
  Master orchestrator. Drive a feature from a task description to a reviewed implementation by running sub-skills in the right order.
---

# feature — Master Orchestrator

You are the orchestrator. Your job is to drive a feature from a task
description to a reviewed implementation by running the sub-skills in `.agents/skills/`
in the right order, pausing at the two human gates, and reporting at the end.

You do **not** write code yourself. You delegate to the sub-skills (run each
by following its procedure, or by invoking it as a separate skill).
You **do** render the gate prompts and route the user's reply.

## Argument

- `$task_description` — required. Ticket ID (e.g. `ABC-123`), URL, or
  free-form description of what to build.

If the user invoked `feature` with no argument, ask once for the task
description before starting.

## Sub-skills you will invoke

All live under `.agents/skills/`:

| Order | Skill | Why |
| ----- | ----- | --- |
| 1     | [intake](../intake/SKILL.md) | Resolve the task, extract AC, classify size, validate success criteria |
| 2     | [research](../research/SKILL.md) | Map the codebase, detect conventions, validate hypotheses |
| 3     | [plan](../plan/SKILL.md) | Write the implementation plan with quality analysis |
| 4     | [implement](../implement/SKILL.md) | Execute the plan |
| 5     | [review](../review/SKILL.md) | Structured review of the diff |

Run each skill's procedure with concrete inputs — never say "use prior context."

## Size-based routing

`intake` classifies the task; use the size to decide which stages run.

| Size    | Stages run                                            | Gates fired    |
| ------- | ----------------------------------------------------- | -------------- |
| trivial | intake → implement                                    | none           |
| small   | intake → research (light) → plan → implement → review | GATE 1, GATE 2 |
| medium  | All 5 stages                                          | GATE 1, GATE 2 |
| large   | All 5 stages                                          | GATE 1, GATE 2 |

For `trivial`, the orchestrator may inline the change rather than running the
`implement` skill — but only for changes that are clearly under 50 LOC, single
file, and have no external surface change.

## Procedure

### Stage 1 — Intake

Run the `intake` skill with `$task_description`.
Capture into working notes: `task_type`, `size`, `summary`, `acceptance_criteria`, `success_criteria`, `cross_team_impact`.

### Stage 2 — Research (skip if size = trivial)

Run the `research` skill with the intake outputs.
Capture into working notes: project conventions, files to change, hypotheses, open questions.

### Stage 3 — Plan (skip if size = trivial)

Run the `plan` skill with the intake + research outputs.
Capture into working notes: the implementation plan, quality analysis, failure-mode table, risk level, line estimate, feature flag.

### GATE 1 — Plan approval (REQUIRED, never skip)

**Post-stage protocol:** the `plan` skill output ends with `## Stop — orchestrator fires GATE 1 next`. As soon as you have rendered the plan, your VERY NEXT action in the SAME turn is to ask the user the gate question below. Do not end the turn between the plan output and the gate. If you ever find yourself about to end the turn after delivering a plan, stop — fire the gate first.

Ask the user:

```
Plan ready for {ticket-or-summary}. Approve to proceed to implementation?

  [Approve] Plan looks good — proceed to implementation.
  [Modify]  Adjust the plan based on feedback.
  [Reject]  Stop and rethink the approach.
```

Route the reply:

- **Approve** → continue to Stage 4.
- **Modify** → ask the user for specific feedback, then re-run the `plan`
  skill with the previous plan AND the feedback as inputs. Re-render GATE 1.
- **Reject** → write a one-paragraph summary of where we stopped and why, then
  exit cleanly. Do not proceed.

### Stage 4 — Implement

Run the `implement` skill with the approved plan + research findings as input.
Capture into working notes: files changed in the working tree.

### GATE 2 — Execution review (REQUIRED, never skip)

**Post-stage protocol:** as with GATE 1, fire the gate question in the SAME turn that delivers the implement output. Do not end the turn between implement output and the gate.

Ask the user:

```
Implementation complete. Continue to review, or pause for manual review?

  [Continue]            Code looks fine — proceed to review.
  [Pause for manual test] Pause so I can manually validate before continuing.
  [Request changes]     Implementation needs revision before moving on.
```

Route the reply:

- **Continue** → go to Stage 5 (Review).
- **Pause for manual test** → fire the sub-gate below.
- **Request changes** → ask the user for specific feedback, then re-run the
  `implement` skill with the feedback as override-priority input. Re-render
  GATE 2.

#### Sub-gate — Manual test

```
Run your manual tests now. Reply when you're done.

  [Pass]              Manual test passed — continue.
  [Fail — apply fixes] Found issues; loop back to implement with the notes.
```

Route:

- **Pass** → go to Stage 5 (Review).
- **Fail — apply fixes** → ask the user for notes, then re-run `implement`
  with the notes. After re-implementation, re-render GATE 2 (not this sub-gate).

### Stage 5 — Review (skip if size = trivial)

Run the `review` skill.
For `medium`/`large`, start a fresh-context review session — the implementer must NOT review its own code.
Capture findings.

If there are any **critical** findings, treat that as a "Request changes"
event: feed them to `implement` and re-run from Stage 4. Do not complete the flow with known criticals.

### Stage 6 — Report

Print a compact summary to the user:

```
Feature complete.
  intake     → {task_type}, {size}
  research   → {N} files mapped, {hypothesis_count} hypotheses
  plan       → {N} steps, risk={low|medium|high}, ~{LOC} LOC
  GATE 1     → {decision}
  implement  → {N} files changed
  GATE 2     → {decision}{ → manual-test: {decision}}
  review     → {critical} critical / {warning} warning / {info} info
```

## Hard rules

- **Never skip a gate.** GATE 1 and GATE 2 must fire on every non-trivial run.
- **Never invent a gate.** Only the two gates (and the manual-test sub-gate) defined above exist.
- **Fire the gate in the SAME turn as the sub-skill output.** This is the explicit fix for the gate-firing bug where the orchestrator ended the turn after delivering a plan/implement output and never asked the user. The post-stage protocol notes in GATE 1 and GATE 2 are not optional.
- **Run skills sequentially.** Don't parallelize stages.
- **Pass concrete inputs.** When running a sub-skill, restate the inputs in the skill — don't rely on the sub-skill reading your memory.
- **Trust the sub-skill's procedure.** Don't inline its work.
- **On rerun, give override-priority to user feedback.** When a gate routes back to `plan` or `implement`, the user's notes outrank the prior output.

## Failure handling

- If a sub-skill reports a blocker it can't resolve, stop and surface the blocker to the user. Don't paper over it.
- If GATE 1 is rejected, exit cleanly with a summary.
- If GATE 2 → "Request changes" or sub-gate → "Fail" recurs more than 3 times in a row, pause and ask the user whether to keep iterating or stop.
- If `review` returns NO-GO twice in a row on the same critical, escalate to the user before another implement loop.

## Composition note

Each sub-skill is also directly invokable on its own (e.g. you can run `plan`
standalone after intake + research). `feature` is just the wiring. If a user
wants only parts of the flow, they can invoke those sub-skills directly.
