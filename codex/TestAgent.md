# GuardForge Test Agent

## Purpose
Define a strict, path-based testing contract for GuardForge changes so agent execution is deterministic, auditable, and merge-ready without interpretation.

## Inputs the Agent Uses
- Changed files from git diff:
```bash
git diff --name-only --diff-filter=ACMR <base>...HEAD
```
- Environment state:
```bash
test -n "${OPENAI_API_KEY:-}" && echo "OPENAI_API_KEY=present" || echo "OPENAI_API_KEY=absent"
```
- Whether changed files include the following config/artifact/CI surfaces:
- `guardforge.yml`
- `guardforge.schema.json`
- `packages/cli/**`
- `.github/workflows/ci.yml`
- `packages/**`

Defaults:
- Base diff target defaults to `origin/main` when available.
- `pnpm` is the package manager of record.

## Hard Gates (Blocking)
- For any code/config change, these are always required:
- `pnpm typecheck`
- `pnpm test`
- Additional blocking gate when network checks are eligible:
- `pnpm guardforge -- ci check`
- Readiness state is `fail` if any required gate fails.
- Final verdict is `ready` only if all required gates pass; otherwise `not_ready`.

## Deterministic vs Network Policy
- Deterministic checks are always mandatory.
- Network gate (`pnpm guardforge -- ci check`) is mandatory only when:
- `OPENAI_API_KEY` is present, and
- changed files touch one or more of:
- `packages/cli/**`
- `packages/adapters-openai/**`
- `guardforge.yml`
- `guardforge.schema.json`
- `.github/workflows/ci.yml`
- If network gate is eligible but key is absent, the agent must report:
- deterministic status
- network check skipped reason
- explicit statement: `not release-ready until network gate passes`

## Path-Based Test Matrix
Use all applicable rows for the current diff.

| Changed path pattern | Required deterministic commands (in order) | Network gate required by policy |
|---|---|---|
| `packages/core/**` | `pnpm vitest run packages/core/src/**/*.test.ts` -> `pnpm typecheck` -> `pnpm test` | No (unless another eligible row triggers it) |
| `packages/rules/**` | `pnpm vitest run packages/rules/src/**/*.test.ts` -> `pnpm typecheck` -> `pnpm test` | No (unless another eligible row triggers it) |
| `packages/reporter/**` | `pnpm vitest run packages/reporter/src/**/*.test.ts` -> `pnpm typecheck` -> `pnpm test` | No (unless another eligible row triggers it) |
| `packages/cli/**` | `pnpm vitest run packages/cli/src/**/*.test.ts` -> `pnpm typecheck` -> `pnpm test` | Yes |
| `packages/adapters-openai/**` | `pnpm vitest run packages/adapters-openai/src/**/*.test.ts` -> `pnpm typecheck` -> `pnpm test` | Yes |
| `guardforge.yml` or `guardforge.schema.json` | `pnpm typecheck` -> `pnpm test` | Yes |
| `.github/workflows/ci.yml` | `pnpm typecheck` -> `pnpm test` | Yes |

Notes:
- Package-targeted Vitest commands are advisory speed-ups and do not replace `pnpm test`.
- If multiple rows apply, de-duplicate identical commands while preserving required order:
1. targeted package tests
2. `pnpm typecheck`
3. `pnpm test`

## Execution Algorithm (Step-by-Step)
1. Collect changed files using:
```bash
BASE_REF="$(git rev-parse --verify origin/main >/dev/null 2>&1 && echo origin/main || echo HEAD~1)"
git diff --name-only --diff-filter=ACMR "${BASE_REF}"...HEAD
```
2. Resolve all impacted matrix rows from changed paths.
3. Build deterministic command list in this order:
- impacted package-targeted Vitest commands
- `pnpm typecheck`
- `pnpm test`
4. Run deterministic commands with fail-fast semantics.
5. Mark remaining required commands as `not_run` when halted by a prior failure.
6. Evaluate whether network gate is required from path-policy rules.
7. If required and `OPENAI_API_KEY` present, run:
```bash
pnpm guardforge -- ci check
```
8. If required and `OPENAI_API_KEY` absent:
- set network command status to `skipped`
- mark final verdict `not_ready`
- include required follow-up to run network gate in a key-enabled environment.
9. Emit the fixed structured result from the template in this file.

## Failure Handling and Reporting Contract
- Fail-fast per command execution.
- Continue reporting by logging all remaining required commands as `not_run due to prior failure`.
- For each command, report:
- `status`: `pass` | `fail` | `skipped` | `not_run`
- `exit_code`: numeric when executed, otherwise `n/a`
- `reason`: concise explanation
- Final verdict rules:
- `ready`: all required gates passed
- `not_ready`: any required gate failed, skipped when required, or not_run

## Required Output Template
Use this exact structure in agent output.

```md
## GuardForge Test Agent Result

### Changed Files
- <path>
- <path>

### Required Gates
- Deterministic: <list resolved from matrix>
- Network: <required|not_required> (<why>)

### Command Results
| Command | Status | Exit Code | Reason |
|---|---|---:|---|
| <cmd> | pass\|fail\|skipped\|not_run | <code or n/a> | <concise reason> |
| <cmd> | pass\|fail\|skipped\|not_run | <code or n/a> | <concise reason> |

### Network Policy Decision
- OPENAI_API_KEY: present|absent
- Network gate eligibility: yes|no
- Action taken: executed|skipped

### Final Verdict
- ready|not_ready

### Next Required Action
- <required follow-up when blocked/skipped, else "none">
```

## Fast Reference Commands
Repo-wide deterministic validation:
```bash
pnpm typecheck && pnpm test
```

Per-package Vitest runs:
```bash
pnpm vitest run packages/core/src/**/*.test.ts
pnpm vitest run packages/rules/src/**/*.test.ts
pnpm vitest run packages/reporter/src/**/*.test.ts
pnpm vitest run packages/cli/src/**/*.test.ts
pnpm vitest run packages/adapters-openai/src/**/*.test.ts
```

CI parity run with key present:
```bash
pnpm typecheck && pnpm test && pnpm guardforge -- ci check
```

## Scenarios to Validate This Contract
1. Change only `packages/core/src/thresholds.ts`:
- Select core targeted tests + deterministic global gates.
- No network gate unless another eligible path is also changed.
2. Change `packages/adapters-openai/src/index.ts` with key present:
- Run deterministic gates and required network gate.
3. Same adapters change with key missing:
- Run deterministic gates.
- Mark network gate required-but-skipped.
- Final verdict must be `not_ready`.
4. Change docs only outside matrix:
- No required gates.
- Recommend optional sanity run: `pnpm test`.
5. Change `.github/workflows/ci.yml`:
- Enforce full deterministic gates and network gate policy.
