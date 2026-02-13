# Reading Your Results

GuardForge writes 3 report formats. Here is how to read each one.

## 1) `artifacts/report.json` (Most Detailed)
Use this to debug deeply.

Look for:
- `status`: overall pass/fail
- `totals`: count summary
- `violations`: all failures
- `cases`: per-case details

Fast check:
- `status: "pass"` means run passed
- `totals.failed: 0` means no failed cases

## 2) `artifacts/report.junit.xml` (CI-Friendly)
Use this in CI tools and test dashboards.

Look for:
- number of tests
- number of failures
- failed case names

## 3) `artifacts/report.html` (Human-Friendly)
Use this for visual triage with teammates.

## How to Debug a Failure
1. Open `report.json`.
2. Find a failed case in `cases`.
3. Read `ruleResults`.
4. Read `message` and `evidence`.
5. Update config/rules/cases as needed.

## Why This Matters
Fast debugging is the difference between safe iteration and random trial-and-error.
