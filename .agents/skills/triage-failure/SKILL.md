---
name: triage-failure
description: Diagnoses a failing Playwright test systematically using the report, trace, and this framework's specific failure signatures, then classifies product bug vs test bug vs environment issue. Use when a test fails in CI or locally.
---

# Triage a Failing Test

## Output language (mandatory)
- Diagnosis prose MUST be in Arabic (RTL). Error messages, selectors, paths and commands stay in English.

## Evidence gathering (in order)
1. **HTML report** (this project's chosen report format): open `playwright-report/index.html` — served with `npx playwright show-report`. The config keeps `trace: retain-on-failure` and `screenshot: only-on-failure` (see `playwright.config.ts`).
2. Inspect the trace of the failed test: timeline, network calls, DOM snapshot at failure.

## Failure signatures specific to THIS framework
| Symptom | Likely cause | Fix |
|---|---|---|
| `Timeout ... waiting for [data-automation-id=...]` | ID renamed/removed in the UI, or a previous step failed silently | Compare ID with the current screen; fix Page Object, not the wait |
| `strict mode violation` — same ID matched N elements | Non-unique automation ID on the page | Fix the ID in the app or scope the locator contextually |
| Got status 200/201 but the backend is actually down | `strictMode: false` triggered the offline mock fallback in `framework/core/api/BaseApiService.ts` (`ECONNREFUSED` → synthetic response) | Re-run with `{ strictMode: true }` in `ApiRequestOptions` when a real backend is intended |
| `401/403` unexpectedly | Token for the role missing in `AuthTokenManager` or wrong `.env` users | Check `.env` against `.env.example`; `ApiClient.login()` must succeed before tests |
| Test passes alone, fails in suite | Shared state (same account/data mutated by parallel tests) | Isolate data per test; disable parallelism for that suite |

## Classification (end the Arabic report with exactly one)
1. **خلل منتج (Product bug):** open a bug ticket; attach the trace and the failing request/response.
2. **اختبار/كود قديم (Test defect):** fix the spec or Page Object via a normal MR.
3. **بيئة/بيانات (Environment):** fix config; NEVER "fix" a test to skip around an environment problem.

## Hard rules
- Never remove an assertion or inflate a timeout to make a test pass — that hides the defect.
- Never mark a flaky test as "known issue" in code comments; it must be triaged or fixed.
