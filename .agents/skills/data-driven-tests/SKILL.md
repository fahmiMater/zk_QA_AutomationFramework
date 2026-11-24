---
name: data-driven-tests
description: Converts repetitive test scenarios into data-driven tests using the framework's JsonTestDataProvider, so new scenarios need only a JSON edit. Use when the user has many similar scenarios for one screen or endpoint.
---

# Data-Driven Tests with JSON

## Output language (mandatory)
- All prose for the user MUST be in Arabic (RTL). Keep code, identifiers, paths, CLI commands and technical terms in English.

## Core component
`framework/core/data/providers/JsonTestDataProvider.ts`:
```typescript
constructor(relativeOrAbsolutePath: string)
public async loadAll<T>(): Promise<T[]>
```

## Steps
1. **Define a TypeScript model** for the scenario in `apps/<app>/models/`:
   ```typescript
   export interface LoginTestCase {
     name: string;
     username: string;
     password: string;
     expectSuccess: boolean;
   }
   ```
2. **Create the JSON dataset** in `apps/<app>/data/<feature>.json` — an array of scenario objects.
3. **Load and generate tests** in the spec:
   ```typescript
   const provider = new JsonTestDataProvider('apps/<app>/data/login');
   const cases = await provider.loadAll<LoginTestCase>();

   for (const tc of cases) {
     test(tc.name, async ({ page }) => {
       // act + assert driven by tc fields
     });
   }
   ```
4. **Naming:** dataset files follow `<feature>.data.json` style per docs/standards/NAMING_CONVENTION.md.
5. **Verify:** `npm run typecheck && npx playwright test --list` — each JSON entry must appear as a test.

## Hard rules
- Test data is language-neutral in JSON; test titles may be Arabic (they appear in reports).
- Do not put secrets (real passwords) inside committed JSON — use placeholders resolved from `.env` at runtime.

## Failure handling
- Malformed JSON: fail fast with the file path in the Arabic message, and show the exact JSON syntax error.
- If scenarios diverge structurally (different fields), propose splitting into two datasets instead of one mega-schema.
