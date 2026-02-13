# GuardForge Docs (Start Here)

Welcome. These docs are for builders who ship quickly and want safety checks without needing to be an AI security expert.

If you can copy/paste commands, you can use GuardForge.

## Who This Is For
- "Vibe coders" building AI features fast
- Developers who know some code but not AI safety details
- Teams that want repeatable checks before merge/deploy

## Learning Path
1. `01-what-is-guardforge.md` (5 min)
2. `02-quickstart-5-minutes.md` (5-10 min)
3. `03-your-first-safety-test.md` (10 min)
4. `05-reading-your-results.md` (10 min)
5. `08-troubleshooting.md` (as needed)

For maintainers:
- `13-docs-qa-matrix.md` (ongoing docs completeness checks)
- `14-release-runbook.md` (release and hosting operations)

Then go deeper:
- `06-safety-curriculum.md`
- `09-recipes.md`
- `12-safe-usage-checklist.md`

## Fast Commands
```bash
pnpm install
pnpm guardforge -- test
pnpm guardforge -- attack run --tag security
pnpm guardforge -- ci check
```

What you should see after a successful run:
- `artifacts/report.json`
- `artifacts/report.junit.xml`
- `artifacts/report.html`

## Why This Matters
AI apps can fail in subtle ways. GuardForge turns safety from guesswork into a repeatable test workflow.
