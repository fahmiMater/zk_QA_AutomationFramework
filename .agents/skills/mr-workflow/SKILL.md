---
name: mr-workflow
description: Standard Git workflow for this repo on local GitLab — feature branches, Conventional Commits, and Merge Request preparation with the verification gate. Use when starting work, committing, or preparing a MR.
---

# Branch & Merge Request Workflow (Local GitLab)

## Output language (mandatory)
- All prose for the user MUST be in Arabic (RTL). Branch names, commit messages, commands and technical terms in English.

## Branches
- One task = one branch: `feat/<scope>`, `fix/<scope>`, `docs/<scope>`, `chore/<scope>`.
- Example: `feat/login-page-object`, `fix/api-strict-mode`.

## Commits — Conventional Commits
- Format: `type(scope): summary` — e.g. `feat(pages): add login page object`, `fix(api): enforce strictMode for live backends`.
- Never commit: `.env`, `playwright-report/`, `test-results/` (all gitignored already).

## The gate (before any push)
```bash
npm run typecheck
npx playwright test --list
npm test   # if a backend/expectation is available
```
A failing gate means no push — fix first.

## Merge Request
1. Push the branch to the local GitLab remote and open a MR targeting `main`.
2. MR description (written in Arabic by the agent) must state: what changed, why, how it was verified (command + result), and any risk.
3. Request a `review-test` skill run on the diff before approval.
4. Merge strategy: keep history readable (fast-forward or merge commit per team setting); delete the branch after merge.

## Remote notes (local GitLab)
- The local remote origin must point to the internal GitLab host — if `git remote -v` shows anything else, stop and ask the user for the correct URL in Arabic.
- Credentials: SSH deploy key or a personal access token; never embed tokens in `.gitlab-ci.yml` or remote URLs inside committed files.

## Failure handling
- If `npm test` cannot run locally (no backend), push only if `typecheck` + `--list` pass, and state in the Arabic MR description that runtime verification happened (or is pending) in CI.
