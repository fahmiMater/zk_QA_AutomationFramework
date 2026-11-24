# تدقيق مراجعة التقرير الهندسي (Audit of the Engineering Review)

> **التاريخ:** 2026-11-24
> **الغرض:** التحقق من كل ملاحظة في [engineering-review-report.md](engineering-review-report.md) مقابل الكود الفعلي قبل تنفيذ أي إصلاح.
> **المنهجية:** فحص فعلي بـ `grep` / `sed` / `diff` / `wc` / `python3 csv` في بيئة عمل مثبتة (`node_modules` موجودة، `npm run typecheck` ينجح).

## الحصيلة الإجمالية

| التصنيف | الملاحظات |
|---|---|
| ✅ مؤكدة (تُنفَّذ) | 30: #1 #2 #3 #4 #5 #6 #7 #8 #12* #13 #14 #15 #17 #18 #19 #21 #22 #23 #24 #25 #28 #29 #30 #31 #32 #33 #34 #36 #37* #16* |
| ⚠️ صحيحة جزئيًا (تُنفَّذ بتعديل النطاق) | #11 (عدم اتساق النوع في `ButtonComponent` وليس انكسارًا تشغيليًا — تُدمج مع #12) · #16 (استيراد type-only من `@playwright/test` — الخطورة LOW لا MEDIUM) · #35 (مجلدا TD فارغان — يحتاج تأكيد `ls`) |
| ❌ مرفوضة (لا تُنفَّذ) | #9، #10 (فشل typecheck/`--list` سببه بيئة المحرّك بلا `node_modules` — في بيئة عاملة ينجحان)، #20 (مسار بلا return — `tsc --noEmit` يمر نظيفًا) |
| ❓ غير متحقق | #37 (استيرادات `BaseFlow`)، #35 (محتوى TDs) |

---

## أولًا: الملاحظات المرفوضة — لا تُنفَّذ

| # | ملاحظة التقرير | سبب الرفض | الدليل الفعلي |
|---|---|---|---|
| #9 | فشل `npm run typecheck` (TS2688) | فشل بيئة المحرّك: `node_modules` غير مثبتة عنده | في بيئة عمل مثبتة: `npm run typecheck` ينجح بصفر أخطاء |
| #10 | فشل `npx playwright test --list` | نفس السبب | `--list` يعرض `tests/example.spec.ts` ويكتمل بنجاح |
| #20 | مسار بلا `return` في `execute<T>` | لا تتجدد: `strict: true` + tsc نظيف؛ الدليل الوحيد نظري | `npm run typecheck` ← 0 errors |

> إجراء وقائي اختياري (اختياري وليس إصلاحًا): إضافة `: never` في نهاية `catch` داخل `execute` تحسبًا للمستقبل.

---

## ثانيًا: الملاحظات المؤكدة (مع الدليل file:line)

| # | الملاحظة | الدليل الفعلي | معيار القبول (Acceptance) |
|---|---|---|---|
| #1 | `ApiClient` افتراضي غير صارم → نجاح زائف | `framework/core/api/ApiClient.ts:11` — `defaultStrictMode: boolean = false` | الافتراضي `true` في `ApiClient` و`BaseApiService`؛ الـ mock متاح فقط عند تمرير `strictMode: false` صراحةً |
| #2 | لا `.gitlab-ci.yml` | الجذر — لا يوجد الملف | pipeline بمراحل install→typecheck→test مع junit artifact موجود في الجذر |
| #3 | mock token صامت عند فشل المصادقة | `framework/core/api/ApiClient.ts` داخل `login()` (catch → `mock_jwt_token_${role}`) | أي مسار mock يُسجَّل بـ `Logger.warn` ويُميَّز |
| #4 | `getHeaders` يصنع توكن زائف | `framework/core/api/BaseApiService.ts:48-49` — `getToken(...) \|\| \`mock_jwt_token_...\`` | `FrameworkException` عند غياب التوكن الحقيقي إلا في وضع offline المصرَّح به |
| #5 | `waitForTimeout(300)` ×3 | `framework/components/menu/MenuComponent.ts:126`؛ `framework/components/tree/TreeNodeComponent.ts:39,54` | صفر تطابق لـ `grep -rn waitForTimeout framework/` |
| #6 | 4 مكونات غير مسجلة في Factory | `framework/core/factory/ComponentFactory.ts` — 13 تسجيلًا فقط؛ لا `menu(` ولا `tree(` ولا `notification(` ولا `toolbar(` رغم وجود `ToolbarComponent.ts` | `ComponentFactory` يسجّل 17 طريقة (كل المكوّنات) |
| #7 | `EnvironmentManager` يرمي على مجلد غير موجود | `framework/core/config/EnvironmentManager.ts:~33` — `Environment configuration not found`؛ `ls environments` → غير موجود | `environments/qa/config.json` نموذجي موجود + fallback معلن |
| #8 | `Configuration` eager static | `framework/core/config/Configuration.ts:12-13` — `private static readonly environment = EnvironmentManager.load();` | التحميل lazy (getter/initializer function) — لا استدعاء وقت import |
| #11+#12 | عقد المكونات غير موحد | `framework/components/button/ButtonComponent.ts:13-15` — `identifier: string \| Locator` مع تفريع داخلي (`page.locator` لـ `.`/`//` وإلا `Automation.byId`)؛ الـ Factory نفسه متسق (`Automation.byId` في 43/53/63...) | كل المكوّنات تستقبل `automationId` وتحوله داخليًا؛ Factory يمرر IDs فقط |
| #13 | تكرار `execute/retry/handleError` | `framework/core/base/BasePage.ts:345` و`framework/core/base/BaseComponent.ts:308` | منطق التنفيذ الموحد في مكان واحد (BaseComponent أو خُدمة مشتركة) |
| #14 | `BasePage` بلا وراثة/واجهة مشتركة | `export abstract class BasePage {` بلا extends | واجهة `IExecutable` أو وراثة موثقة |
| #15 | `page.locator` في القالب | `tests/example.spec.ts:54` — `await expect(page.locator('[data-automation-id="login-username"]')).toBeVisible();` | القالب يستخدم Page Object + `assert()` فقط |
| #16 | مرجع `@playwright/test` في القالب | `tests/example.spec.ts:20` — `import('@playwright/test').Page` (type-only inline) | استبدال بنوع من الإطار أو قالب وسيط — الأولوية LOW |
| #17 | ملف فارغ | `framework/core/automation/AutomationContracts.ts` — `wc -c` = **0** | يُحذف أو يُملأ بالمحتوى المقصود |
| #18 | `action.toString()` هش | `framework/core/api/BaseApiService.ts:147` — `['post','put'].some(m => action.toString().includes(\`.${m}\`))` | نوع العملية يُمرر معاملًا صريحًا لـ `safeExecute` |
| #19 | `tsconfig` بلا `apps/**` | `tsconfig.json` — include = framework, tests, playwright.config فقط | إضافة `"apps/**/*.ts"` مسبقًا (مطلوب أيضًا لخطوة 4 في مهارة `scaffold-module`) |
| #21 | لا retries/timeout/workers | `playwright.config.ts` — لا شيء منها | إضافة القيم المقترحة في التقرير (retries في CI فقط) |
| #22 | لا ESLint/Prettier/Husky | لا ملفات إعداد | الحد الأدنى: eslint + prettier + pre-commit typecheck |
| #23–25 | أسماء WaitUtils خاطئة في `framework-api.md` | الوثيقة: `waitForElementVisible` (L10)، `waitForNetworkIdle` (L12)، `waitForElementEnabled` (L11) — الفعلي: `waitUntilVisible` (L36)، لا مقابل لـ NetworkIdle، `waitForEnabled` (L62) | الوثيقة تطابق `framework/core/waits/WaitUtils.ts` حرفيًا |
| #28 | ازدواجية `Automation`/`AutomationLocator` | كلاهما فيه `byId`؛ الأول بلا فحص فراغ، والثاني يرمي `FrameworkException` | دمج وفق ADR-012/013 — نقطة دخول واحدة |
| #29 | `Logger` بسيط | `framework/core/logger/Logger.ts` — `info/warn/error` فقط بلا timestamps | timestamp + مستوى debug |
| #30 | `retry()` وهمي | `framework/core/base/BaseComponent.ts:~339` — `protected async retry<T>(action) { return await action(); }` | retry حقيقي بجولات قابلة للضبط أو حذف الاستدعاءات |
| #31 | لا junit reporter | `grep junit playwright.config.ts` → لا شيء | إضافة `['junit', { outputFile: 'test-results/junit.xml' }]` (مطلوب لـ `tuleap-sync` و`gitlab-ci-setup`) |
| #32 | `AGENTS.md` مزدوج متطابق | `diff AGENTS.md .agents/AGENTS.md` → IDENTICAL | المصدر الوحيد + آلية مزامنة موثقة |
| #33 | مثال كلمة مرور محظور | `docs/standards/FRAMEWORK_RULES.md:94` — `password = "123456"` | استبدال بـ placeholder واضح |
| #34 | `TECH_DEBT.md` متقادم | 4 أسطر عن الفلترة فقط | إعادة كتابة تشمل #13 #18 #30 #7 |
| #36 | ذكر ERP متبقٍ | `framework/core/automation/AutomationAttribute.ts:3` — «بين منصة الـ ERP ومنصة الأتمتة» | صياغة محايدة |
| #37 | استيراد `BaseFlow` | يحتاج فحصًا فعليًا قبل التنفيذ | التحقق أولاً ثم التوثيق/الإصلاح |
| #35 | مجلدا TD فارغان | `docs/TDs/TD-002_GridComponent/` و`docs/TDs/TD-003/` — يحتاج `ls` تأكيدي | حذف أو توحيد بنية TDs |

---

## ثالثًا: أسئلة تحتاج قرارًا (من المستخدم، لا الوكيل)

1. **dotenv:** لا توجد حزمة ولا كود يقرأ `.env` (`dependencies` فيها `zod` فقط؛ `EnvironmentManager` يقرأ `process.argv` و`config.json`). قرار مطلوب: إضافة `dotenv` أم الاعتماد على GitLab CI/CD Variables حصريًا؟
2. **ADR-005/006/011:** حُذفت عمدًا أم ضاعت؟ (يحدد ما إذا نضيف صفحة سجل تعليم للأرقام.)
3. **Tuleap version:** لتثبيت أوامر `/tuleap-sync` (يظل غير مؤكد حتى التأكيد).
