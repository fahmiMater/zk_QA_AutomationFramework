# AGENTS.md — Agent Instructions for This Repository

## What this project is
A clean Playwright + TypeScript UI & API test-automation framework, domain-neutral, designed for a local GitLab with Docker runners. The team works in Arabic; agents must follow the output-language rule in every skill.

## Skill index (.agents/skills/ — Antigravity workspace skills)
| Skill | Purpose |
|---|---|
| `scaffold-module` | Scaffold a complete app module (pages/api/flows/data/tests) + config wiring |
| `write-ui-test` | Write UI tests via framework fixtures, Page Objects, WaitUtils |
| `write-api-test` | Write API tests via BaseApiService/ApiClient with Zod + role auth |
| `generate-page-object` | Generate XxxPage from a screen; maps data-automation-id to ComponentFactory |
| `data-driven-tests` | Convert repetitive scenarios to JSON-driven tests via JsonTestDataProvider |
| `create-component` | New framework component (only skill allowed to write inside framework/) |
| `review-test` | Pre-merge review checklist with blocking/required/suggested verdict |
| `triage-failure` | Diagnose failures via report/trace; framework-specific failure signatures |
| `de-flake-test` | Fix intermittent failures (waits, isolation, auth lifecycle) |
| `gitlab-ci-setup` | .gitlab-ci.yml for Docker runners on a local GitLab instance |
| `ci-reporting` | Arabic RTL HTML reports (docs/templates/report-template.html) + GitLab artifacts |
| `env-config` | .env/environment wiring via EnvironmentManager; secrets only in .env |
| `mr-workflow` | Branches, Conventional Commits, MR prep, verification gate |
| `extend-fixtures` | Add custom fixtures following the NetworkManager pattern in test.ts |
| `extract-ui-elements` | Inventory nested UI controls and test metadata as CSV for downstream skills |
| `tuleap-sync` | Map tests to Tuleap TTM (testsuite=TC_<aid>) and push JUnit results to campaigns |
| `design-test-cases` | ISTQB test design from Tuleap requirements matrix, API/UI classification, tagged specs |
| `audit-ids` | Audit data-automation-id coverage; Arabic HTML findings report |

## Non-negotiable rules (enforced by every skill)
1. Selectors: `data-automation-id` only. No visible text, CSS classes, or XPath.
2. Imports: `test/expect` from `framework/core/fixtures/test.ts`, never from `@playwright/test`.
3. Waiting: `framework/core/waits/WaitUtils.ts` — `waitForTimeout` is forbidden.
4. Inheritance: pages extend `framework/core/base/BasePage.ts`, flows extend `framework/core/base/BaseFlow.ts`, API services extend `framework/core/api/BaseApiService.ts`.
5. Secrets: from `.env` only (template `.env.example`); in GitLab CI use protected/masked CI/CD Variables.
6. App code lives in `apps/<app-kebab-case>/{pages,api,flows,data,tests}/` — nothing inside `framework/` except via `create-component`.
7. Naming: docs/standards/NAMING_CONVENTION.md (`XxxPage.ts`, `XxxApiService.ts`, `<feature>.spec.ts`).
8. Gate before delivery: `npm run typecheck` then `npm test` (or `npx playwright test --list`).
