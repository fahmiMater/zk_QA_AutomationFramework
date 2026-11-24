---
name: review-test
description: Reviews new or modified test code against the framework's hard standards and produces a blocking/required/suggested verdict. Use for pre-merge review of a MR containing tests.
---

# Review Test Code (Pre-Merge)

## Output language (mandatory)
- The review report prose MUST be in Arabic (RTL). Keep code snippets, identifiers, file paths and technical terms in English.

## Checklist (in order)
1. **Imports:** spec files import `test/expect` from `framework/core/fixtures/test.ts`, NOT from `@playwright/test`.
2. **Architecture:** all UI interaction goes through Page Objects extending `framework/core/base/BasePage.ts`; no `page.locator(...)` inside `.spec.ts` files. Multi-page logic lives in Flows extending `framework/core/base/BaseFlow.ts`.
3. **Selectors:** zero XPath, zero CSS-class selectors, zero visible-text selectors — only `data-automation-id` (docs/standards/LOCATOR_STRATEGY.md). IDs are kebab-case, contextual: `<context>-<element>[-btn]`.
4. **Waiting:** no `waitForTimeout` anywhere (docs/adr/ADR-008). Conditional waiting via `framework/core/waits/WaitUtils.ts` or Playwright auto-waiting.
5. **API tests:** services extend `framework/core/api/BaseApiService.ts` (or use `framework/core/api/ApiClient.ts`); every response validated with a Zod schema via `framework/core/api/ApiResponseValidator.ts`; permission-negative case (`role` → expect 403) exists whenever the endpoint has authorization.
6. **Secrets:** no credentials in code or JSON — resolved from `.env` (template: `.env.example`).
7. **Data-driven:** repeated scenarios use `framework/core/data/providers/JsonTestDataProvider.ts` instead of copy-pasted tests.
8. **Structure:** file locations match `apps/<app>/{pages,api,flows,data,tests}/`; naming matches docs/standards/NAMING_CONVENTION.md (`XxxPage.ts`, `XxxApiService.ts`, `<feature>.spec.ts`).
9. **Gate:** `npm run typecheck` passes and `npx playwright test --list` resolves all specs.

## Verdict format (render the report in Arabic)
Classify each finding:
- **حاجب للدمج (Blocking):** hard wait, text/class/XPath selector, real credentials committed, missing 403 case for an authorized endpoint, broken typecheck.
- **مطلوب قبل الدمج (Required):** missing Zod validation, locator calls inside spec, unregistered project in playwright.config.
- **تحسين مقترح (Suggested):** data-driven conversion, better naming, added WaitUtils coverage.
End with: overall verdict (approve / request-changes), the exact commands the author must run, and any unverified assumption.
