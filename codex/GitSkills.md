# GuardForge Git Skills

## Purpose
Define a precise, repeatable Git workflow for documenting, reviewing, and shipping changes across the GuardForge agent swarm.

## Scope
Applies to all repository changes, including docs, config, tests, CI, and code.

## Ownership
- Primary owner: Orchestrator Agent
- Enforced by: All specialist agents before handoff and before merge

## Core Principles
- Keep each commit single-purpose and reviewable.
- Prefer small, sequential PRs over large mixed changes.
- Preserve traceability from requirement -> change -> test -> merge.
- Never hide risk, skipped tests, or breaking changes.

## Branch Strategy
- `main`: protected, always releasable
- Feature branches: `feat/<area>-<short-description>`
- Fix branches: `fix/<area>-<short-description>`
- Docs branches: `docs/<area>-<short-description>`

Examples:
- `feat/core-deterministic-scoring`
- `fix/adapter-tool-call-normalization`
- `docs/prd-ci-contract`

## Commit Skills
### Commit Message Format
Use conventional-style messages:
- `feat: add deterministic severity threshold evaluator`
- `fix: block non-allowlisted tool invocation`
- `docs: align PRD and codex rules for CI gates`
- `test: add regression suite for prompt leakage`
- `chore: pin vitest and eslint versions`

### Commit Quality Rules
- One logical change per commit.
- Include related test/doc updates in the same commit when contract changes.
- Do not mix refactors with behavior changes unless required.
- Avoid "WIP" commits on shared branches.

## PR Skills
Every PR must include:
1. Summary of intent and requirement mapping.
2. Files changed and why.
3. Risk assessment (behavioral, security, compatibility).
4. Validation evidence:
   - typecheck
   - tests
   - guardrail suite
5. Rollback plan for risky or compatibility-impacting changes.

## Required Change Log Block (in PR description)
Use this exact template:

```md
## Change Log
- Requirement(s):
- Behavior changed:
- Public interface/type changes:
- Security impact:
- Test coverage added/updated:
- Artifacts generated:
- Follow-up work:
```

## Change Request Documentation Skill
Each request must be documented in a standalone Markdown file.

### File Location and Naming
- Store files in `change-requests/`.
- One file per request.
- File name format: `CR-<YYYYMMDD>-<short-slug>.md`

Examples:
- `change-requests/CR-20260213-deterministic-threshold-update.md`
- `change-requests/CR-20260213-openai-adapter-timeout-policy.md`

### Required Sections (per file)
Use this exact structure:

```md
# Change Request: <title>

## Metadata
- Request ID:
- Date:
- Requested by:
- Owner:
- Status: Draft | Approved | In Progress | Blocked | Done | Rejected
- Related issue(s):
- Related PR(s):

## Problem Statement
<what is wrong, for whom, and why now>

## Requested Change
<clear desired behavior or outcome>

## Scope
- In scope:
- Out of scope:

## Impact Analysis
- Affected files/modules:
- Public interface/type impact:
- Security impact:
- CI/test impact:
- Migration/compatibility impact:

## Implementation Plan
1.
2.
3.

## Validation Plan
- Typecheck:
- Tests:
- Guardrail suite:
- Artifacts:

## Risks and Mitigations
- Risk:
  - Mitigation:

## Rollback Plan
<how to safely revert if needed>

## Decision Log
- <date> <decision> <owner>
```

### Lifecycle Rules
- Create the change request file before implementation begins.
- Update `Status` and `Related PR(s)` as work progresses.
- Mark `Done` only after merge checks pass and docs are synchronized.
- Never merge implementation PRs without a linked change request file.

### PR Linkage Requirement
Every PR must reference exactly one primary change request file:
- Include `Change Request: change-requests/CR-...md` in PR description.
- If a PR spans multiple requests, identify one primary and list secondary references.

## Documentation Sync Rules
- If interfaces/types change, update:
  - `PRD.md` (if product contract changed)
  - relevant `codex/*.md` governance files
  - examples/config schemas (`guardforge.yml`, `guardforge.schema.json`) if applicable
- No merge with stale docs for changed contracts.

## Rebase and Merge Skills
- Rebase feature branches on latest `main` before final review.
- Resolve conflicts by preserving latest approved contracts and tests.
- Prefer squash merge for linear history unless multi-commit history is intentionally meaningful.

## Tagging and Release Notes
- Tag releases using semantic versioning: `vMAJOR.MINOR.PATCH`.
- Release notes must include:
  - breaking changes
  - migration notes
  - security rule updates
  - evaluator/scoring behavior changes

## Audit and Traceability
For every merged PR, ensure traceability across:
1. Requirement source (`PRD.md` or issue)
2. Implementation diff
3. Test evidence
4. CI artifacts (`json`, `junit`, optional `html`)

## Anti-Patterns (Disallowed)
- Direct pushes to `main`.
- Force-pushing shared review branches without notifying reviewers.
- Silent changes to thresholds, severity semantics, or adapter contracts.
- Merging with failing required checks.
- "Fix in follow-up" for known `critical` or `high` security regressions.

## Definition of Done (Git)
A change is Git-complete when:
1. Branch and commit history are clean and intentional.
2. PR contains required changelog block and validation evidence.
3. Required checks pass.
4. Documentation is synchronized.
5. Merge strategy preserves traceability.
