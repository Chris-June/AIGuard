# GuardForge

GuardForge is a CLI-first framework for testing AI safety behavior before merge and deploy.

## Install GuardForge (Public Users)
Global install from npm:

```bash
npm i -g @chrisjune/guardforge
```

Then run:

```bash
guardforge --help
guardforge ci check
```

## From Source (Contributors)
Requirements:
- Node.js LTS
- pnpm
- `OPENAI_API_KEY`

```bash
pnpm install
pnpm guardforge -- ci check
```

Expected outputs:
- `artifacts/report.json`
- `artifacts/report.junit.xml`
- `artifacts/report.html`

## Public Docs Site
- Hosted docs URL: `https://Chris-June.github.io/AIGuard/`
- Docs source: `docs/`

## Start Here (Docs Hub)
- Docs home: `docs/README.md`
- What GuardForge is: `docs/01-what-is-guardforge.md`
- Quickstart: `docs/02-quickstart-5-minutes.md`
- First safety test: `docs/03-your-first-safety-test.md`
- Understand prompts and guardrails: `docs/04-understanding-prompts-and-guardrails.md`
- Read reports: `docs/05-reading-your-results.md`
- Deep safety curriculum: `docs/06-safety-curriculum.md`
- Common workflows: `docs/07-common-workflows.md`
- Troubleshooting: `docs/08-troubleshooting.md`
- Copy/paste recipes: `docs/09-recipes.md`
- Glossary: `docs/10-glossary.md`
- FAQ: `docs/11-faq.md`
- Safe usage checklist: `docs/12-safe-usage-checklist.md`
- Docs QA matrix: `docs/13-docs-qa-matrix.md`
- Release runbook: `docs/14-release-runbook.md`

## CLI Commands (Source Workspace)
```bash
pnpm guardforge -- init
pnpm guardforge -- test
pnpm guardforge -- attack run --tag security
pnpm guardforge -- report generate --report-input ./artifacts/report.json
pnpm guardforge -- ci check
```

## Project Contracts
- Config file: `guardforge.yml`
- JSON example: `examples/guardforge.json`
- Schema: `guardforge.schema.json`
- Product requirements: `PRD.md`
- Change log: `CHANGELOG.md`
