---
name: de-flake-test
description: Removes flakiness from a test that passes sometimes and fails other times, replacing implicit timing assumptions with the framework's conditional waiting and isolation patterns. Use when a test is reported as flaky or intermittently red.
---

# De-Flake a Test

## Output language (mandatory)
- All prose for the user MUST be in Arabic (RTL). Keep code, selectors, paths, commands and technical terms in English.

## Diagnosis loop (always start here)
1. Reproduce locally: run the single test 3–5 times consecutively:
   `npx playwright test <file> -g "<title>" --repeat-each=5`
2. If it fails only in the full suite: suspect shared state or parallelism, not timing.
3. Open the trace of a failed run (`npx playwright show-report` → trace) and note WHERE the run diverges: a missing element, a late response, or leftover state.

## Fix patterns (in order of preference)
1. **Timing flake:** replace any `waitForTimeout` / fixed sleeps with conditional waits from `framework/core/waits/WaitUtils.ts` (`waitForPageReady`, `waitUntilVisible`, `waitUntilHidden`, `waitForEnabled`, `waitForText`) or Playwright auto-waiting assertions. A fixed sleep is a symptom, never a fix (docs/adr/ADR-008 No Hard Wait Policy.md).
2. **Selector flake (`strict mode violation`, element detached):** make the automation ID unique and stable; for dynamic lists, target a specific row context, not the global page.
3. **Network flake:** assert on the real backend state via the `network` fixture (`framework/core/fixtures/test.ts` → `NetworkManager`) — wait for the actual request/response instead of the UI side effect.
4. **Shared-state flake (passes alone, fails in suite):** isolate data per test (unique identifiers per run, e.g. timestamped names); if a suite is inherently stateful, disable parallelism for that project in `playwright.config.ts` (`fullyParallel: false` + explicit `workers`), documenting why in Arabic.
5. **Auth flake (401 sometimes):** token lifecycle — `AuthTokenManager` (`framework/core/api/AuthTokenManager.ts`) caches tokens per role; call `clearTokens()` between unrelated suites if roles rotate, and ensure `ApiClient.login()` completed before tests.

## Verification (before delivering)
- `--repeat-each=5` passes 5/5 locally.
- Full suite passes once.
- No forbidden pattern reintroduced: grep the changed files for `waitForTimeout` — zero matches.

## Hard rules
- Never "fix" flakiness by catching and ignoring the assertion.
- Never bump retries in `playwright.config.ts` as the fix; retries mask flakes, they do not remove them (retries may be added separately as a CI safety net, stated as such in Arabic).
