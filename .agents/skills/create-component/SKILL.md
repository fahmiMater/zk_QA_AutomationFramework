---
name: create-component
description: Creates a new reusable UI component inside framework/components following BaseComponent conventions and registers it in ComponentFactory. Use when a screen element has no existing framework component.
---

# Create a New Framework Component

## Output language (mandatory)
- All prose for the user MUST be in Arabic (RTL). Keep code, identifiers, file paths, CLI commands and technical terms in English.

## Before writing — read these (they define the pattern)
1. `framework/core/base/BaseComponent.ts` — the contract every component inherits: `getLocator()`, `getSelector()`, `exists()`, `isVisible()`, `isHidden()`, `isEnabled()`, `isDisabled()`, plus the internal `execute(...)` wrapper that centralizes error handling and waits.
2. A simple reference: `framework/components/button/ButtonComponent.ts`.
3. Registration target: `framework/core/factory/ComponentFactory.ts`.
4. Selector rule: build via `framework/core/automation/Automation.ts` (`Automation.byId(...)` → `[data-automation-id="..."]`). Component files must NOT import Playwright directly; they receive `Page`/`Locator` from the base layer (see docs/adr/ADR-010 — "Playwright is an implementation detail").

## Steps
1. Create `framework/components/<name>/<Name>Component.ts` extending `BaseComponent`, exposing domain verbs (e.g. `select()`, `toggle()`) — never generic `click(anything)`.
2. Add assertions class `<Name>Assertions.ts` if the component needs verifications (pattern: `TextBoxComponent.assert()` returning `TextBoxAssertions`).
3. Register in `ComponentFactory`: `public <name>(automationId: string) { return new <Name>Component(this.page, Automation.byId(automationId)); }`.
4. If an `index.ts` exists in the component folder (see `framework/components/grid/index.ts`), export from it too.
5. Add a minimal framework unit test under `tests/framework/components/<name>/` following the existing component specs pattern.
6. Verify: `npm run typecheck && npm test` — framework tests must pass.

## Hard rules
- This is the ONLY skill allowed to write inside `framework/`.
- No hard waits, no visible-text selectors, no XPath — docs/standards/FRAMEWORK_RULES.md applies.

## Failure handling
- If the target element's DOM behavior is unknown (is it a native `<select>` or a JS-rendered dropdown?), ask in Arabic for sample HTML before implementing.
