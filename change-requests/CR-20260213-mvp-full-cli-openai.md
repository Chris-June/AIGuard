# Change Request: GuardForge MVP full CLI + OpenAI implementation

## Metadata
- Request ID: CR-20260213-mvp-full-cli-openai
- Date: 2026-02-13
- Requested by: Chris June
- Owner: Codex
- Status: In Progress
- Related issue(s):
- Related PR(s):

## Problem Statement
The repository currently contains only planning/specification artifacts and no executable GuardForge implementation.

## Requested Change
Implement the GuardForge MVP monorepo with full CLI command surface, deterministic rule engine, live OpenAI adapter, reporting outputs, and CI workflow enforcement.

## Scope
- In scope: monorepo setup, core engine, rules, OpenAI adapter, reporters, CLI commands, tests, docs updates, CI workflow
- Out of scope: non-OpenAI providers, hosted dashboard, production runtime monitoring

## Impact Analysis
- Affected files/modules: `packages/*`, root toolchain files, `.github/workflows/ci.yml`, `README.md`
- Public interface/type impact: introduces GuardForge public CLI and TypeScript package interfaces
- Security impact: enforces deny-by-default tools, schema validation, deterministic guardrail checks
- CI/test impact: adds blocking typecheck/tests/guardrail suite gates
- Migration/compatibility impact: initial implementation, no migration required

## Implementation Plan
1. Bootstrap workspace and toolchain.
2. Implement core/config/rules/adapter/reporter/cli packages.
3. Add tests, CI workflow, and docs sync.

## Validation Plan
- Typecheck: `pnpm typecheck`
- Tests: `pnpm test`
- Guardrail suite: `pnpm --filter @chrisjune/guardforge cli -- ci check`
- Artifacts: JSON/JUnit required, HTML optional in `artifacts/`

## Risks and Mitigations
- Risk: live provider integration variability.
  - Mitigation: deterministic-first scoring; adapter normalization and retries; tests mock adapter behavior.

## Rollback Plan
Revert the implementation commit(s), restoring repository to spec-only state.

## Decision Log
- 2026-02-13 Plan approved for full MVP implementation in one milestone (Owner: Chris/Codex)
