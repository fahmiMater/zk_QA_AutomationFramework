---
name: audit-ids
description: Audits screens (HTML files, live pages, or page objects) for data-automation-id coverage and violations of the semantic-ID standard, producing an Arabic HTML report. Use when the user asks to check ID compliance before writing tests.
---

# Audit Automation IDs

## Output language (mandatory)
- The audit report MUST be an Arabic RTL HTML page (use the shared template `docs/templates/report-template.html`), with selectors and code LTR inside `<pre>/<code>`.

## Standard being audited
- Every interactive/verifiable element must carry `data-automation-id` (docs/standards/AUTOMATION_UI_STANDARD.md, docs/explanation/semantic-ids-strategy.md).
- ID format: `kebab-case`, contextual: `<context>-<element>[-btn]` — e.g. `login-username`, `dialog-save-btn` (docs/standards/LOCATOR_STRATEGY.md).
- Framework resolution: `framework/core/locators/AutomationLocator.ts` maps IDs to `[data-automation-id="..."]`.
- Forbidden: selecting by visible text, CSS classes, or XPath.

## Inventory input
Accept `<feature>.ui-elements.csv` using `.agents/skills/extract-ui-elements/resources/inventory-contract.md`. Distinguish confirmed missing/ambiguous IDs from coverage gaps and screenshot-only evidence. Evaluate duplicates within their declared screen, state and scope; do not conflate repeated scoped controls with collisions. A missing ID is reported as locator debt with a recommended fallback strategy — never as a reason to defer, disable or exclude the affected test.

## Steps
1. **Collect inputs:** from provided HTML/screenshots/or a running page (`page.content()`), list all interactive elements (`button, input, select, a[href], [role=...], table cells`).
2. **Classify each element:**
   - ✅ has a unique, well-named `data-automation-id`
   - ⚠️ has an ID that duplicates another element on the same page
   - ❌ interactive but missing an ID
   - ❌ ID violates naming (camelCase, spaces, too generic like `btn1`)
3. **Produce the report** filling the shared HTML template: stats (total elements / covered / partial / missing), a findings table (element, current ID, proposed ID, severity), and a summary paragraph in Arabic.
4. **Proposed IDs** must be deterministic and consistent with the existing Page Objects: read `apps/<app>/pages/` first so new IDs align with what the framework already expects.
5. **Deliverables:** the HTML file path + a one-paragraph Arabic summary with the counts, and the exact HTML attributes the UI team must add:
   ```html
   <button data-automation-id="dialog-save-btn">حفظ البيانات</button>
   ```

## Failure handling
- If only a screenshot is provided (no HTML), IDs cannot be verified — say so plainly in Arabic and request the HTML or a live page instead of guessing.
- Never propose IDs that duplicate ones already used by another Page Object in the repo.
