# الدليل ١: البدء مع الإطار

## المتطلبات
- **Node.js 18+** — [nodejs.org](https://nodejs.org/)
- VS Code مع إضافة [Playwright Test for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)

## التثبيت (مرة واحدة)

```bash
git clone <رابط المستودع>
cd zk_QA_AutomationFramework
npm install
npx playwright install --with-deps
cp .env.example .env     # ثم عبّئ القيم — ملف .env لا يُرفع للمستودع إطلاقًا
```

## أول تشغيل

```bash
npx playwright test --list        # عرض الاختبارات دون تشغيل
npm test                          # تشغيل كل الاختبارات (Headless)
npx playwright test --ui          # الوضع التفاعلي — الأفضل أثناء التطوير
npm run typecheck                 # فحص TypeScript فقط (سريع)
```

## أين أبدأ القراءة؟
1. هذا الدليل
2. [الدليل ٢: هيكل المشروع](02-project-structure.md)
3. [الدليل ٣: كتابة Page Object](03-writing-page-object.md)
4. [الدليل ٤: كتابة الاختبارات](04-writing-tests.md)
5. المثال الجاهز: `tests/example.spec.ts`

## القاعدة الذهبية
كل التفاعل مع الواجهة يتم عبر خاصية `data-automation-id` فقط — لا نصوص ظاهرة، لا CSS، لا XPath:

```html
<button data-automation-id="dialog-save-btn">حفظ البيانات</button>
```

التفسير الكامل: [docs/explanation/semantic-ids-strategy.md](../explanation/semantic-ids-strategy.md)
