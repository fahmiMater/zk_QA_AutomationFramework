# AGENTS.md — تعليمات وكلاء الذكاء الاصطناعي في هذا المستودع

## ما هو هذا المشروع
إطار اختبار آلي (Playwright + TypeScript) نقي — بلا أي ارتباط بنطاق عمل محدد.
القائمة الكاملة للمهارات: `.agents/skills/` — اقرأ المهارة المناسبة قبل توليد أي كود.

## القواعد الصارمة (لا استثناء)
1. **المحددات:** `data-automation-id` فقط. ممنوع: نص ظاهر، CSS class، XPath.
2. **الاستيراد:** من `framework/core/fixtures/test.ts` وليس `@playwright/test`.
3. **الانتظار:** `framework/core/waits/WaitUtils.ts` — ممنوع `waitForTimeout`.
4. **الوراثة:** الصفحات من `framework/core/base/BasePage.ts`، التدفقات من `framework/core/base/BaseFlow.ts`، خدمات API من `framework/core/api/BaseApiService.ts`.
5. **الأسرار:** من `.env` فقط (قالب `.env.example`) — لا بيانات دخول في الكود.
6. **هيكل الكود:** تطبيقات في `apps/<app-kebab-case>/{pages,api,flows,data,tests}/` — لا شيء يُكتب داخل `framework/` إلا لتطوير الإطار نفسه.
7. **التسمية:** docs/standards/NAMING_CONVENTION.md — `XxxPage.ts`, `XxxApiService.ts`, `<feature>.spec.ts`.
8. **قبل التسليم:** `npm run typecheck` ثم `npm test` — لا تسليم بفحص فاشل.

## فهرس المهارات
| المهارة | المسار |
|---|---|
| هيكلة وحدة جديدة | `.agents/skills/scaffold-module.md` |
| توليد Page Object | `.agents/skills/generate-page-object.md` |
| كتابة اختبارات UI/API | `.agents/skills/write-tests.md` |
| مراجعة اختبار | `.agents/skills/review-test.md` |
| تشخيص فشل | `.agents/skills/triage-failure.md` |
