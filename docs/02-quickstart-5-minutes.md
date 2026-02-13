# Quickstart in 5 Minutes

This is the fastest path to your first GuardForge run.

## Option A: Public npm Install (Recommended for users)

Install globally:

```bash
npm i -g @chrisjune/guardforge
```

Set API key:

```bash
export OPENAI_API_KEY='your-key-here'
```

Run:

```bash
guardforge ci check
```

## Option B: From Source (Contributors)
- Node.js LTS
- pnpm

Install and run:

```bash
pnpm install
export OPENAI_API_KEY='your-key-here'
pnpm guardforge -- ci check
```

## Confirm Artifacts
```bash
ls artifacts
```

Expected files:
- `report.json`
- `report.junit.xml`
- `report.html`

## If It Fails
Open:
- `artifacts/report.json`
- `docs/08-troubleshooting.md`

## Why This Matters
The same safety flow runs locally and in CI, so your team uses one reliable process.
