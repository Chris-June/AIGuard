# Docs QA Matrix

Use this file to quickly verify that user-facing docs cover all critical product surfaces.

## How To Use This Matrix
1. After any CLI/config/reporting/release change, update this matrix first.
2. Confirm each item still maps to at least one beginner-friendly guide.
3. Run the validation commands at the end of this file.

## Public Access Coverage

### Public npm install path
- `README.md`
- `docs/02-quickstart-5-minutes.md`
- `docs/11-faq.md`

### Hosted docs URL and ownership
- URL documented in `README.md`
- deployment workflow in `.github/workflows/docs.yml`
- release/maintenance ownership in `docs/14-release-runbook.md`

## CLI Command Coverage

### `pnpm guardforge -- init`
- `README.md`
- `docs/07-common-workflows.md`

### `pnpm guardforge -- test`
- `README.md`
- `docs/03-your-first-safety-test.md`
- `docs/07-common-workflows.md`
- `docs/09-recipes.md`
- `docs/08-troubleshooting.md`

### `pnpm guardforge -- attack run --tag security`
- `README.md`
- `docs/07-common-workflows.md`
- `docs/09-recipes.md`
- `docs/08-troubleshooting.md`

### `pnpm guardforge -- report generate --report-input ./artifacts/report.json`
- `README.md`
- `docs/07-common-workflows.md`
- `docs/09-recipes.md`

### `pnpm guardforge -- ci check`
- `README.md`
- `docs/02-quickstart-5-minutes.md`
- `docs/07-common-workflows.md`
- `docs/08-troubleshooting.md`
- `docs/11-faq.md`
- `docs/12-safe-usage-checklist.md`

## Config Contract Coverage (`guardforge.yml`)

### Top-level keys

#### `project`
- `README.md`
- `docs/03-your-first-safety-test.md`

#### `adapter`
- `README.md`
- `docs/02-quickstart-5-minutes.md`
- `docs/08-troubleshooting.md`

#### `models`
- `README.md`
- `docs/08-troubleshooting.md`

#### `policies`
- `README.md`
- `docs/04-understanding-prompts-and-guardrails.md`
- `docs/09-recipes.md`
- `docs/06-safety-curriculum.md`

#### `suites`
- `README.md`
- `docs/03-your-first-safety-test.md`
- `docs/09-recipes.md`

#### `reporters`
- `README.md`
- `docs/05-reading-your-results.md`
- `docs/07-common-workflows.md`

#### `thresholds`
- `README.md`
- `docs/04-understanding-prompts-and-guardrails.md`
- `docs/08-troubleshooting.md`

#### `ci`
- `README.md`
- `docs/07-common-workflows.md`
- `docs/12-safe-usage-checklist.md`

## Report Artifact Coverage

### `artifacts/report.json`
- `docs/05-reading-your-results.md`
- `docs/08-troubleshooting.md`
- `docs/12-safe-usage-checklist.md`

### `artifacts/report.junit.xml`
- `docs/05-reading-your-results.md`

### `artifacts/report.html`
- `docs/05-reading-your-results.md`

## Safety Curriculum Coverage (Threat Classes)

### Prompt injection
- `docs/06-safety-curriculum.md`
- `docs/03-your-first-safety-test.md`

### Data exfiltration
- `docs/06-safety-curriculum.md`
- `docs/09-recipes.md`

### Tool misuse
- `docs/06-safety-curriculum.md`
- `docs/07-common-workflows.md`

### Refusal behavior
- `docs/04-understanding-prompts-and-guardrails.md`
- `docs/06-safety-curriculum.md`

## Docs QA Checklist
- [ ] Every CLI command appears in at least one tutorial and one reference-style page.
- [ ] Every top-level config key is explained in beginner language.
- [ ] Every report artifact is explained in plain language.
- [ ] Safety curriculum still maps to core threat classes.
- [ ] README links are valid and current.
- [ ] Public npm install path is current.
- [ ] Hosted docs URL and ownership are current.

## Validation Commands
```bash
pnpm typecheck
pnpm test
pnpm -r build
```
