# Design Principles

> **Purpose**
>
> This document defines the engineering principles that govern the design, implementation, and evolution of the QA Automation ERP Framework.
>
> Every contribution to the framework should comply with these principles to ensure consistency, maintainability, scalability, and long-term sustainability.

---

# Principle 1 — Architecture First

## Description

No implementation should begin before agreeing on the architecture and API design.

## Rationale

Architecture is significantly more expensive to change than implementation.

## Rules

* Design before coding.
* Review APIs before implementation.
* Record architectural decisions using ADRs.

---

# Principle 2 — Validation Before Adoption

## Description

A component is **not considered complete** until it has been validated against the real ERP system.

## Workflow

```text
Design
    ↓
Implementation
    ↓
Compilation
    ↓
Proof Of Concept
    ↓
Validation
    ↓
Documentation
```

## Rules

Compile success alone is **not** considered completion.

---

# Principle 3 — Single Responsibility

## Description

Each class must have one clear responsibility.

## Examples

### Correct

```text
GridComponent
    ↓
Grid operations only
```

### Incorrect

```text
GridComponent

✓ Grid
✓ Dialog
✓ Search
✓ Business Logic
✓ Validation
```

---

# Principle 4 — UI Agnostic

## Description

Framework components should avoid depending on UI implementation details whenever possible.

## Avoid

* Angular generated identifiers
* PrimeNG internal CSS classes
* Dynamic HTML structures

## Prefer

Stable automation attributes.

Example:

```html
data-automation-id="save-button"
```

---

# Principle 5 — Stable Selectors Only

## Description

Selectors must remain stable across UI updates.

## Preferred Priority

1. data-automation-id
2. Accessibility attributes
3. Stable HTML attributes
4. Text (when appropriate)

## Avoid

* Dynamic IDs
* nth-child
* Generated CSS classes

---

# Principle 6 — No Hard Waits

## Description

The framework must never depend on arbitrary delays.

## Forbidden

```typescript
page.waitForTimeout(3000);
```

## Preferred

```typescript
WaitUtils.waitForVisible(locator);
```

or

```typescript
WaitUtils.waitForPageReady(page);
```

---

# Principle 7 — Components Before Pages

## Description

Reusable UI components must be built before application pages.

## Dependency

```text
Components
      ↓
Pages
      ↓
Flows
      ↓
Tests
```

---

# Principle 8 — Pages Before Flows

## Description

Business flows must never access Playwright directly.

Flows communicate only with Page Objects.

## Correct

```text
Flow
    ↓
Page
    ↓
Component
```

## Incorrect

```text
Flow
    ↓
Locator
```

---

# Principle 9 — Component Isolation

## Description

Every component must operate inside its own Root Locator.

## Example

```typescript
new GridComponent(
    page,
    rootLocator
);
```

## Benefits

* Multiple grids per page
* Nested components
* Dialog support
* Better reusability

---

# Principle 10 — Centralized Selectors

## Description

Selectors must be generated from a single centralized location.

## Current Implementation

```text
AutomationSelectors
```

Components must never build selectors directly.

---

# Principle 11 — Shared Infrastructure

## Description

Shared functionality must exist in one place only.

## Example

Waiting logic:

```text
WaitUtils
```

Logging:

```text
Logger
```

Configuration:

```text
Configuration
```

Avoid duplicating common logic across multiple components.

---

# Principle 12 — Business Logic Separation

## Description

Business rules must never exist inside Components.

## Responsibilities

### Components

* UI interaction
* Reading UI state

### Pages

* Business page abstraction

### Flows

* Business workflows

---

# Principle 13 — Documentation Is Part of Development

## Description

A task is not considered complete until its documentation has been updated.

## Required Updates

* ADR (if architecture changed)
* Component documentation
* Roadmap
* Technical documentation

---

# Principle 14 — Incremental Evolution

## Description

Components evolve through controlled versions.

## Example

```text
GridComponent

V1
    ↓
Read Grid

V2
    ↓
Filtering

V3
    ↓
Pagination

V4
    ↓
Tree Grid
```

Avoid implementing every possible feature in the first version.

---

# Principle 15 — Metadata Driven Automation

## Description

The framework is designed to work seamlessly with Metadata Driven UI platforms.

Automation should rely on metadata rather than visual appearance.

## Preferred

```html
data-automation-id
```

instead of

```text
Displayed Text

CSS Classes

Generated IDs
```

---

# Principle 16 — Platform Over Framework

## Vision

The goal is not to build a Playwright framework.

The goal is to build a reusable **ERP Automation Platform**.

## Desired Abstraction

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

Playwright should remain hidden from business-level automation.

---

# Development Lifecycle

```text
Requirement
      ↓
Architecture
      ↓
ADR
      ↓
API Design
      ↓
Implementation
      ↓
Compilation
      ↓
Proof Of Concept
      ↓
Validation
      ↓
Documentation
      ↓
Release
```

---

# Quality Checklist

Before marking any work as complete, verify the following:

* [ ] Architecture reviewed.
* [ ] API approved.
* [ ] TypeScript compilation successful.
* [ ] Proof Of Concept completed.
* [ ] Validated against the real ERP system.
* [ ] Documentation updated.
* [ ] ADR updated (if required).
* [ ] Roadmap updated.

---

# Framework Vision

Build a scalable, maintainable, metadata-aware ERP Automation Platform that enables engineers to automate business processes without dealing directly with Playwright, DOM structures, or unstable UI implementation details.
