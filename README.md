# ZK QA Automation Framework

إطار اختبار آلي مبني على **Playwright + TypeScript**، يتبع مبادئ Clean Architecture ونمط Data-Driven Page Object Model (POM). يغطي أتمتة **الواجهات (UI)** و**واجهات الخدمات (API)** لأي نظام ويب — بدون أي ارتباط بنطاق عمل محدد.

> 📚 **أدلة الفريق (بالعربية):** ابدأ من [docs/guides/01-getting-started.md](docs/guides/01-getting-started.md)
> 📚 **مركز التوثيق الكامل:** [docs/index.md](docs/index.md)

---

## 🚀 المتطلبات

1. **Node.js** إصدار 18 أو أحدث — من [الموقع الرسمي](https://nodejs.org/)
2. **VS Code** (موصى به) مع إضافة [Playwright Test for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)

## 📦 التثبيت

```bash
npm install
npx playwright install --with-deps
cp .env.example .env    # ثم عبّئ عنوان الخادم وبيانات الدخول (لا تُرفع أبدًا للمستودع)
```

## 🎮 تشغيل الاختبارات

```bash
npm test                    # جميع الاختبارات (Headless)
npx playwright test --ui    # الوضع التفاعلي (موصى به أثناء التطوير)
npm run typecheck           # فحص TypeScript فقط
npx playwright test --list  # عرض الاختبارات دون تشغيلها
```

## 📁 هيكل المجلدات

| المسار | الغرض |
|--------|-------|
| `framework/` | محرك الإطار: المكونات (Grid, Dialog, Tabs...)، طبقة API، المحددات، الأدوات المساعدة. |
| `tests/` | اختبارات الإطار نفسه + مثال عام `example.spec.ts` كقالب للبداية. |
| `docs/` | التوثيق: الأدلة العربية `guides/`، القرارات المعمارية `adr/`، المعايير `standards/`، الشروحات. |
| `.agents/` | مهارات جاهزة لوكلاء الذكاء الاصطناعي لتسريع عمل الفريق. |
| `playwright.config.ts` | الإعداد العام لـ Playwright. |

## ⚠️ القاعدة الذهبية: Semantic Automation IDs

الإطار **يمنع** الاعتماد على النصوص الظاهرة أو CSS Classes أو XPath. كل التفاعل يتم عبر خاصية `data-automation-id`:

```html
<!-- ❌ خطأ: يعتمد على النص -->
<button class="btn-primary">حفظ البيانات</button>

<!-- ✅ صحيح: معرّف دلالي ثابت -->
<button class="btn-primary" data-automation-id="dialog-save-btn">حفظ البيانات</button>
```

محرك `AutomationLocator` يترجم المعرّف تلقائيًا إلى `[data-automation-id="..."]`، فتبقى الاختبارات مستقرة مهما تغيّرت اللغة أو التصميم. التفاصيل: [docs/explanation/semantic-ids-strategy.md](docs/explanation/semantic-ids-strategy.md)

---
*صيانة: فريق QA Automation*
