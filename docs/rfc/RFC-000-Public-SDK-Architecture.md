# RFC-000

# Public SDK Architecture

Status: Draft

Author: QA Automation Team

Phase: Phase 2

---

# Background

The framework has successfully completed its foundational phase.

Core infrastructure, reusable components, architectural principles, and documentation have been established.

The next phase focuses on improving the developer experience by exposing a clean, expressive, and stable public SDK.

---

# Problem Statement

Today framework users still interact with low-level concepts.

Example:

```typescript
new GridComponent(page, locator);
```

Although functional, this exposes framework implementation details.

Framework consumers should not know:

* Component constructors
* Locator creation
* Automation selectors
* Playwright implementation

---

# Objective

Design a public SDK that represents business concepts rather than technical implementation.

---

# Design Goals

The SDK must be:

* Simple
* Discoverable
* Type-safe
* Stable
* Expressive
* Metadata-aware

---

# Guiding Principle

Framework users should think in terms of:

Business

instead of

UI implementation.

---

# Current Architecture

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

# Desired User Experience

Instead of

```typescript
new GridComponent(...)
```

the engineer should write

```typescript
ERP
    .finance()
    .permissions()
```

or

```typescript
permissionsPage
    .operationsGrid
```

The SDK should hide all implementation details.

---

# Public API Principles

The public API should never expose:

* Locator
* CSS Selector
* XPath
* Playwright constructors

The public API may expose:

* Business Pages
* Business Components
* Business Flows

---

# Layer Responsibilities

## Core

Infrastructure.

Hidden from SDK consumers.

---

## Components

Reusable UI building blocks.

---

## Pages

Represent ERP screens.

---

## Flows

Represent business processes.

---

## Tests

Express business scenarios.

---

# API Evolution Strategy

Public API should remain stable.

Internal implementation may evolve without affecting users.

---

# Design Rules

Every new feature should answer:

Does this belong to:

Core?

Component?

Page?

Flow?

SDK?

---

# Future Architecture

```text
ERP SDK

│

├── Finance

├── HR

├── Inventory

├── Sales

└── Purchasing

        │

        ▼

Business Pages

        │

        ▼

Components

        │

        ▼

Core Framework

        │

        ▼

Playwright
```

---

# Example

```typescript
const permissions =
    ERP
        .finance()
        .permissions();

await permissions
    .operationsGrid
    .filter(...);

await permissions
    .operationsGrid
    .openRow(0);

await permissions
    .detailsDialog
    .close();
```

The test contains no:

* Locator
* CSS
* XPath
* Playwright

---

# Non Goals

The SDK will not expose:

* HTML implementation
* PrimeNG
* Angular
* Automation selectors

---

# Success Criteria

Framework users can automate business scenarios without understanding the underlying UI technology.

---

# Decision

Pending Review
