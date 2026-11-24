# QA Automation Naming Convention

## Purpose

This document defines the naming standards for all automation assets within the QA Automation Repository.

The objective is to ensure consistency, traceability, maintainability, and scalability across all systems and testing teams.

---

# Repository Structure

```text
apps/
 └── erp/
      └── finance/
           └── general-ledger/
```

Folder names must use:

- lowercase
    
- hyphen-separated words
    

Examples:

```text
chart-of-accounts
journal-entries
fiscal-periods
cost-centers
```

Do NOT use:

```text
ChartOfAccounts
chartOfAccounts
Chart_Of_Accounts
```

---

# Test File Naming

Format:

```text
<feature>.<scenario>.spec.ts
```

Examples:

```text
chart-of-accounts.create-account.spec.ts

chart-of-accounts.edit-account.spec.ts

chart-of-accounts.delete-account.spec.ts

journal-entries.post-entry.spec.ts

journal-entries.reverse-entry.spec.ts
```

Avoid:

```text
test.spec.ts
new-test.spec.ts
test1.spec.ts
```

---

# Test Case Identifier

Every automated test must have a unique identifier.

Format:

```text
<SYSTEM>-<DOMAIN>-<MODULE>-<FEATURE>-<NUMBER>
```

Example:

```text
ERP-FIN-GL-COA-001
ERP-FIN-GL-COA-002
ERP-FIN-GL-JE-001
ERP-FIN-GL-JE-002
```

Definitions:

|Code|Meaning|
|---|---|
|ERP|System|
|FIN|Finance|
|GL|General Ledger|
|COA|Chart Of Accounts|
|JE|Journal Entries|

---

# Test Titles

Format:

```typescript
[TEST-ID] Business Description
```

Example:

```typescript
test(
  '[ERP-FIN-GL-COA-001] Create account successfully',
  async ({ page }) => {

  }
);
```

Avoid:

```typescript
test('Account Test', async () => {

});
```

---

# Page Object Naming

Format:

```text
<Feature>Page.ts
```

Examples:

```text
ChartOfAccountsPage.ts

JournalEntriesPage.ts

LoginPage.ts
```

---

# Component Naming

Format:

```text
<Component>Name.ts
```

Examples:

```text
GridComponent.ts

LookupComponent.ts

DialogComponent.ts

SidebarComponent.ts
```

---

# Test Data Naming

Format:

```text
<feature>.data.json
```

Examples:

```text
chart-of-accounts.data.json

journal-entries.data.json
```

---

# Environment Files

Format:

```text
<environment>.env
```

Examples:

```text
dev.env

qa.env

staging.env

prod.env
```

---

# Branch Naming

Format:

```text
<type>/<short-description>
```

Examples:

```text
feature/chart-of-accounts

feature/journal-entry-tests

bugfix/login-failure

hotfix/test-data-issue
```

---

# Commit Naming

Format:

```text
TYPE: Description
```

Examples:

```text
FEAT: Add chart of accounts smoke tests

FIX: Correct login page locator

REFACTOR: Move common grid functions

TEST: Add journal entry regression tests
```

---

# General Rules

1. Use English only.
    
2. Use meaningful business terminology.
    
3. Avoid abbreviations unless officially approved.
    
4. Every automated test must have a Test ID.
    
5. Every feature must have its own folder.
    
6. Every automation artifact must be traceable to a business feature.
    
7. Naming standards are mandatory across all systems.