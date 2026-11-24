# كتابة أول اختبار لك (Writing Your First Test)

في هذا الدليل (Tutorial)، سنتعلم كيفية كتابة اختبار جديد خطوة بخطوة باستخدام نمط **Data-Driven Page Object Model** المتبع في مشروعنا.

لنفترض أننا نريد اختبار تسجيل الدخول البسيط في نظام ERP باستخدام واجهة المستخدم.

## الخطوة 1: إنشاء ملف الاختبار (Test File)

قم بإنشاء ملف جديد داخل مجلد التطبيق، مثلاً في `apps/erp/demo/tests/`. يجب أن ينتهي اسم الملف بـ `.spec.ts` لكي يتعرف عليه Playwright.
لنقم بإنشاء ملف باسم `login-flow.spec.ts`.

```typescript
import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
    
    test('يجب أن يسجل الدخول بنجاح ببيانات صحيحة', async ({ page }) => {
        // سيتم وضع منطق الاختبار هنا
    });

});
```

## الخطوة 2: استخدام الـ Components و Pages

بدلاً من التعامل مباشرة مع `page.locator()` والبحث عن العناصر بنصوصها، نستخدم استراتيجية **Automation Locators** (معرفات الأتمتة `data-automation-id`) المدمجة في الـ Components.

لنفترض أن لدينا `LoginPage` جاهزة في مجلد الـ `pages`. سنقوم باستدعائها واستخدام الدوال الجاهزة بها:

```typescript
import { test, expect } from '@playwright/test';
// يجب استيراد الـ Page Object المناسبة من المشروع
import { LoginPage } from '../../pages/LoginPage';

test.describe('Login Flow', () => {
    
    test('يجب أن يسجل الدخول بنجاح ببيانات صحيحة', async ({ page }) => {
        const loginPage = new LoginPage(page);

        // 1. الانتقال إلى صفحة الدخول
        await loginPage.navigate();

        // 2. تعبئة البيانات
        await loginPage.fillUsername('admin');
        await loginPage.fillPassword('password123');
        await loginPage.clickLogin();

        // 3. التحقق (Assertions)
        // يجب أن نستخدم الـ Assertions المركزية أو Playwright web-first assertions
        await expect(page).toHaveURL(/.*dashboard/);
    });

});
```

## الخطوة 3: التنفيذ والتحقق

الآن، قم بتشغيل الاختبار الذي قمت بإنشائه باستخدام واجهة المستخدم (UI Mode) للتحقق من عمله:

```bash
npx playwright test apps/erp/demo/tests/login-flow.spec.ts --ui
```

في نافذة Playwright، سترى الاختبار الخاص بك `Login Flow`. اضغط على "Run" وشاهد كيف يتم فتح الصفحة، تعبئة البيانات، وتجاوز التوكيد (Assertion) بنجاح.

---
> **تعلم المزيد:**
> لقد تعلمت الأساسيات! لكتابة اختبارات أكثر تعقيداً واعتمادية، يمكنك مراجعة [كيفية استخدام معرفات الأتمتة (Automation Locators)](../how-to/use-automation-locators.md) أو فهم [التصميم المعماري للمنصة](../explanation/architecture-and-design.md).
