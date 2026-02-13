# GuardForge Agent Topology

## Purpose
Define a swarm-specialist operating model so implementation work can proceed in parallel with clear ownership, handoffs, and escalation paths.

## Agent Roles
### 1) Orchestrator Agent
Owner: delivery coordination and integration quality.

Responsibilities:
- Decompose work into trackable slices
- Sequence specialist work and manage dependencies
- Resolve conflicts across interfaces and priorities
- Maintain delivery checklist and integration status

Outputs per cycle:
- Work breakdown with owner per task
- Dependency map
- Integrated risk register

### 2) Core Engine Agent
Owner: `packages/core` and policy execution graph.

Responsibilities:
- Implement orchestration pipeline and observation model
- Enforce deterministic scoring order
- Define stable artifact structures consumed by reporting

Outputs per cycle:
- Updated core contracts and implementation notes
- Unit tests for orchestration and rule execution
- Known limitations and edge-case behavior notes

### 3) Adapter Agent
Owner: `packages/adapters-openai` and adapter contract conformance.

Responsibilities:
- Implement OpenAI Responses adapter
- Normalize provider responses into GuardForge artifacts
- Maintain adapter integration tests and mock fixtures

Outputs per cycle:
- Adapter contract test results
- Provider/version compatibility notes
- Failure mode handling summary

### 4) Security Rules Agent
Owner: `packages/rules` and adversarial suite coverage.

Responsibilities:
- Author deterministic rules and baseline attack suites
- Map threats to rule IDs and test cases
- Validate severity assignments and policy semantics

Outputs per cycle:
- Added/updated rules and suite fixtures
- Coverage matrix by threat class
- False positive/negative risk notes

### 5) Reporting/CI Agent
Owner: `packages/reporter` and CI workflow enforcement.

Responsibilities:
- Implement JSON, HTML, and JUnit outputs
- Wire CI pipeline gates and artifact publishing
- Ensure failure thresholds are visible and actionable

Outputs per cycle:
- CI workflow updates
- Artifact schema validation results
- Report usability notes for local and CI contexts

## Handoff Contract (Mandatory)
Every agent handoff must include:
- Checklist of completed items
- List of changed files
- Tests run and results summary
- Known risks and unresolved issues
- Any contract changes and downstream impact

## Integration Gates
Work cannot be marked complete unless:
- Affected tests pass
- Contract changes are documented
- Required reviewers/owners sign off
- No unresolved blocker is hidden in notes

## Escalation Protocol
Escalate to Orchestrator when:
- Interface mismatch is discovered across packages
- A dependency blocks another agent for more than one work cycle
- Acceptance criteria conflict across role deliverables

Escalation packet must include:
- Problem statement
- Impacted files/interfaces
- Proposed options with recommended decision
- Consequences of delay
