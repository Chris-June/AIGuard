# GuardForge Tools Policy

## Purpose
Standardize the approved tooling stack, safety constraints, and operational guardrails for MVP delivery.

## Approved Toolchain (MVP)
- Runtime: Node.js LTS
- Package manager: pnpm (preferred), npm allowed
- Language/tooling: TypeScript
- Test runner: Vitest
- Type checking: `tsc --noEmit`
- Linting: ESLint
- Formatting: Prettier
- CI runner: GitHub Actions
- AI provider: OpenAI Responses API

## Required Command Classes
- Install: dependency bootstrap
- Validate: typecheck + lint + tests
- Security: guardrail suite execution
- Report: JSON/JUnit generation (HTML optional)

## OpenAI Usage Constraints (MVP)
- Adapter scope is OpenAI-only in MVP
- Model/version must be explicit in config
- LLM-judge evaluators are disabled by default and require explicit opt-in
- Provider response metadata must be normalized before scoring/reporting

## Reporting Tool Requirements
Must produce at minimum:
- `json` machine-readable results
- `junit` CI-compatible results

Optional:
- `html` local triage dashboard artifact

## Tool Safety Rules
- Pin major versions for core toolchain dependencies
- Never commit secrets or API keys
- Load secrets only from environment variables or CI secret stores
- Redact secret-like values from logs and artifacts

## Network and Determinism Policy
- Deterministic checks must run without network access
- Network access is allowed only for explicit model adapter calls
- Test fixtures should be local and versioned

## Artifact Retention Policy
- Retain CI artifacts for failure triage and auditability
- Minimum retention should cover active release cycle (recommendation: 14 to 30 days)
- Retain failing run artifacts with priority over passing runs when storage is constrained

## Tooling Change Process
Any change to approved tools or versions requires:
- Rationale
- Compatibility impact statement
- CI validation evidence
- Documentation update in this file
