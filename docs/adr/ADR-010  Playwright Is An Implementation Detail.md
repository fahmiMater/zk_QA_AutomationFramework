# ADR-010

# Playwright Is An Implementation Detail

**Status:** Accepted

**Date:** 2026-06

**Decision Makers:** QA Automation Team

---

# Context

The ERP Automation Platform is designed as a long-term engineering platform rather than a Playwright-specific automation framework.

Although Playwright is currently selected as the automation engine, it is not considered part of the platform's public architecture.

Business automation should remain independent from any specific UI automation technology.

---

# Problem

Many automation frameworks tightly couple business logic with the underlying automation engine.

Example:

```typescript
await page.locator('#save').click();
```

In this approach:

* Tests know Playwright.
* Pages know Playwright.
* Business workflows know Playwright.

Replacing the automation engine becomes expensive because Playwright concepts are spread across the entire codebase.

---

# Decision

Playwright shall be treated as an internal implementation detail.

It is considered the execution engine of the platform rather than part of the platform architecture.

Business-level code must never depend directly on Playwright APIs.

---

# Architectural Layers

```text
Business Tests
        │
        ▼
Business Flows
        │
        ▼
Business Pages
        │
        ▼
UI Components
        │
        ▼
Core Framework
        │
        ▼
Playwright Engine
```

Only the Core Framework and reusable UI Components are allowed to communicate directly with Playwright.

---

# Allowed Dependencies

```text
Tests
    ↓
Flows
    ↓
Pages
    ↓
Components
    ↓
Core
    ↓
Playwright
```

---

# Forbidden Dependencies

Business code must never directly access:

* Playwright Page
* Playwright Locator
* BrowserContext
* Browser
* CSS Selectors
* XPath

Example (Forbidden)

```typescript
await page.locator('.btn-save').click();
```

Example (Preferred)

```typescript
await customerPage.save();
```

---

# Rationale

This decision provides several long-term benefits.

## Engine Independence

The business layer remains independent of the automation engine.

If the organization decides to migrate from Playwright to another automation engine in the future, only the infrastructure layer should require modification.

---

## Stable Public API

Framework users interact with business concepts rather than Playwright APIs.

Example

```typescript
await permissionsPage
    .operationsGrid
    .filter(...);
```

instead of

```typescript
await page
    .locator(...)
    .click();
```

---

## Better Developer Experience

Automation engineers should think about:

* Business Pages
* Business Components
* Business Flows

instead of:

* Locators
* CSS
* DOM
* Browser APIs

---

## Maintainability

The implementation of Playwright may evolve over time without affecting:

* Tests
* Pages
* Flows
* Public SDK

---

# Consequences

## Positive

* Clear separation of concerns.
* Stable public SDK.
* Easier maintenance.
* Better abstraction.
* Easier onboarding for new engineers.
* Future engine replacement becomes feasible.

---

## Negative

* Additional abstraction layer.
* More framework code.
* Slightly higher initial development effort.

These costs are acceptable because they significantly improve long-term maintainability.

---

# Design Rules

The following rules apply to all future development.

## Rule 1

Tests must never use Playwright directly.

---

## Rule 2

Flows communicate only with Pages.

---

## Rule 3

Pages communicate only with Components.

---

## Rule 4

Components may communicate with Playwright.

---

## Rule 5

Core Infrastructure owns all Playwright-specific implementation.

---

# Future Vision

The public API should eventually resemble the following.

```typescript
const permissions =
    ERP
        .finance()
        .generalLedger()
        .permissions();

await permissions
    .operationsGrid
    .filter({
        column: 'المعرف',
        operator: FilterOperator.Equals,
        value: '1399'
    });

await permissions
    .detailsDialog
    .close();
```

Notice that the business code contains no direct reference to:

* Playwright
* Locator
* CSS
* DOM
* Browser APIs

---

# Alternatives Considered

## Alternative A

Expose Playwright directly throughout the framework.

**Rejected**

Reason:

Creates strong coupling between business automation and the underlying automation engine.

---

## Alternative B

Expose Playwright only through reusable framework layers.

**Accepted**

Reason:

Provides a clean separation between business automation and implementation details while preserving flexibility for future evolution.

---

# References

* ADR-004 — Environment Management Strategy
* ADR-008 — No Hard Wait Policy
* RFC-000 — Public SDK Architecture
* DESIGN_PRINCIPLES.md
* ARCHITECTURE.md
