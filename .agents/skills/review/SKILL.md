---
name: review
description: >-
  Structured review of a diff. Produces findings categorized as critical / warning / info with a GO / NO-GO verdict. The implementer must not review its own code on medium/large diffs. Use to audit a local diff, or as step 5 of feature skill.
---

# review

Sharp, actionable review without writing code. Evidence-based: every finding includes a `file:line` AND a one-line quote of the offending code.

## Inputs

- A review target: local diff in the workspace, or a remote branch/PR.
- Optional: `target_branch` (the base branch to compare against, defaults to `origin/master`).
- Optional: `task_type` (tunes severity).
- Optional: `size` (drives reviewer isolation, below).

## Reviewer isolation

| Size    | Who reviews                                                                                                                                  |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| trivial | Inline (the orchestrator)                                                                                                                    |
| small   | Inline                                                                                                                                       |
| medium  | **Fresh-context reviewer.** Start a new chat/session; the implementer must NOT review its own code. Pass the diff + this prompt's procedure. |
| large   | Same as medium                                                                                                                               |

For fresh-context reviews, the prompt must include: the full diff, the AC from intake, the plan, the file:line evidence requirement, and a strict instruction "do not write code — produce findings only."

## Procedure

1. **Load the diff.**
   - **For local changes / current branch:** Determine the target branch (default `origin/master`). Run `git merge-base <target_branch> HEAD` to get the common ancestor, then run `git diff <ancestor_hash> HEAD` to capture changes specific to this branch.
   - **For a Pull Request (PR) / Remote Branch:** Fetch the remote branch, then run `git diff <target_branch>...<remote_branch>` (triple-dot diff is recommended to compare only the changes introduced in the feature branch).

2. **Apply the five quality pillars:**
   - **Validation:** are inputs checked at every external boundary?
   - **Global impact:** does this change ripple in non-obvious ways?
   - **Pattern consistency:** does the change follow the codebase's idioms?
   - **Logic vs syntax:** is the code doing the right thing, not just compiling?
   - **Dead/Unused Code:** does the diff introduce unused imports, dead/unreachable branches, unused local variables, or unused function parameters?

3. **Categorize findings:**
   - **critical** — must fix before merge (bug, security, data loss, contract break, missing rescue on a user-facing failure path).
   - **warning** — should fix before merge (perf, ergonomics).
   - **info** — noted, not blocking (style, opportunistic cleanup).

4. **Each finding includes:**
   - `file:line` reference
   - one-line quote of the offending code
   - one-sentence issue
   - one-sentence fix

5. **Cross-check against the plan's failure-mode table.** Any row marked `Rescued = NO + User sees = Silent` that wasn't addressed in the diff → automatic critical.

6. **Pick a verdict:**
   - `GO` if zero critical findings.
   - `NO-GO` otherwise.

## Output

```
## Review findings — <GO|NO-GO>  (<critical> critical / <warning> warning / <info> info)

### Critical
- <file:line>
  `<one-line quote>`
  Issue: <one sentence>
  Fix: <one sentence>

### Warning
- <file:line>
  `<one-line quote>`
  Issue: <one sentence>
  Fix: <one sentence>

### Info
- <file:line>
  `<one-line quote>`
  Issue: <one sentence>
  Fix: <one sentence>
```

## Verification

- Every finding has `file:line`, a quoted line, an issue, and a fix.
- The verdict matches the critical count (`GO` iff zero criticals).
- Plan's failure-mode table cross-check has been performed (note "none applicable" if no failure-mode table existed).

## Failure modes

- **Diff too large for a meaningful single pass:** split the review into chunks by file group; don't produce a shallow review.
- **Reviewer is also the implementer (medium+):** stop and start a fresh-context review. Self-review on medium+ is not allowed.
