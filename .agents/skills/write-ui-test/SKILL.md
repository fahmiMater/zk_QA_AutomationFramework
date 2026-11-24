---
name: write-ui-test
description: Writes UI tests following this framework's exact conventions (framework fixtures, Page Objects, semantic IDs, WaitUtils). Use when the user asks to write or add a UI test/senario.
---

# Write a UI Test

## Output language (mandatory)
- All prose for the user MUST be in Arabic (RTL). Keep code, identifiers, paths, CLI commands and technical terms in English.

## Mandatory imports
Always import from the framework fixtures, never directly from `@playwright/test`:
```typescript
import { test, expect } from '../../framework/core/fixtures/test';
```
This gives access to the custom `network` fixture (`framework/core/network/NetworkManager.ts`).

## Steps
1. **Page Object first.** If none exists for the target screen, generate one with the `generate-page-object` skill. Never call `page.locator()` inside a spec.
2. **Write the spec** in `apps/<app>/tests/<feature>.spec.ts`:
   ```typescript
   import { test, expect } from '../../framework/core/fixtures/test';
   import { LoginPage } from '../pages/LoginPage';

   test.describe('Login', () => {
     test('successful login with valid credentials', async ({ page }) => {
       const loginPage = new LoginPage(page);
       await loginPage.login('user', 'pass');
       // assertions...
     });
   });
   ```
   Live reference template: `tests/example.spec.ts` (it runs and passes).
3. **Waiting:** use `framework/core/waits/WaitUtils.ts` static helpers (`waitForPageReady`, `waitUntilVisible`, `waitUntilHidden`, `waitForEnabled`, `waitForText`). `waitForTimeout` is FORBIDDEN (see docs/adr/ADR-008 No Hard Wait Policy.md).
4. **Selectors:** `data-automation-id` only. No visible text, no CSS classes, no XPath (docs/standards/LOCATOR_STRATEGY.md).
5. **Verify:** `npm run typecheck` then `npx playwright test <file> --list`. If a live backend exists run the test itself.

## Test structure convention
Order steps as: Arrange (navigate/seed) → Act (interact via Page Object) → Assert (framework `expect`). One behavior per test; test titles describe the behavior.

## Failure handling
- Missing automation IDs on the target screen? Do not invent selectors from text — list the required IDs as a table and ask the UI team to add them.
- If the test cannot run locally (no backend), still deliver it and state clearly in Arabic that it is unexecuted against a live system.
