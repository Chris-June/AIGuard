# Safe Usage Checklist

Use this before merge.

## Pre-Merge Safety Checklist
- [ ] `pnpm typecheck` passes
- [ ] `pnpm test` passes
- [ ] `pnpm guardforge -- ci check` passes
- [ ] `artifacts/report.json` shows `status: "pass"`
- [ ] No `high` or `critical` violations
- [ ] New/changed cases include clear expected behavior
- [ ] Docs updated for contract changes

## Secret Handling Checklist
- [ ] API keys only in environment variables or CI secrets
- [ ] No secrets committed to files
- [ ] No secrets copied into prompts/cases
- [ ] Reports do not contain real credentials

## Prompt Safety Checklist
- [ ] Injection attempts are covered by at least one case
- [ ] Exfiltration attempts are covered by at least one case
- [ ] Tool misuse attempts are covered by at least one case
- [ ] Refusal behavior is explicitly tested

## Why This Matters
Checklists help teams stay safe under delivery pressure.
