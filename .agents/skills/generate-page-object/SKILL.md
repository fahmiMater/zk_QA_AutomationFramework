---
name: generate-page-object
description: Generates a XxxPage class extending BasePage using ComponentFactory methods, mapping every interactive element to its data-automation-id. Use when the user provides a screen (HTML/description/screenshot) and needs its Page Object.
---

# Generate a Page Object

## Output language (mandatory)
- All prose for the user MUST be in Arabic (RTL). Keep code, identifiers, file paths, CLI commands and technical terms in English.

## Sources of truth — read BEFORE generating (never invent APIs)
1. Inheritance: `framework/core/base/BasePage.ts` — provides `this.page` and `this.components`.
2. Component factory: `framework/core/factory/ComponentFactory.ts` — available builders (verified in this repo):
   `grid, dialog, tabs, textBox, dropdown, lookup, checkbox, radio, datePicker, fileUpload, button, multiSelect, menu, tree, toast, notification`.
3. Raw component APIs: read the actual `framework/components/<component>/<Xxx>Component.ts` file to confirm available methods (e.g. `TextBoxComponent` → `fill/clear/getText/assert`; `ButtonComponent` → `click/getText/assert`; `GridComponent` → `getRowCount/row/sort/filter/paginator/getColumnIndex`).
4. Advanced selectors: `framework/core/automation/Automation.ts` — `byId, byRole, byAttribute, byAction, byColumn, byField, byGrid, byDialog, byTab`.

## Inventory handoff
When a `<feature>.ui-elements.csv` is supplied, read `.agents/skills/extract-ui-elements/resources/inventory-contract.md`. Map verified rows to existing framework APIs using `parent_key`, state and scope. Treat static IDs as candidates, not proof; report missing/ambiguous targets without generating guessed selectors. When a row is `locator_status=fallback`, implement its declared strategy (highest available: role+accessible-name, label, name-attr, html-id, visible-text, scoped-css — never positional XPath or dynamic classes), do not block generation, and mark affected Page Object methods so tests carry the `@fallback-locator` tag with the debt tracked in the register.

## Steps
1. **Extract automation IDs.** From the provided screen/HTML, list every interactive element with its `data-automation-id`. If the screen lacks IDs, DO NOT invent selectors from visible text; produce a required-IDs table (proposed `kebab-case` IDs: `<context>-<element>[-btn]`) and tell the user (in Arabic) the UI team must add them first.
2. **Create the file** at `apps/<app>/pages/<Xxx>Page.ts`:
   ```typescript
   import { BasePage } from '../../../framework/core/base/BasePage';

   export class LoginPage extends BasePage {
     username()      { return this.components.textBox('login-username'); }
     password()      { return this.components.textBox('login-password'); }
     submitButton()  { return this.components.button('login-submit'); }

     async login(user: string, pass: string) {
       await this.username().fill(user);
       await this.password().fill(pass);
       await this.submitButton().click();
     }
   }
   ```
3. **Design rules:** expose intent methods returning components; never expose raw `Locator` in the public surface; no business logic here (flows belong in BaseFlow subclasses); a convenience composite method (like `login`) is fine when it maps 1:1 to user behavior.
4. **Verify:** `npm run typecheck` must pass before delivering.

## Failure handling
- If an element type has no matching ComponentFactory method, say so in Arabic, propose either a `create-component` skill run or an `Automation.byAttribute(...)` fallback, and wait for the user's choice. This applies to the component type only: a missing `data-automation-id` on an existing component type is handled by the fallback hierarchy, not by waiting.
- If a screen region is ambiguous (e.g. nested grids), ask one focused question in Arabic rather than guessing.
