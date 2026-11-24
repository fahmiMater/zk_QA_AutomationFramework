# Contributing Guide

> Thank you for contributing to the ERP Automation Platform.
>
> This document describes the development workflow, contribution process, and quality expectations for all contributors.

---

# Project Philosophy

The ERP Automation Platform is built as an engineering product rather than a collection of automation scripts.

Every contribution should improve one or more of the following:

* Maintainability
* Reusability
* Scalability
* Developer Experience
* Platform Quality

---

# Before You Start

Every contributor should read the following documents before writing any code.

Required reading:

* VISION.md
* ARCHITECTURE.md
* DESIGN_PRINCIPLES.md
* CODING_STANDARDS.md
* ROADMAP.md

If the contribution affects architecture:

* Read all relevant ADRs.
* Read all related RFCs.

---

# Development Workflow

Every feature follows the same lifecycle.

```text
Issue
    ↓
RFC (if required)
    ↓
Architecture Review
    ↓
ADR (if required)
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

Do not skip any stage.

---

# Creating a New Feature

Before implementation ask the following questions.

## Question 1

Is this a bug fix?

or

Is this a new feature?

---

## Question 2

Does it require an architectural decision?

If yes

Create an ADR.

---

## Question 3

Does it introduce a new public API?

If yes

Create an RFC before implementation.

---

# Creating a New Component

Every reusable UI component must follow this process.

1. Design API.
2. Architecture Review.
3. Implementation.
4. TypeScript Compilation.
5. Proof Of Concept.
6. Validation against the real ERP.
7. Documentation.

A component is **not** considered complete until validation is finished.

---

# Modifying Existing Components

When modifying an existing component:

* Preserve backward compatibility whenever possible.
* Avoid breaking public APIs.
* Update component documentation.
* Update ADR or RFC if required.

---

# Documentation Requirements

Documentation is part of development.

Every completed feature should update the appropriate documentation.

Possible documents include:

* Component Documentation
* ADR
* RFC
* Roadmap
* Architecture
* Coding Standards

---

# Coding Rules

All code must comply with:

CODING_STANDARDS.md

Do not introduce local coding styles.

---

# Architecture Rules

Architecture decisions must follow:

DESIGN_PRINCIPLES.md

Do not bypass framework layers.

---

# Component Responsibilities

Components represent reusable UI elements.

Examples:

* Grid
* Dialog
* Tabs
* Toolbar
* Dropdown

Components must not contain:

* Business Logic
* Business Validation
* Business Workflows

---

# Pages

Pages represent ERP screens.

Pages compose reusable components.

Pages must not implement business processes.

---

# Flows

Flows represent business workflows.

Flows coordinate multiple pages.

Flows should never communicate directly with Playwright.

---

# Playwright Usage

Playwright is considered an implementation detail.

Only framework infrastructure and reusable components may interact directly with Playwright.

Business code must never access:

* Locator
* Page
* Browser
* CSS Selectors
* XPath

---

# Validation

Every reusable component must be validated against the real ERP system.

Compilation success is not sufficient.

Required:

* Proof Of Concept
* Real ERP Validation

---

# Pull Request Checklist

Before submitting a contribution verify the following.

* [ ] Architecture reviewed.
* [ ] Coding Standards followed.
* [ ] No duplicated code.
* [ ] No `any` type.
* [ ] No hard waits.
* [ ] Public APIs documented.
* [ ] TypeScript compilation successful.
* [ ] Proof Of Concept completed.
* [ ] Real ERP validation completed.
* [ ] Documentation updated.
* [ ] ADR updated (if required).
* [ ] RFC updated (if required).
* [ ] Roadmap updated.

---

# Definition of Done

A contribution is considered complete only when all of the following are satisfied.

* Architecture approved.
* Implementation completed.
* Compilation successful.
* Proof Of Concept executed.
* Validated against the real ERP.
* Documentation updated.
* Quality review completed.

---

# Project Structure

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

Contributors should respect this dependency direction.

Reverse dependencies are not allowed.

---

# Public API

The public SDK should expose business concepts rather than implementation details.

Preferred:

```typescript
await permissionsPage.operationsGrid.filter(...);
```

Avoid:

```typescript
await page.locator(...).click();
```

---

# Long-Term Vision

Every contribution should move the platform closer to the following goals.

* Business-oriented SDK.
* Metadata-driven automation.
* Stable public API.
* Enterprise scalability.
* Reusable architecture.
* Excellent developer experience.

---

# Remember

> We are not building Playwright tests.

> We are building an Enterprise ERP Automation Platform.
