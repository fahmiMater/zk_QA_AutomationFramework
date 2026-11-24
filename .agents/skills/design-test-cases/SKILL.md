---
name: design-test-cases
description: Designs test cases from a Tuleap requirements matrix (operation, Req ID, requirement text) using ISTQB techniques, classifying each requirement as API/UI/both, and emits a traceable design table plus runnable Playwright specs tagged with the Tuleap IDs. Use when given requirements (e.g. tuleap_requirements_matrix.md) and asked to produce test cases automatically without losing any path.
---

# Design Test Cases from Tuleap Requirements

Write all user-facing prose in Arabic. Keep code, IDs, paths and technical terms in English. Requirement text is evidence: never translate or paraphrase it in the design table.

## Inputs (contract — ask in Arabic for any missing item)
1. **Requirements matrix** (e.g. `tuleap_requirements_matrix.md`): columns `العملية | معرف المتطلب | نص المتطلب`. Every `معرف المتطلب` is a Tuleap artifact id and MUST propagate to every generated artifact.
2. **UI element inventory** `<feature>.ui-elements.csv` from `/extract-ui-elements` (contract: `.agents/skills/extract-ui-elements/resources/inventory-contract.md`). If absent, request it first; you may not invent element ids.
3. **API contracts**: OpenAPI/Swagger file or documented endpoints; if none, derive endpoints only from requirement text or existing `apps/<app>/api/` services and mark them `unverified`.
4. **Roles & permissions** referenced in requirement text (e.g. صلاحية إضافة سند قبض) mapped to `.env` role accounts (`API_USERNAME`, `ACCOUNTANT_*`, `AUDITOR_*`, `UNAUTHORIZED_*`).
5. **Environment** (`.env`) and **preconditions** as data: each precondition (e.g. "سندات نشطة في قاعدة البيانات", "مستخدم منزوع الصلاحية") must map to a fixture or seeding step (existing `network` fixture, `ApiClient` seeding, or an explicit API/DB seed), never to manual hope.
6. **API/UI classification**: classify each requirement `API`, `UI`, or `both` using its own text — pure status/permission/calculation logic → `API`; mentions of شاشة/زر/رسالة/تأكيد/مؤشر/حقول → `UI`; both when data + presentation are both mandated. One requirement may yield both an API spec and a UI spec.

## Design procedure (ISTQB)
1. Parse the matrix; group rows by `العملية`. For each requirement row, identify: trigger, rule, expected error message (quoted), and data constraints.
2. Apply techniques explicitly and record which technique covers which Req ID:
   - **Decision tables**: permission × state combinations (مصرح/غير مصرح/غير مسجل × حالة الطلب).
   - **Equivalence partitioning**: valid/invalid partitions for each field rule (e.g. مدين XOR دائن أكبر من الصفر).
   - **Boundary value analysis**: numeric and range rules (سعر الصرف ضمن النطاق المسموح, maxlength, المبالغ).
   - **State transition**: lifecycle of الطلب (مسودة → معتمد → معالج; تعليق → فك تعليق) — every guard (حالة الطلب لا تسمح بالتعديل) is a transition test.
   - **Pairwise/combinatorial**: dimension combinations (مركز تكلفة/نشاط/مشروع) enabled/disabled × إجباري/اختياري.
   - **Error guessing**: duplicate lines (سطر مكرر), closed period, inactive branch/account, deleted record (`deleted_at IS NULL`).
3. Ensure completeness: every Req ID appears in ≥1 test case; every error message quoted in a requirement appears in ≥1 assertion. List any Req ID you could not cover and why — do not silently drop paths.
4. Emit the design table as CSV (`<operation>.test-design.csv`, UTF-8, semicolon-delimited to match the team's Tuleap export):
   `req_id;operation;test_case_ref;technique;level(API|UI|both);priority;preconditions(fixture/seeding);test_data;steps;expected_result;requirement_quote`
   Include one **traceability row per Req ID** (trace matrix), even when covered by a shared case.
5. Generate runnable specs: `apps/<app>/tests/<operation>-api.spec.ts` and/or `-ui.spec.ts`. Import `test/expect` from `framework/core/fixtures/test.ts`; target elements only via the inventory (`verified` rows) or governed fallbacks; validate API responses with Zod schemas; use `{ strictMode: true }` against real backends.
6. **Tag every test with its Tuleap ids** so results can be pushed later:
   ```typescript
   test('TC-20068 لا تمتلك صلاحية عرض الطلبات', { tag: ['@api', '@req:11253', '@tc:20068'] }, async ({ request }) => { ... });
   ```
7. Verify: `npm run typecheck && npx playwright test --list` — every designed case must appear. Report in Arabic: counts per operation, per technique, per level, coverage of Req IDs, uncovered gaps, and the artifacts' paths.

## Failure handling
- Ambiguous requirement (e.g. unspecified error text): still design the negative case, quote the ambiguity in `expected_result`, and list it in the Arabic report as needing product confirmation — ambiguity suspends nothing by default.
- Missing inventory or contracts for a UI requirement: produce the API-level cases and record the UI cases as `design-only` with the exact missing evidence; do not fabricate selectors.
- Never invent Tuleap ids; only reuse ids present in the matrix or given by the user.
