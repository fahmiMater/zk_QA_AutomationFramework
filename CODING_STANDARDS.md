# Coding Standards

> **Purpose**
> 
> This document defines the coding standards for the ERP Automation Platform.
> 
> All source code must follow these standards to ensure consistency, readability, maintainability, and scalability.

---

# 1. General Principles

- Write code for humans before computers.
    
- Prefer readability over cleverness.
    
- Keep implementations simple.
    
- Avoid code duplication.
    
- Follow the Design Principles document.
    

---

# 2. Language Rules

|Item|Language|
|---|---|
|Class Names|English|
|Interfaces|English|
|Enums|English|
|Variables|English|
|Methods|English|
|Folder Names|English|
|File Names|English|
|Comments|Arabic|
|Documentation|Arabic|

---

# 3. Naming Conventions

## Classes

Use **PascalCase**

Example

```text
GridComponent

DialogComponent

EnvironmentManager
```

---

## Interfaces

Prefix with **I** is **not** used.

Correct

```text
Environment

GridFilter
```

Incorrect

```text
IEnvironment

IGridFilter
```

---

## Enums

Use PascalCase.

Example

```text
FilterOperator

SortDirection

SelectionMode
```

---

## Methods

Use camelCase.

Example

```text
getRowCount()

selectTab()

waitUntilLoaded()
```

---

## Variables

Use camelCase.

Example

```text
rowCount

activeTab

selectedRow
```

---

## Constants

Use UPPER_SNAKE_CASE only for true constants.

Example

```text
DEFAULT_TIMEOUT

MAX_RETRY_COUNT
```

---

# 4. File Naming

Every file must match the contained class.

Example

```text
GridComponent.ts

DialogComponent.ts

TabsComponent.ts
```

Never

```text
grid.ts

dialog.ts
```

---

# 5. Folder Naming

Folders use **kebab-case**.

Example

```text
chart-of-accounts

general-ledger

master-data
```

---

# 6. TypeScript Rules

## Strict Mode

Must always be enabled.

---

## Explicit Types

Avoid implicit typing in public APIs.

Correct

```typescript
getRowCount(): Promise<number>
```

---

## Never Use any

Forbidden

```typescript
any
```

Use proper interfaces instead.

---

## Prefer Interfaces

Example

```text
GridFilter

Environment

ExecutionContext
```

---

# 7. Class Design

Each class must have a single responsibility.

Correct

```text
GridComponent

Handles Grid only.
```

Incorrect

```text
GridComponent

Grid

Dialog

Business Logic

Assertions
```

---

# 8. Method Size

Methods should remain small.

Recommended

20–40 lines.

If significantly larger, consider extracting private methods.

---

# 9. Visibility

Always declare visibility explicitly.

Example

```typescript
public

protected

private
```

Never omit visibility modifiers.

---

# 10. Constructors

Constructors should only initialize dependencies.

Avoid business logic inside constructors.

---

# 11. Comments

Every public class must contain documentation.

Example

```typescript
/**
 * يمثل مكون الجدول.
 */
```

---

Every public method must contain documentation.

Example

```typescript
/**
 * الحصول على عدد الصفوف.
 */
```

---

Private methods only require comments when the logic is non-obvious.

---

# 12. Playwright Usage

Playwright should remain inside the framework.

Tests should not interact directly with:

- Locator
    
- CSS Selectors
    
- XPath
    

Preferred

```text
Test

↓

Flow

↓

Page

↓

Component

↓

Playwright
```

---

# 13. Waiting Strategy

Never use

```typescript
page.waitForTimeout()
```

except during debugging.

Always use

```text
WaitUtils
```

---

# 14. Selectors

Preferred order

1. data-automation-id
    
2. Accessibility attributes
    
3. Stable HTML attributes
    

Avoid

- Dynamic IDs
    
- CSS Classes
    
- nth-child
    

---

# 15. Assertions

Assertions should be centralized.

Preferred

```typescript
GridAssertions.rowCount(grid, 5);
```

Instead of scattering expect() throughout business code.

---

# 16. Components

Components represent reusable UI elements.

Examples

- Grid
    
- Dialog
    
- Tabs
    
- Toolbar
    
- Dropdown
    

Components must not contain business logic.

---

# 17. Pages

Pages represent ERP screens.

Pages compose Components.

Pages must not implement business workflows.

---

# 18. Flows

Flows implement business processes.

Example

```text
Create Customer

Approve Invoice

Create Journal Entry
```

Flows coordinate Pages.

---

# 19. Error Handling

Never silently ignore exceptions.

Provide meaningful error messages.

Example

```text
Grid row not found.

Expected tab was not found.

Dialog title is empty.
```

---

# 20. Documentation

Every completed feature must update:

- Component documentation
    
- ADR (if architecture changed)
    
- Roadmap
    
- Technical documentation
    

---

# 21. Validation Process

Every new feature follows the same lifecycle.

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
```

---

# 22. Code Review Checklist

Before merging any code:

-  Follows naming conventions.
    
-  Uses strict typing.
    
-  No any.
    
-  Public APIs documented.
    
-  Single Responsibility respected.
    
-  No duplicated code.
    
-  Uses WaitUtils.
    
-  Uses AutomationSelectors.
    
-  TypeScript compilation successful.
    
-  Documentation updated.
    
-  Proof Of Concept completed (when applicable).
    

---

# 23. Definition of Done

A task is considered complete only when:

- Architecture approved.
    
- Code implemented.
    
- Compilation successful.
    
- Proof Of Concept executed.
    
- Validated against the real ERP system.
    
- Documentation completed.
    
- Roadmap updated.
    

---

# Coding Philosophy

> Build a platform that hides implementation details, promotes reusable components, and enables engineers to automate business scenarios rather than interact directly with Playwright.