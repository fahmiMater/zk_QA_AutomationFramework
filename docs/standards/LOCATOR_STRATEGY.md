# Locator Strategy

## Purpose

This document defines the standard locator strategy used across the QA Automation Platform.

The objective is to ensure:

* Stability
* Maintainability
* Readability
* Resistance to UI changes

Since the QA team does not have access to the application source code, all locators must be built using Black Box Testing principles.

---

# Guiding Principles

A locator should describe the business element, not the implementation detail.

Good:

* Save Button
* Account Code Field
* Search Input

Bad:

* #btn123
* .ng-star-inserted
* div:nth-child(4)

---

# Locator Priority Order

Always use the highest available strategy, following this strict hierarchy:

1. **Automation IDs** (`data-automation-id`)
2. **ARIA Roles** (Semantic HTML)
3. **Standard HTML Attributes** (`name`, `placeholder`, `title`)
4. **Native HTML Structure** (`label`, `text`)
5. **Library CSS** (Last resort only)

---

## Priority 1 - Accessible Roles

Preferred approach.

Example:

```typescript
page.getByRole('button', {
  name: 'حفظ'
});
```

Benefits:

* Stable
* Readable
* Business-oriented

---

## Priority 2 - Labels

Example:

```typescript
page.getByLabel('اسم الحساب');
```

Benefits:

* Close to business language.
* Less affected by UI structure changes.

---

## Priority 3 - Visible Text

Example:

```typescript
page.getByText('إضافة');
```

Benefits:

* Easy to understand.
* Suitable for menus and buttons.

Limitations:

* Text changes may break tests.

---

## Priority 4 - Placeholder

Example:

```typescript
page.getByPlaceholder('ابحث');
```

Use only when Role and Label are unavailable.

---

## Priority 5 - Stable CSS Selectors

Example:

```typescript
page.locator('.p-table');
```

Allowed only when:

* Semantic locators are unavailable.
* CSS selector is stable.

---

## Priority 6 - Relative Locators

Example:

```typescript
Find the input next to:
"رقم الحساب"
```

Used when no direct locator exists.

---

## Last Resort - XPath

Allowed only when all previous options fail.

Example:

```typescript
page.locator(
  '//button[contains(text(),"حفظ")]'
);
```

Avoid:

```typescript
//*[@id="form"]/div[3]/div[2]/button
```

Reason:

Highly fragile.

---

# Forbidden Locator Types

The following locator patterns are prohibited:

```typescript
nth-child()

nth-of-type()

generated ids

dynamic Angular ids

deep DOM chains
```

Examples:

```typescript
div > div > div > span > button

#cdk-overlay-12

.ng-star-inserted
```

Reason:

Highly unstable.

---

# ERP Grid Strategy

Grid interactions must be abstracted through:

```typescript
GridComponent
```

Tests must never access table rows directly.

Forbidden:

```typescript
page.locator('table tr')
```

Required:

```typescript
grid.verifyRecordExists(...)

grid.filterByColumn(...)

grid.clickRowAction(...)
```

---

# Dialog Strategy

Dialogs must be handled through:

```typescript
DialogComponent
```

Forbidden:

```typescript
page.locator('.p-dialog')
```

inside tests.

---

# Lookup Strategy

Lookup fields must be handled through:

```typescript
LookupComponent
```

Forbidden:

```typescript
page.locator(...)
```

inside tests.

---

# Column Mapping Rule

Tests must never use visible column names directly.

Forbidden:

```typescript
grid.filterByColumn(
  'المعرف',
  '1001'
);
```

Required:

```typescript
GridColumns.ID
```

Reason:

Column titles may change.

---

# Test Layer Restrictions

Tests must never contain:

* CSS Selectors
* XPath
* Locators

All locators must exist only in:

```text
Pages
Components
```

---

# Review Checklist

Before merge:

* Locator priority respected.
* No dynamic locators.
* No XPath unless justified.
* No locators in tests.
* No locators in flows.
* Components reused when possible.

```
```
