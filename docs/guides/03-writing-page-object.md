# الدليل ٣: كتابة Page Object

## القاعدة
كل صفحة ترث من `BasePage` (`framework/core/base/BasePage.ts`) — وهي تمنحك جاهزًا:
- `this.page` — كائن Playwright Page
- `this.components` — مصنع المكونات `ComponentFactory`

## المكونات المتاحة من `this.components`
كلها تُبنى بـ **Automation ID** فقط:

| الطريقة | المكوّن |
|---|---|
| `textBox(id)` | حقل نصي — `fill()`, `clear()`, `getText()`, `assert()` |
| `button(id)` | زر — `click()`, `getText()`, `assert()` |
| `grid(id)` | جدول — `getRowCount()`, `row(i)`, `sort()`, `filter()`, `paginator()`, `getColumnIndex()` |
| `dialog(id)` | نافذة حوارية |
| `tabs(id)` | تبويبات |
| `dropdown(id)` | قائمة منسدلة |
| `lookup(id)` | حقل بحث منبثق |
| `checkbox(id)` / `radio(id)` | اختيار |
| `datePicker(id)` | تاريخ |
| `fileUpload(id)` | رفع ملفات |
| `multiSelect(id)` / `menu(id)` / `tree(id)` / `toast(id)` / `notification(id)` | بقية المكونات |

## مثال كامل

```typescript
import { BasePage } from '../../../framework/core/base/BasePage';

export class LoginPage extends BasePage {

  username() {
    return this.components.textBox('login-username');
  }

  password() {
    return this.components.textBox('login-password');
  }

  submitButton() {
    return this.components.button('login-submit');
  }

  async login(user: string, pass: string) {
    await this.username().fill(user);
    await this.password().fill(pass);
    await this.submitButton().click();
  }
}
```

## إذا لم يوجد مكوّن جاهز
1. ابحث أولًا في `framework/components/` — غالبًا ما تريد موجودًا.
2. إن احتجت مكوّنًا جديدًا اتبع: [docs/how-to/create-new-component.md](../how-to/create-new-component.md) — كل مكوّن يرث `BaseComponent` التي توفر `exists()`, `isVisible()`, `isEnabled()`... عبر `framework/core/base/BaseComponent.ts`.

## محددات متقدمة (خارج المكوّنات القياسية)
استخدم `Automation` من `framework/core/automation/Automation.ts`:
`byId`, `byRole`, `byAttribute`, `byAction`, `byColumn`, `byField`, `byGrid`, `byDialog`, `byTab`.
