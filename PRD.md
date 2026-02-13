# Product Requirements Document (PRD)

## Product Name
GuardForge

## 1. Overview
### Purpose
GuardForge is a developer-first framework for building, testing, and validating AI guardrails against prompt injection, unsafe outputs, tool misuse, and policy bypass. It turns prompt and policy safety from ad hoc manual checks into a repeatable engineering workflow.

### Problem Statement
AI applications face recurring safety failures:
- Prompt injection attacks
- Data exfiltration attempts
- Unauthorized or unsafe tool usage
- System prompt leakage
- Policy bypass through role confusion

Current workflows are fragmented, manual, and difficult to reproduce. Teams lack a standard harness to test guardrails, track regressions, and enforce policy quality in CI.

### Product Goals
Primary goals:
- Provide a standardized framework for guardrail testing
- Enable repeatable, automated adversarial testing
- Integrate safety checks into local and CI workflows
- Improve policy and prompt iteration speed

Secondary goals:
- Provide reusable attack pattern libraries
- Offer deterministic scoring and clear reporting
- Encourage best practices in AI safety engineering

## 2. Non-Goals (MVP)
The following are explicitly out of MVP scope:
- Multi-provider parity beyond OpenAI
- Hosted web dashboard product
- Real-time production traffic monitoring
- Enterprise policy management and role systems
- Automatic policy generation or remediation suggestions

## 3. Users, Personas, and Jobs-To-Be-Done
### Primary Personas
- AI application developers
- Full-stack engineers integrating LLM features
- AI platform/security engineers

### Secondary Personas
- Product engineers adding AI features
- Consultants and startup teams validating safety quickly

### Jobs-To-Be-Done
- As an AI engineer, I can run adversarial suites against a prompt/policy config before merge.
- As a platform engineer, I can enforce deterministic guardrail checks in CI with machine-readable outputs.
- As a security-focused developer, I can validate tool invocation boundaries and detect regressions over time.

## 4. Key Use Cases
### 4.1 Guardrail Test Execution
Developers define prompts, policies, tools, and expected outcomes, then run suites that evaluate whether outputs and tool behavior comply with policy.

### 4.2 Prompt Injection Simulation
Run known adversarial patterns (instruction override, leakage prompts, role confusion, hidden tool requests) and verify defenses hold.

### 4.3 Output Validation
Check for:
- Sensitive data leakage
- Schema validation failures
- Refusal-policy noncompliance
- Hallucination risk signatures (rule-based in MVP)

### 4.4 Tool Call Security
Verify:
- Tool allowlist enforcement
- Argument schema validation
- Privilege escalation blocking

### 4.5 Regression Testing
Run suites during pull requests, release candidates, and prompt/policy updates to detect behavioral drift.

## 5. MVP Product Contract
### 5.1 CLI Commands (MVP)
- `guardforge init`
- `guardforge test`
- `guardforge attack run`
- `guardforge report generate`
- `guardforge ci check`

### 5.2 Configuration Contract
Primary config file: `guardforge.yml`

Supported equivalent format: `guardforge.json`

Both must implement the same schema and validation rules.

### 5.3 Test Suite Model
Canonical model:
- `suite -> cases -> prompts/context -> expected policy outcomes -> severity`

Each case must produce normalized artifacts for scoring and reporting.

## 6. Core Features
### 6.1 Guardrail Test Harness
Execution pipeline:
`Input -> Model Call -> Observation Capture -> Policy Evaluation -> Scoring -> Report`

Captures:
- Prompt and system instructions
- Context and fixtures
- Model output
- Tool call attempts and results
- Rule evaluation outcomes

### 6.2 Attack Suite Library
Built-in patterns:
- Instruction override attacks
- Prompt leakage attempts
- RAG poisoning simulations (fixture-based)
- Role confusion attacks
- Data exfiltration prompts
- Formatting exploits

Extensible through user-defined suites.

### 6.3 Policy Engine
Supports:
- Forbidden output patterns
- Required refusal behavior
- Tool and argument restrictions
- Output structure and schema rules

### 6.4 Scoring System
Default order:
1. Deterministic checks
2. Optional LLM-judge checks (off by default; explicit enablement required)

Severity levels (fixed in MVP):
- `critical`
- `high`
- `medium`
- `low`
- `info`

Pass/fail semantics:
- Any `critical` or `high` violation fails the run
- `medium` and below are threshold-configurable

### 6.5 Reporting
Output formats:
- JSON
- HTML
- JUnit XML
- CI annotations (provider-compatible text format)

## 7. Architecture
### 7.1 Stack and Runtime
- Language: TypeScript
- Runtime: Node.js (LTS)
- Package manager: pnpm (preferred) or npm

### 7.2 Monorepo Structure
```text
packages/
  core/
  cli/
  adapters-openai/
  rules/
  reporter/
examples/
```

### 7.3 Package Responsibilities
- `packages/core`: orchestration, execution graph, observation model, policy evaluation pipeline
- `packages/cli`: command parsing, config loading, environment wiring, terminal output
- `packages/adapters-openai`: OpenAI Responses API adapter implementation
- `packages/rules`: deterministic validators and built-in rule set
- `packages/reporter`: JSON/HTML/JUnit serializers and artifact writers

### 7.4 Runtime Boundaries
- Provider adapter is isolated behind a stable interface
- Deterministic rule engine is provider-agnostic
- Reporter consumes normalized run artifacts only

## 8. Public Interfaces and Data Contracts
### 8.1 Adapter Interface (MVP)
```ts
interface ModelAdapter {
  generate(input: GenerationInput): Promise<GenerationResult>;
}
```

`GenerationInput` includes:
- user prompt
- system instructions
- tool metadata
- execution context

`GenerationResult` includes:
- output text
- structured output (if available)
- tool calls (attempted/executed)
- raw provider metadata

### 8.2 Rule Interface
```ts
interface Rule {
  evaluate(observation: Observation): RuleResult;
}
```

`RuleResult` fields:
- `ruleId`
- `passed`
- `severity`
- `evidence`
- `message`

### 8.3 Run Artifact Schema
`RunReport` must include:
- suite metadata
- per-case results
- violation list
- aggregate score and final status
- execution timestamps and runtime metadata

### 8.4 Config Schema (Top-Level)
- `project`
- `adapter`
- `models`
- `policies`
- `suites`
- `reporters`
- `thresholds`
- `ci`

## 9. CI and Developer Experience Requirements
### 9.1 CI Contract
Minimum required pipeline:
1. Install dependencies
2. Run typecheck
3. Run unit tests
4. Run guardrail baseline suite
5. Publish report artifacts (`json`, `junit`, optional `html`)
6. Exit non-zero if policy threshold is breached

### 9.2 Developer Experience Requirements
- Time to first test under 10 minutes using scripted quickstart
- Strong typing across config and rule APIs
- Clear, actionable CLI error output
- Starter templates for common safety scenarios

## 10. Threat Model (MVP)
Threat classes covered in MVP:
- Direct prompt injection
- Indirect instruction contamination via retrieved context fixtures
- Prompt/system leakage attempts
- Unauthorized tool invocation and argument abuse
- Output policy bypass attempts

Threat classes not fully covered in MVP:
- Production runtime anomaly detection
- Full sandboxing/isolation enforcement outside test harness

## 11. Non-Functional Requirements
- Fast CI execution with deterministic baseline checks
- Provider-agnostic core interfaces
- Versioned and auditable guardrail configurations
- Reproducible test runs where provider behavior allows

## 12. Versioning Strategy
- Semantic versioning for CLI and packages
- Versioned config schema with explicit compatibility notes
- Rule IDs are stable and treated as public compatibility contracts
- Breaking schema or rule semantics require migration notes

## 13. Success Metrics
- Time to first passing test run under 10 minutes (new project)
- Guardrail checks integrated in CI for pilot teams
- Reduced safety regressions between releases
- High signal-to-noise ratio in deterministic checks (measured by triage feedback)

## 14. Risks and Mitigations
### Risks
- Nondeterministic model behavior
- LLM-judge drift and inconsistency
- Cost overrun from optional judge checks
- False positives reducing developer trust

### Mitigations
- Deterministic checks are authoritative baseline
- LLM judging is opt-in and clearly labeled
- Pin provider model/version and snapshot evaluator settings
- Support suite-level severity thresholds and suppression workflow with audit trail

## 15. Rollout Plan
### Phase 0: Foundation
- Define config schema and core artifact types
- Implement deterministic rule engine primitives

### Phase 1: MVP CLI + OpenAI Adapter
- Ship core CLI commands
- Integrate OpenAI Responses adapter
- Ship baseline attack and policy rule sets

### Phase 2: CI Hardening
- Add standard CI workflow template
- Enforce blocking gates and artifact publishing

### Phase 3: Expansion (post-MVP)
- Additional adapters
- Optional dashboard and richer analytics

## 16. Definition of Done (MVP)
MVP is complete when:
- CLI commands in Section 5.1 are functional and documented
- `guardforge.yml` and `guardforge.json` are schema-compatible
- Deterministic-first scoring and severity gating are enforced
- OpenAI adapter passes contract tests
- CI baseline workflow enforces typecheck, tests, and guardrail suite
- JSON and JUnit outputs are generated in CI runs
- Core docs and examples allow new users to run first suite in under 10 minutes
