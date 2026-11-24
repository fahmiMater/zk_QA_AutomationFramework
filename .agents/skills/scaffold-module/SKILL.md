---
name: scaffold-module
description: Scaffolds a complete new application module (pages/api/flows/data/tests) inside this Playwright + TypeScript framework and wires it into playwright.config.ts and tsconfig.json. Use when the team starts automating a new application or business module.
---

# Scaffold a New Application Module

## Output language (mandatory)
- All prose you write for the user MUST be in Arabic (RTL).
- Keep code, identifiers, file paths, CLI commands, and technical terms in English exactly as they appear.
- Code blocks stay fully in English; do not translate code.

## When to use
The user asks to start automating a new app/module (e.g. "نبدأ اختبارات وحدة المخازن").

## Steps

1. **Create the folder structure** under `apps/<app-kebab-case>/`:
   ```
   apps/<app>/
   ├── pages/        # XxxPage.ts — extends framework/core/base/BasePage.ts
   ├── api/          # XxxApiService.ts — extends framework/core/api/BaseApiService.ts + Zod schemas
   ├── flows/        # XxxFlow.ts — extends framework/core/base/BaseFlow.ts
   ├── data/         # JSON files for data-driven tests
   └── tests/        # <feature>.spec.ts and <feature>-api.spec.ts
   ```
2. **Register a Playwright project** in `playwright.config.ts` (copy the commented template inside it):
   ```typescript
   {
     name: '<app>',
     testDir: './apps/<app>/tests',
     use: { browserName: 'chromium', headless: true, trace: 'retain-on-failure' }
   }
   ```
3. **Add API project** only if the module has API tests: a separate project with `testMatch: /.*-api\.spec\.ts$/` and `use: { baseURL: process.env.API_BASE_URL }`.
4. **Update `tsconfig.json`**: ensure `"include"` contains `"apps/**/*.ts"`.
5. **Verify**: run `npm run typecheck` and `npx playwright test --list`. Both must pass before reporting success.

## Hard rules
- Selectors via `data-automation-id` only — see docs/standards/LOCATOR_STRATEGY.md.
- Naming per docs/standards/NAMING_CONVENTION.md (`XxxPage.ts`, `XxxApiService.ts`, `<feature>.spec.ts`).
- Never write application code inside `framework/`.

## Failure handling
- If `npm run typecheck` fails, fix the generated files before reporting; do not hand over a broken scaffold.
- If the app folder name is unclear or not kebab-case, propose one and confirm with the user in Arabic.
