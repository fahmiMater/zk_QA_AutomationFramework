# الدليل ٥: التشغيل وتتبع الأخطاء

## أوامر التشغيل

```bash
npm test                          # كل الاختبارات
npm run test:framework            # اختبارات الإطار فقط (project: framework)
npx playwright test --ui          # الوضع التفاعلي (الأفضل للتطوير)
npx playwright test tests/example.spec.ts        # ملف محدد
npx playwright test -g "تسجيل دخول"              # بالاسم (grep)
npm run list                      # عرض الاختبارات دون تشغيل
```

## عند فشل اختبار
الإعداد الحالي (`playwright.config.ts`) يحفظ تلقائيًا عند الفشل:
- **Trace** كامل (`trace: 'retain-on-failure'`) — افتحه بـ:
  ```bash
  npx playwright show-report
  ```
- **Screenshot** لحظة الفشل (`screenshot: 'only-on-failure'`)

## تتبع الشبكة
الـ fixture `network` (من `framework/core/fixtures/test.ts`) يمنحك `NetworkManager` لاعتراض الطلبات ومحاكاتها:

```typescript
test('...', async ({ page, network }) => {
  // استخدم network لاعتراض/محاكاة استدعاءات الخادم
});
```

## قبل فتح أي Pull Request
```bash
npm run typecheck     # لا أخطاء TypeScript
npm test              # كل الاختبارات خضراء
```

## قواعد Git المعتمدة (من docs/HANDOVER الأصلي)
- فرع لكل مهمة: `feat/...`, `fix/...`, `docs/...`, `chore/...`
- رسائل Conventional Commits: `feat(pages): add login page object`
