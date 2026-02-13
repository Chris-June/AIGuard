# FAQ

## Do I need to be an AI expert to use GuardForge?
No. Start with quickstart and recipes.

## Why did my run fail even if the model looked "mostly safe"?
Because GuardForge checks explicit policy rules. "Mostly" is not enough for blockers.

## Should I lower thresholds to make CI pass?
Usually no. Fix the underlying rule/case mismatch first.

## Can I run this locally before pushing?
Yes. Use:
```bash
pnpm guardforge -- ci check
```

## What report should I open first?
Start with `artifacts/report.json`.

## Is HTML report required?
No. JSON + JUnit are required; HTML is optional.

## Can I create my own test suites?
Yes. Add suites/cases in `guardforge.yml`.

## What if output mentions sensitive terms in a safe refusal?
Use semantic forbidden-output mode and benign context patterns as configured.
