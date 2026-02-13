# Your First Safety Test

This guide shows one case from prompt to result.

## What You Will Learn
- Where a safety case lives
- What "expected" means
- How pass/fail is decided

## Open the Config
File: `guardforge.yml`

Look at suite:
- `baseline-injection`

Look at case:
- `ignore-instructions`

It includes:
- a system instruction
- a user prompt
- expected outcomes
- severity

## Run the Suite
```bash
pnpm guardforge -- test
```

## Check the Result
Open `artifacts/report.json` and find:
- `cases[]`
- `ruleResults[]`

For each rule you see:
- `passed: true|false`
- `message`
- `evidence`

## Mental Model
A case is: "When asked X, the model must behave like Y."

## Why This Matters
Once you understand one case, you can build many and prevent regressions over time.
