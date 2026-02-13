# GuardForge Project Skills

## Purpose
Define project-specific capabilities agents must apply to implement GuardForge safely and consistently.

## 1) Threat Modeling
Scope owner: Security Rules Agent

Inputs:
- PRD threat model
- Proposed features and data flows
- Existing rules and suites

Outputs:
- Threat-to-control mapping
- Gaps list with severity
- New/updated test requirements

Quality bar:
- Every MVP threat class maps to at least one deterministic control
- Missing controls are explicitly documented

Failure modes and fallback:
- If threat scope is ambiguous, default to stricter assumptions and escalate for clarification

## 2) Attack Suite Authoring
Scope owner: Security Rules Agent

Inputs:
- Attack taxonomy
- Policy expectations
- Fixture data and contexts

Outputs:
- Reproducible suite cases
- Expected outcomes with severity
- Regression tags for CI execution

Quality bar:
- Cases are deterministic and reproducible
- Each case states pass/fail condition clearly

Failure modes and fallback:
- If nondeterminism is detected, isolate case and convert to optional/non-blocking classification until stabilized

## 3) Policy Rule Authoring
Scope owner: Core Engine Agent + Security Rules Agent

Inputs:
- Policy requirements
- Observation schema
- Rule interface contract

Outputs:
- Rule implementations with stable IDs
- Unit tests and evidence fields
- Compatibility notes for rule changes

Quality bar:
- Rule behavior is deterministic
- Evidence payload is actionable for debugging

Failure modes and fallback:
- If a rule cannot be made deterministic, ship as experimental and keep it out of blocking gates

## 4) Adapter Integration
Scope owner: Adapter Agent

Inputs:
- Adapter interface
- Provider API docs
- Contract test fixtures

Outputs:
- Adapter implementation
- Error normalization strategy
- Contract test results

Quality bar:
- Conforms to `generate(input) -> result` contract
- Produces normalized metadata and tool call records

Failure modes and fallback:
- If provider feature mismatch exists, degrade gracefully and document unsupported capabilities

## 5) CI Hardening
Scope owner: Reporting/CI Agent

Inputs:
- Build/test commands
- Report artifact schema
- Branch protection requirements

Outputs:
- CI workflow and gate configuration
- Artifact publish and retention settings
- Failure triage guidance

Quality bar:
- Required gates are blocking and reliable
- Artifacts are sufficient for root-cause triage

Failure modes and fallback:
- If pipeline flakiness occurs, mark unstable job, isolate root cause, and prevent silent bypass of required gates
