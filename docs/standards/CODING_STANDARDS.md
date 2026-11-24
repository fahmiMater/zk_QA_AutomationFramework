# Coding Standards

## Purpose

This document defines coding standards for the QA Automation Platform.

All contributors must follow these standards.

---

# Language

Use TypeScript only.

Forbidden:

```javascript
const page = browser.newPage();
```

Required:

```typescript
const page: Page = await browser.newPage();
```

---

# Naming Conventions

## Classes

Use PascalCase.

Examples:

```typescript
ChartOfAccountsPage
JournalEntryFlow
GridComponent
EnvironmentManager
```

---

## Methods

Use camelCase.

Examples:

```typescript
createAccount()
postJournalEntry()
approveVoucher()
```

---

## Variables

Use camelCase.

Examples:

```typescript
accountCode
journalNumber
voucherStatus
```

---

## Constants

Use UPPER_SNAKE_CASE.

Examples:

```typescript
DEFAULT_TIMEOUT
MAX_RETRY_COUNT
```

---

# File Naming

Use PascalCase for framework classes.

Examples:

```text
BasePage.ts
BaseFlow.ts
GridComponent.ts
LoginPage.ts
```

Use kebab-case for test files.

Examples:

```text
chart-of-accounts.create-account.spec.ts
journal-entries.post-entry.spec.ts
```

---

# Method Rules

Methods should perform one action only.

Good:

```typescript
enterAccountCode()
clickSave()
approveVoucher()
```

Bad:

```typescript
createApproveAndPostVoucher()
```

Business orchestration belongs in Flows.

---

# Assertions

Assertions belong only in:

```text
Tests
```

Forbidden inside:

```text
Pages
Components
Flows
```

---

# Logging

All important business actions should be logged.

Example:

```typescript
Logger.info('Creating account');
Logger.info('Posting journal entry');
```

---

# Error Handling

Never ignore errors.

Forbidden:

```typescript
try {
}
catch {
}
```

Required:

```typescript
catch(error) {
   Logger.error(error);
   throw error;
}
```

---

# Imports

Prefer absolute imports.

Avoid deep relative paths.

---

# Code Duplication

If logic appears more than once:

Refactor it.

Move it to:

```text
utils/
components/
core/
```

---

# Test Readability

Tests should read like business scenarios.

Example:

```typescript
await accountFlow.createAccount(accountData);

await accountFlow.approveAccount(accountCode);

await accountFlow.verifyAccountExists(accountCode);
```

---

# Review Checklist

Before merge:

- Naming convention verified
    
- No duplicated code
    
- No hardcoded values
    
- No locators in tests
    
- No business logic in pages
    
- Test ID present
    
- Build passes