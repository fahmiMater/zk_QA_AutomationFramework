# RFC-001

# ComponentFactory Design

Status: Draft

Author: QA Automation Team

Phase: Phase 2

---

# Background

The framework currently creates components directly.

Example:

```typescript
const grid = new GridComponent(
    page,
    locator
);
```

Although this approach works, it exposes implementation details to framework users.

The framework should provide a higher level abstraction.

---

# Problem

Every test currently needs to know:

- Which component to instantiate
    
- Which locator to use
    
- How to build the locator
    

This leads to duplicated code and unnecessary coupling.

---

# Goal

Provide a centralized factory responsible for creating framework components.

Framework users should never instantiate components directly.

---

# Proposed API

## Current

```typescript
const grid = new GridComponent(
    page,
    locator
);
```

---

## Proposed

```typescript
const grid =
    ComponentFactory.grid(
        page,
        "permissions"
    );
```

---

## Dialog

```typescript
const dialog =
    ComponentFactory.dialog(
        page,
        "add-user"
    );
```

---

## Tabs

```typescript
const tabs =
    ComponentFactory.tabs(
        page,
        "permissions"
    );
```

---

# Responsibilities

ComponentFactory is responsible for:

- Creating components.
    
- Building locators.
    
- Applying AutomationSelectors.
    
- Returning ready-to-use components.
    

---

# Responsibilities NOT Included

ComponentFactory must NOT:

- Execute business logic.
    
- Cache components.
    
- Store application state.
    
- Perform assertions.
    

---

# Dependencies

ComponentFactory depends on:

- AutomationSelectors
    
- Playwright Page
    
- Component Constructors
    

---

# Expected Benefits

- Cleaner tests.
    
- Reduced duplication.
    
- Centralized component creation.
    
- Easier maintenance.
    
- Better developer experience.
    

---

# Future Extensions

Possible future capabilities:

- Component caching.
    
- Lazy initialization.
    
- Logging.
    
- Performance metrics.
    
- Component lifecycle hooks.
    

---

# Risks

Changing ComponentFactory API later would affect:

- Pages
    
- Flows
    
- Tests
    

Therefore the API should remain small and stable.

---

# Open Questions

Should ComponentFactory:

A)

Return a new instance every call?

or

B)

Reuse previously created instances?

Current recommendation:

Option A.

Reason:

Components should remain lightweight and stateless.

---

# Decision

Pending Review