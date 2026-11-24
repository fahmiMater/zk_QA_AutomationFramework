---
name: env-config
description: Sets up environment configuration (QA/UAT/staging on local servers) wiring .env with API base URLs, service ports and role accounts through EnvironmentManager. Use when adding an environment or pointing tests at a new backend.
---

# Environment Configuration

## Output language (mandatory)
- All prose for the user MUST be in Arabic (RTL). Keep variable names, paths, commands and technical terms in English.

## Framework touchpoints (read before editing)
- `framework/core/config/EnvironmentManager.ts` — static `load()` returning the environment object.
- `framework/core/config/Configuration.ts` and `ExecutionContext.ts` — how config flows into the framework.
- `.env.example` — the canonical variable set: `API_BASE_URL`, `UM_SERVICE` (`:8112/...`), `GL_SERVICE` (`:8113/...`), `CONFIG_SERVICE` (`:8111/...`), and role credentials (`API_USERNAME/API_PASSWORD`, `ACCOUNTANT_*`, `AUDITOR_*`, `UNAUTHORIZED_USER`).

## Steps
1. **Ask for (in Arabic, once):** backend host, service ports, and the role accounts provisioned. Never guess URLs.
2. Create the `.env` locally from the template: `cp .env.example .env` — then fill real values. `.env` is gitignored; NEVER commit it.
3. For per-environment files the repo convention is `.env.qa`, `.env.stage` — selected via `ENV` if the team's EnvironmentManager wiring uses it; confirm by reading `EnvironmentManager.ts` first, not by assuming.
4. Pass `API_BASE_URL` through to Playwright projects in `playwright.config.ts` via `process.env.API_BASE_URL` (this replaces any hardcoded `localhost` default in service constructors — `BaseApiService`/`ApiClient` accept a `baseUrl` argument).
5. Verify: `npm run typecheck` and one smoke API test against the real backend with `{ strictMode: true }` to prove no offline mock fallback fired.

## Hard rules
- Secrets live only in `.env` (or GitLab CI/CD Variables — protected + masked) — never in code, JSON datasets, or `.env.example`.
- In GitLab CI, define credentials as CI/CD Variables in the project settings, not inline in `.gitlab-ci.yml`.

## Failure handling
- Backend unreachable (`ECONNREFUSED` with a suspiciously green 200 result): that is the offline mock fallback in `framework/core/api/BaseApiService.ts`; re-run with `strictMode: true` and tell the user in Arabic what is actually reachable.
- Missing role accounts: list the exact missing `.env` keys in Arabic and stop.
