---
name: write-api-test
description: Writes API tests using the framework's SOM layer (BaseApiService/ApiClient) with Zod contract validation, multi-role auth, and mandatory negative/permission coverage. Use when the user asks to test an endpoint or API service.
---

# Write an API Test

## Output language (mandatory)
- All prose for the user MUST be in Arabic (RTL). Keep code, identifiers, paths, CLI commands and technical terms in English.

## Two patterns (choose deliberately)

### Pattern 1 — SOM service (preferred for real contracts)
Extend `framework/core/api/BaseApiService.ts` which provides `get/post/put/delete(endpoint, options?, schema?)` with:
- `ApiRequestOptions { headers?, params?, data?, role?, strictMode? }` — `role` injects the JWT of that role via `AuthTokenManager`.
- Optional Zod schema → response body validated automatically by `framework/core/api/ApiResponseValidator.ts`.
- `strictMode: true` throws on any non-OK response.

```typescript
import { z } from 'zod';
import { BaseApiService } from '../../framework/core/api/BaseApiService';

const ItemSchema = z.object({ id: z.number(), name: z.string() });

export class ItemsApiService extends BaseApiService {
  getItem(id: number) {
    return this.get(`/items/${id}`, { role: 'ADMIN' }, ItemSchema);
  }
}
```

### Pattern 2 — direct client (for fast seeding/background calls)
Use `framework/core/api/ApiClient.ts`: `init()`, `login(username, role, password)`, then direct calls. Passwords MUST come from `.env` (see `.env.example`) — never hardcode. Tokens are managed by `framework/core/api/AuthTokenManager.ts` (`getInstance/getToken/setToken/clearTokens/hasToken`).

## Mandatory coverage per endpoint
1. Happy path (200/201) with Zod schema validation.
2. Validation failure (400) with an invalid payload.
3. Permission check: an unauthorized role expects 403 — pass `{ role: '<unauthorized-role>' }`.
4. Contract integrity: every response validated against its schema.

## Steps
1. Create `apps/<app>/api/<X>ApiService.ts` + Zod schemas in the same file or `<X>Schemas.ts`.
2. Create `apps/<app>/tests/<feature>-api.spec.ts` (the `-api.spec.ts` suffix maps to the api project in `playwright.config.ts`).
3. Verify: `npm run typecheck && npx playwright test <file> --list`.

## Critical trap — offline mock fallback
When `strictMode` is false (default in `ApiClient`), connection errors (`ECONNREFUSED`) return a synthetic mock response with status 200/201. When the intent is testing a REAL backend, always pass `{ strictMode: true }`. State this explicitly in your Arabic summary so the team knows whether results came from a live system.

## Failure handling
- If the OpenAPI/Swagger contract is available, derive the Zod schema from it — do not guess field types.
- If role accounts are not provisioned in `.env`, list exactly which env vars are missing in Arabic and stop before generating tests that cannot authenticate.
