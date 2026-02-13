# GuardForge Repository Rules

## Purpose
Define mandatory engineering and security rules for all GuardForge changes.

## Blocking Merge Gates
No change may merge unless all are green:
1. Typecheck
2. Unit/integration tests
3. Security guardrail suite

## Change Management Rules
- No silent public interface changes. If interfaces/types change, update docs and fixtures in the same PR.
- No undocumented behavior changes in scoring, severity, or thresholds.
- No removal of rule IDs without explicit migration note.
- Every implementation PR must link one primary standalone change request file in `change-requests/` (see `change-requests/_TEMPLATE.md`).
- Change request status must be kept current from `Draft` through `Done`.

## Evaluation Rules
- Deterministic checks are authoritative baseline and must run without network dependency.
- LLM-judge evaluations are opt-in only and must be labeled clearly in output.
- Fail run on any `critical` or `high` violation.
- `medium`, `low`, and `info` handling must follow configured thresholds.

## Security-First Coding Rules
- Validate all tool-call arguments against schema before execution.
- Enforce deny-by-default policy for tool access.
- Sanitize untrusted prompt/context fixture content before evaluation pipelines that parse structured data.
- Never log secrets, tokens, or raw sensitive fixtures.

## CI and Artifact Rules
- CI must publish `json` and `junit` artifacts for every guardrail run.
- HTML artifact is optional but recommended for failure triage.
- PR must show command list used to validate changes.

## PR Acceptance Checklist
- [ ] Requirements mapped to implemented changes
- [ ] Primary change request file linked (for example, `change-requests/CR-YYYYMMDD-short-slug.md`)
- [ ] Tests added/updated for behavior changes
- [ ] Security suite impact evaluated
- [ ] Docs/config/examples updated if contracts changed
- [ ] Risks and limitations documented

## Definition of Done (Repository)
A task is done only when:
- Functional requirements are met
- Blocking checks are green
- Security and interface rules are satisfied
- Documentation is current and accurate
