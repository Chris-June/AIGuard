# Common Workflows

These are the day-to-day GuardForge flows.

## Workflow A: Local Developer Loop
1. Edit `guardforge.yml`.
2. Run:
```bash
pnpm guardforge -- test
```
3. Review `artifacts/report.json`.
4. Repeat until passing.

## Workflow B: Attack-Focused Run
Run only attack-tagged suites:
```bash
pnpm guardforge -- attack run --tag security
```

Use this when working specifically on injection/exfiltration/tool-abuse defenses.

## Workflow C: CI Gate Check
Run the same command CI uses:
```bash
pnpm guardforge -- ci check
```

## Workflow D: Regenerate Reports
If you already have `artifacts/report.json` and want to regenerate views:
```bash
pnpm guardforge -- report generate --report-input ./artifacts/report.json
```

## Workflow E: Starter Config Copy
Create starter copy:
```bash
pnpm guardforge -- init
```

## Why This Matters
Consistency between local and CI workflows prevents surprise failures right before merge.
