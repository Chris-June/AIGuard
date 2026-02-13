# Release Runbook

This runbook explains how to publish `@chrisjune/guardforge` and deploy docs.

## Versioning Policy
- Use semantic versioning (`MAJOR.MINOR.PATCH`)
- Release tag format: `vMAJOR.MINOR.PATCH`
- Example: `v0.1.1`

## Pre-Release Checklist
1. Update `packages/cli/package.json` version.
2. Update `CHANGELOG.md` with user-facing notes.
3. Run:
```bash
pnpm release:verify
```
4. Run packaging sanity check:
```bash
pnpm --filter @chrisjune/guardforge pack:check
```

## Create Release Tag
```bash
git tag -a v0.1.1 -m "release: v0.1.1"
git push origin v0.1.1
```

## What Happens in GitHub Actions
`release.yml` runs on `v*` tags:
1. install dependencies
2. run typecheck/tests/build
3. run CLI package sanity check
4. publish `@chrisjune/guardforge` to npm
5. create GitHub Release notes

## Rollback Procedure
If a bad version is published:
1. Deprecate npm version:
```bash
npm deprecate @chrisjune/guardforge@0.1.1 "Deprecated: use >=0.1.2"
```
2. Ship a patch release with fix.
3. Update changelog with explicit rollback note.

## Docs Deployment
- Docs deploy from `.github/workflows/docs.yml` on `main` pushes for docs/README/mkdocs config changes.
- Hosted URL:
  - `https://Chris-June.github.io/AIGuard/`

## Required Repository Settings
- GitHub Actions enabled
- Pages source set to GitHub Actions
- npm trusted publishing configured
- Optional fallback secret: `NPM_TOKEN`
- Protected `main` branch with required CI checks
