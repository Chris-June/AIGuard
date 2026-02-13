# Change Request: Public release and hosting workflow

## Metadata
- Request ID: CR-20260213-public-release-and-hosting
- Date: 2026-02-13
- Requested by: Chris June
- Owner: Codex
- Status: Done
- Related issue(s):
- Related PR(s):

## Problem Statement
GuardForge is usable locally but lacks production release automation and hosted documentation, which blocks public user adoption.

## Requested Change
Add npm release automation for `@chrisjune/guardforge`, tag-driven GitHub release workflow, GitHub Pages docs deployment, and maintainer release runbook/changelog.

## Scope
- In scope: release workflow, docs workflow, package publish metadata, onboarding docs updates, changelog/runbook
- Out of scope: publishing internal packages, runtime feature changes, hosted dashboard

## Impact Analysis
- Affected files/modules: `.github/workflows/*`, `packages/cli/package.json`, `README.md`, `docs/*`, `CHANGELOG.md`
- Public interface/type impact: adds public install and docs hosting contracts
- Security impact: release pipeline keeps CI gates before publish
- CI/test impact: adds release/docs workflows; existing validation remains required
- Migration/compatibility impact: none

## Implementation Plan
1. Make CLI package publish-ready with metadata and packaging constraints.
2. Add tag-driven release workflow and docs deployment workflow.
3. Add changelog and release runbook; sync README/docs.

## Validation Plan
- Typecheck: `pnpm typecheck`
- Tests: `pnpm test`
- Guardrail suite: `pnpm guardforge -- ci check` (with API key)
- Artifacts: docs build and package dry-run checks

## Risks and Mitigations
- Risk: npm publish auth misconfiguration.
  - Mitigation: support trusted publishing and `NPM_TOKEN` fallback.
- Risk: hosted docs drift from repo commands.
  - Mitigation: docs QA matrix and release checklist.

## Rollback Plan
Disable release/docs workflows and revert package publish metadata; deprecate any bad npm version if published.

## Decision Log
- 2026-02-13 Public access strategy selected: npm CLI + GitHub Pages + tag-driven releases.
- 2026-02-13 Release/docs workflows, changelog, runbook, and onboarding updates implemented.
