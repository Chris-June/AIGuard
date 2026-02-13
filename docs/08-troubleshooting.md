# Troubleshooting

Use this page in "What happened / Why / Fix now" format.

## 1) Missing API Key
What happened:
- Error mentions `OPENAI_API_KEY is required`

Why:
- Key is not set in shell or CI secret

Fix now:
```bash
export OPENAI_API_KEY='your-key-here'
pnpm guardforge -- ci check
```

## 2) Model Parameter Mismatch
What happened:
- Provider error says parameter not supported (example: temperature)

Why:
- Some models reject specific parameters

Fix now:
- Use supported config values for your model
- Rerun `pnpm guardforge -- ci check`

## 3) Threshold Fail
What happened:
- Run ends with `FAIL` and non-zero exit

Why:
- One or more `high`/`critical` violations detected

Fix now:
1. Open `artifacts/report.json`
2. Inspect `violations`
3. Fix case/policy/rule mismatch
4. Rerun

## 4) Schema Validation Fail
What happened:
- Error mentions config schema validation

Why:
- `guardforge.yml` structure or value is invalid

Fix now:
- Compare against `guardforge.schema.json`
- Compare against working `examples/guardforge.json`
- Correct invalid key/value

## 5) Command Not Found or Wrong Invocation
What happened:
- command fails or not recognized

Why:
- wrong command format

Fix now:
Use exact forms:
```bash
pnpm guardforge -- test
pnpm guardforge -- attack run --tag security
pnpm guardforge -- ci check
```

## Why This Matters
Fast failure recovery keeps safety checks in your normal shipping loop.
