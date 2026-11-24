# Framework Development Rules

## Purpose

This document defines mandatory development rules for all contributors to the QA Automation Platform.

These rules are intended to ensure:

- Scalability
    
- Maintainability
    
- Consistency
    
- Reusability
    
- Readability
    

Failure to follow these rules may result in code review rejection.

---

# Rule 1 - No Locators Inside Tests

Tests must never contain locators.

Forbidden:

```typescript
await page.locator('#save').click();
```

Required:

```typescript
await chartOfAccountsPage.save();
```

Reason:

UI changes should affect only Page Objects.

---

# Rule 2 - No Locators Inside Flows

Flows must never access locators directly.

Forbidden:

```typescript
await page.locator('#accountCode').fill('1001');
```

Required:

```typescript
await chartOfAccountsPage.enterAccountCode('1001');
```

Reason:

Flows represent business processes, not UI implementation.

---

# Rule 3 - No Business Logic Inside Pages

Pages must represent screens.

Pages must NOT contain business workflows.

Forbidden:

```typescript
createAndApproveAccount()
```

Required:

```typescript
AccountFlow.createAndApproveAccount()
```

---

# Rule 4 - No Hardcoded Credentials

Forbidden:

```typescript
username = "admin"
password = "123456"
```

Required:

Use environment configuration.

```typescript
env.username
env.password
```

---

# Rule 5 - No Hardcoded URLs

Forbidden:

```typescript
await page.goto("https://qa.company.com")
```

Required:

```typescript
await page.goto(env.baseUrl)
```

---

# Rule 6 - No Fixed Waits

Forbidden:

```typescript
await page.waitForTimeout(5000)
```

Required:

Use explicit waits.

```typescript
await expect(locator).toBeVisible()
```

or

```typescript
await locator.waitFor()
```

Reason:

Fixed waits create unstable tests.

---

# Rule 7 - Every Test Must Have Test ID

Required format:

```text
ERP-FIN-GL-COA-001
```

Example:

```typescript
test(
 '[ERP-FIN-GL-COA-001] Create account successfully',
 async () => {

 }
)
```

---

# Rule 8 - Every Locator Must Have Meaningful Name

Forbidden:

```typescript
saveBtn
field1
button
```

Required:

```typescript
saveButton
accountCodeInput
approveVoucherButton
```

---

# Rule 9 - Reuse Before Creating

Before creating:

- Page
    
- Component
    
- Utility
    
- Flow
    

Check whether one already exists.

Avoid duplication.

---

# Rule 10 - Components First

If a UI element exists in multiple screens:

Create a reusable component.

Examples:

```text
GridComponent
LookupComponent
DialogComponent
ToolbarComponent
```

---

# Rule 11 - One Responsibility Per Class

Each class should have a single responsibility.

Good:

```text
LoginPage
JournalEntriesPage
GridComponent
```

Bad:

```text
ERPHelperEverythingClass
```

---

# Rule 12 - Externalize Test Data

Business data must not exist inside tests.

Forbidden:

```typescript
accountCode = "1001"
```

Required:

```typescript
testData.accountCode
```

---

# Rule 13 - Independent Tests

Each test must:

- Run independently
    
- Not depend on another test
    
- Not require execution order
    

---

# Rule 14 - Business Feature Organization

Organize by feature.

Correct:

```text
ChartOfAccounts
JournalEntries
FiscalPeriods
```

Incorrect:

```text
Screen1
Screen2
Screen3
```

---

# Rule 15 - Code Review Required

No automation code may be merged without:

- Review
    
- Naming validation
    
- Architecture validation
    

---

# Rule 16 - Definition of Done

Automation task is complete only when:

- Test implemented
    
- Review completed
    
- CI pipeline passed
    
- Evidence generated
    
- Documentation updated
    

---

# Golden Rule

Tests describe business behavior.

Flows describe business processes.

Pages describe screens.

Components describe reusable UI elements.

Never mix responsibilities.