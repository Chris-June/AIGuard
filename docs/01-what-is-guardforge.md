# What Is GuardForge?

GuardForge is a safety test tool for AI apps.

Think of it like a seatbelt test for your prompts and AI behavior.

## The Problem It Solves
Without guardrails, AI features can:
- Reveal hidden instructions
- Leak sensitive information
- Try unsafe tool calls
- Follow malicious prompt injection

GuardForge helps you catch these before users do.

## How It Works (Plain Language)
1. You define test cases in `guardforge.yml`.
2. GuardForge sends prompts to your model.
3. GuardForge checks the model output against your safety rules.
4. You get pass/fail reports.

## What You Get
- A CLI workflow you can run locally and in CI
- Deterministic checks (consistent rules)
- Reports your team and CI can read (`json`, `junit`, `html`)

## Why This Matters
If your AI feature ships without safety checks, failures become expensive and public.
