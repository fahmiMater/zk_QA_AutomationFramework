# الدليل ٤: كتابة الاختبارات (UI و API)

## اختبار UI

استورد `test` و`expect` من **fixtures الإطار** (ليس من `@playwright/test` مباشرة) حتى تحصل على الخدمات المخصصة مثل `network`:

```typescript
import { test, expect } from '../../framework/core/fixtures/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('تسجيل الدخول', () => {

  test('دخول ناجح ببيانات صحيحة', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('user', 'pass');
    // تحققات...
  });
});
```

### الاختبارات الموجهة بالبيانات (Data-Driven)
أضف سيناريو جديدًا بملف JSON فقط دون لمس الكود — عبر `JsonTestDataProvider` من `framework/core/data/providers/JsonTestDataProvider.ts`. مثال حي: `apps/.../login.spec.ts` في مشروع الأصل، والنمط موثق في [docs/tutorials/writing-first-test.md](../tutorials/writing-first-test.md).

## اختبار API

### النمط ١: خدمة ترث `BaseApiService` (لعقود معقدة)
`framework/core/api/BaseApiService.ts` يوفر `get/post/put/delete` مع:
- **تعدد الأدوار:** `options.role` يحقن توكن الدور تلقائيًا (`ADMIN`, `ACCOUNTANT`, `AUDITOR`...)
- **تحقق العقود:** مرر Schematic من [Zod](https://zod.dev) فيُتحقق من الاستجابة تلقائيًا عبر `ApiResponseValidator`
- **الوضع الصارم:** `strictMode: true` يرمي خطأ على أي استجابة غير ناجحة

```typescript
import { z } from 'zod';
import { BaseApiService } from '../../framework/core/api/BaseApiService';

const ItemSchema = z.object({ id: z.number(), name: z.string() });

export class ItemsApiService extends BaseApiService {
  getItem(id: number) {
    return this.get(`/items/${id}`, { role: 'ADMIN' }, ItemSchema);
  }
}
```

### النمط ٢: `ApiClient` المباشر (للعمليات السريعة وتهيئة البيانات)
`framework/core/api/ApiClient.ts` — يدعم `init()`, `login(username, role, password)`, والاستدعاءات المباشرة. التوكنات تُدار عبر `AuthTokenManager` (Singleton) في `framework/core/api/AuthTokenManager.ts`.

### سيناريوهات يجب تغطيتها دائمًا
1. الحالة السعيدة (200/201)
2. فشل التحقق (400)
3. **الصلاحيات:** دور غير مخوّل يتوقع 403 (عبر `role` مختلف)
4. تحقق العقد بـ Zod

## الانتظار — ممنوع الصبر الأعمى
لا `waitForTimeout` أبدًا (سياسة No Hard Wait موثقة في `docs/adr/ADR-008 No Hard Wait Policy.md`). استخدم `WaitUtils` من `framework/core/waits/WaitUtils.ts`:
`waitForPageReady`, `waitUntilVisible`, `waitUntilHidden`, `waitForEnabled`, `waitForText`.
