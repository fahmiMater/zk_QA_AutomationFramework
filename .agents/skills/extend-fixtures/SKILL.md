---
name: extend-fixtures
description: Adds a new custom Playwright fixture (auth session, database connection, seeded data) to the framework's test.ts following the existing NetworkManager pattern. Use when the user says "أضف fixture" or asks for a shared per-test service.
---

# Extend Framework Fixtures

## Output language (mandatory)
- All prose for the user MUST be in Arabic (RTL). Keep code, identifiers, paths, commands and technical terms in English.

## The pattern to follow
Read `framework/core/fixtures/test.ts` first. The existing `network` fixture defines the convention:
1. Extend `baseTest` with a typed `ExecutionContextFixtures` map.
2. Instantiate the manager inside an `async ({ page }, use)` factory.
3. Hand it to the test with `await use(manager)`.
4. Clean up after `use(...)` (see the `interceptor.clearAllInterceptors()` call).
5. Re-export `expect` so spec files keep importing from this single module.

## Steps (example: an `auth` fixture)
1. Implement the manager class in its own folder (e.g. `framework/core/auth/`) — the fixture file only wires it.
2. In `framework/core/fixtures/test.ts`:
   ```typescript
   export type ExecutionContextFixtures = {
     network: NetworkManager;
     auth: AuthManager;            // new
   };

   export const test = baseTest.extend<ExecutionContextFixtures>({
     network: async ({ page }, use) => { /* unchanged */ },
     auth: async ({ page }, use) => {
       const auth = new AuthManager(page);
       await use(auth);
       // cleanup if needed
     },
   });
   ```
3. Update the `ExecutionContextFixtures` type AND the object literal together — a mismatch fails `npm run typecheck`.
4. Spec files get the fixture automatically as a test argument — no import changes needed on their side.
5. Verify: `npm run typecheck && npm test` (framework tests include fixture coverage under `tests/framework/`).

## Hard rules
- Only this skill may modify `framework/core/fixtures/test.ts`.
- Fixtures must be test-scoped and side-effect-free after `use()` completes.
- No global mutable singletons except existing framework managers (like `AuthTokenManager`).

## Failure handling
- If two fixtures need ordering (e.g. `auth` before `network`), express dependencies via fixture arguments (`async ({ page, network }, use)`) — never via sleeps or module-level state.
