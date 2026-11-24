# الدليل ٦: إضافة وحدة (Module) جديدة لتطبيقك

عند بناء اختبارات لتطبيق فعلي، أضف مجلد التطبيق هكذا (النمط الكامل في [docs/standards/NAMING_CONVENTION.md](../standards/NAMING_CONVENTION.md)):

```
apps/
└── my-app/
    ├── pages/                  ← LoginPage.ts, DashboardPage.ts...
    ├── api/
    │   ├── ItemsApiService.ts  ← ترث BaseApiService
    │   └── ItemsSchemas.ts     ← Zod schemas
    ├── flows/                  ← تدفقات متعددة الصفحات (ترث BaseFlow)
    ├── data/                   ← JSON للاختبارات الموجهة بالبيانات
    └── tests/
        ├── items-ui.spec.ts
        └── items-api.spec.ts   ← لاحقة -api.spec.ts تفعّل project الـ api
```

## الخطوات
1. **الصفحة:** أنشئ `pages/XxxPage.ts` يرث `BasePage` (الدليل ٣).
2. **الخدمة (API):** أنشئ `api/XxxApiService.ts` يرث `BaseApiService` + Zod Schema (الدليل ٤).
3. **البيانات:** ملفات JSON في `data/` عند الحاجة.
4. **الاختبار:** في `tests/` — استورد fixtures الإطار.
5. **الإعداد:** أضف project في `playwright.config.ts` (القالب معلّق داخل الملف) أو وسّع project `application` الموجود كتعليق.

## سلسلة الوراثة الرسمية
```
BaseComponent (framework/core/base/BaseComponent.ts)
├── كل المكوّنات في framework/components/
BasePage → صفحاتك
BaseFlow  (framework/core/base/BaseFlow.ts) → تدفقاتك
BaseApiService (framework/core/api/BaseApiService.ts) → خدمات API
```

## معايير لا تُخترق
- المحددات: `data-automation-id` فقط — [docs/standards/LOCATOR_STRATEGY.md](../standards/LOCATOR_STRATEGY.md)
- التسمية: [docs/standards/NAMING_CONVENTION.md](../standards/NAMING_CONVENTION.md)
- كود الإطار: [docs/standards/FRAMEWORK_RULES.md](../standards/FRAMEWORK_RULES.md)
