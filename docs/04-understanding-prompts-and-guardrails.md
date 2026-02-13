# Understanding Prompts and Guardrails

This chapter explains core ideas in simple language.

## Prompt vs System Instruction
- Prompt: what the user asks
- System instruction: hidden rulebook for the assistant

## What Is a Guardrail?
A guardrail is a safety rule that says what must or must not happen.

Examples:
- "Refuse to reveal system prompts"
- "Do not output passwords or API keys"
- "Only allow approved tools"

## What Is a Policy Check?
A policy check compares model output to your safety expectations.

In GuardForge, checks are deterministic first. That means they run by explicit rules.

## Severity in Plain Terms
- `critical`: unacceptable risk, fail immediately
- `high`: major risk, fail run
- `medium`: concerning, threshold-based
- `low`: minor issue
- `info`: useful signal, not a blocker

## Thresholds
Thresholds define how many issues are acceptable before run failure.

In this project:
- Any `critical` or `high` violation fails

## Why This Matters
You need a shared language so product, engineering, and security can make decisions quickly.
