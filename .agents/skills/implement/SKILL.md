---
name: implement
description: >-
  Execute an approved plan as code changes. Verify each step before advancing. Use after plan approval, or as step 4 of feature skill.
---

# implement

Turn the approved plan into reviewed-quality code on the current checked-out branch.

## Inputs

- The approved plan from the `plan` prompt (with quality analysis + failure-mode table).
- Research findings (file:line references + project conventions).
- Optional: user feedback (set on rerun after GATE 2 → "Request changes" or manual-test → "Fail — apply fixes"). Treat as override-priority guidance.

## Procedure

1. **Preflight.** Check that the working tree is ready for changes. Ensure you are executing on the correct manually checked-out branch.

2. **For each plan step:**
   1. Re-read the step.
   2. Make the change. Edit existing files in preference to creating new ones. Search for existing components to reuse before introducing new UI elements. Split components into sub-components when practical (aiming to keep files under 500 LOC for human readability).
   3. Run the verification declared in the plan (typecheck, manual check, command).
   4. If verification fails: fix the issue, don't bypass. If you can't fix in ≤3 attempts, stop and report a blocker — do not paper over.

   Do not attempt to stage, commit, or push any changes. All edits stay uncommitted in the working tree to be managed manually by the user.

3. **If `feedback` is set:**
   - Surface the feedback at the top of your working context.
   - Address each point explicitly with new edits in the working tree (no Git operations).

4. **No drive-by changes.** If you spot an unrelated bug or want to clean up adjacent code, note it as a follow-up and keep going.

## Hard rules

| Rule                    | Detail                                                                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| No type-safety bypasses | No `@ts-ignore`, `as any`, `// eslint-disable-next-line`, or equivalent without an inline justification AND a follow-up issue noted. |
| No Git operations       | Do not perform any git branch, checkout, add, commit, or push actions.                                                               |

## Output

Report to the caller:

```
Plan steps:
  - <step 1 subject> [verified ✓]
  - <step 2 subject> [verified ✓]
Files changed: <N> (uncommitted in working tree)
Blockers:      <none | description>
```

## Verification

- `git diff` shows the planned changes in the working tree.
- Every plan step is either complete or has a reported blocker.
- No `WIP`, `fixup`, or unresolved merge markers in the diff.
- `git diff` shows no introduced `@ts-ignore`, `as any`, or `eslint-disable` without justification.

## Failure modes

- **Verification fails repeatedly:** stop and report a blocker.
- **Plan step is wrong:** stop, note the deviation, ask the orchestrator for guidance rather than silently re-planning.
- **Resume sees uncommitted diff:** re-derive remaining work from the plan vs. the current working-tree diff. Don't re-apply edits already present.
