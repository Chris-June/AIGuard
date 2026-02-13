# TODO: Publish GuardForge To npm (First-Time Setup)

This file is a step-by-step checklist for publishing `@chrisjune/guardforge` to npm.
It is written for first-time publishers.

## Where We Are Right Now

- Repo: `https://github.com/Chris-June/AIGuard`
- Package name: `@chrisjune/guardforge`
- Version (current): `0.1.0`
- GitHub Pages docs: `https://chris-june.github.io/AIGuard/`
- GitHub Actions: CI is passing
- npm publish from local machine currently fails with `EOTP` because npm requires 2FA for publishing.

## Part A: One-Time npm Setup (2FA)

Goal: enable npm 2-factor authentication so you can publish.

1. Install an authenticator app on your phone.
   - iPhone: Google Authenticator or Microsoft Authenticator
   - Android: Google Authenticator or Microsoft Authenticator

2. Enable 2FA on npm:
   - Go to `https://www.npmjs.com/`
   - Click your avatar (top right) -> Account/Settings
   - Go to "Two-factor authentication"
   - Choose "Authentication app"
   - Set the level to "Authorization and writes"
   - Scan the QR code using the authenticator app
   - Save the "recovery codes" somewhere safe (do not commit them)

3. Confirm login from your laptop:
   - Run: `npm whoami`
   - Expected: `chrisjune`

## Part B: First Publish (One-Time "Claim The Package")

Goal: publish the first version from your laptop so the package exists on npm.

1. Verify the repo builds and tests cleanly:
   - `cd /Users/chrisjune/Desktop/AIGuard`
   - `pnpm release:verify`

2. Publish from the CLI package folder using an OTP code from the authenticator app:
   - `cd /Users/chrisjune/Desktop/AIGuard/packages/cli`
   - `npm publish --access public --otp=123456`

Notes:
- Replace `123456` with the current 6-digit code shown in your authenticator app.
- The code changes frequently. If it fails, run again with a fresh code.

3. Confirm it exists on npm:
   - `npm view @chrisjune/guardforge version`
   - Expected: `0.1.0`

## Part C: Clean Up npm Package Metadata (Optional but Recommended)

Goal: remove npm "auto-corrected package.json" warnings on publish.

1. Run npm's fixer in the CLI package:
   - `cd /Users/chrisjune/Desktop/AIGuard/packages/cli`
   - `npm pkg fix`

2. Commit + push the result:
   - `cd /Users/chrisjune/Desktop/AIGuard`
   - `git add packages/cli/package.json`
   - `git commit -m "chore(cli): npm pkg fix metadata"`
   - `git push origin main`

## Part D: Set Up Trusted Publishing (GitHub Actions -> npm)

Goal: future releases publish automatically from GitHub Actions when you push a `v*` tag.

1. In npm website (package settings for `@chrisjune/guardforge`), enable "Trusted Publishing"
   and connect it to:
   - GitHub repo: `Chris-June/AIGuard`
   - Workflow: `.github/workflows/release.yml`

2. (Optional) If npm asks for an Actions Environment, we use:
   - `production-release`

## Part E: Publish A Release From Git Tags

Goal: publish via CI (with provenance) and create a GitHub Release.

1. Update version and changelog:
   - Update `packages/cli/package.json` version (semver)
   - Update `CHANGELOG.md`

2. Commit and push:
   - `git add -A`
   - `git commit -m "release: vX.Y.Z"`
   - `git push origin main`

3. Create and push an annotated tag:
   - `git tag -a vX.Y.Z -m "vX.Y.Z"`
   - `git push origin vX.Y.Z`

4. Watch GitHub Actions:
   - Actions -> Release workflow should run
   - It should publish `@chrisjune/guardforge@X.Y.Z` to npm
   - It should create a GitHub Release

## Safety Note: Rotate Leaked Keys

An OpenAI API key was pasted into chat earlier. Treat it as compromised:
- rotate/revoke it in your OpenAI dashboard
- update your GitHub `OPENAI_API_KEY` secret to the new value

