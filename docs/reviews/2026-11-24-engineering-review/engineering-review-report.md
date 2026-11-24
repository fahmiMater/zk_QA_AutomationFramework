# تقرير المراجعة الهندسية الشاملة
## zk_QA_AutomationFramework

> **التاريخ:** 2026-11-24  
> **المراجع:** مهندس جودة برمجيات أول (Principal Engineer)  
> **الوضع:** قراءة فقط — لم يُعدّل أي ملف في المستودع

---

## ١. الملخص التنفيذي

الإطار يمثل بنية معمارية ناضجة ومدروسة لأتمتة اختبارات UI و API بنمط Clean Architecture مع Playwright + TypeScript. التوثيق غني (ADRs، أدلة عربية، معايير) والمكونات الـ 18 تغطي طيفاً واسعاً من عناصر الواجهة. الإطار جاهز هيكلياً لاستقبال أول تطبيق حقيقي.

**أهم ثلاثة مخاطر:**

1. **CRITICAL — النجاح الزائف (False Positive):** `BaseApiService.safeExecute` يُرجع استجابة مزيفة 200/201 عند فشل الاتصال في الوضع غير الصارم (الافتراضي في `ApiClient`). في CI بدون خادم حقيقي، الاختبارات ستنجح دائماً كذباً.
2. **CRITICAL — غياب CI/CD:** لا يوجد `.gitlab-ci.yml` ولا أي pipeline — أي كود يُدمج بدون بوابة جودة آلية.
3. **HIGH — `waitForTimeout` متسلل:** ثلاثة استدعاءات `page.waitForTimeout(300)` في `MenuComponent` و `TreeNodeComponent` تخالف ADR-008 وقاعدة الإطار الصريحة.

---

## ٢. جدول الملاحظات الكامل

| # | الخطورة | البعد | الملاحظة | الدليل (file:line) | الإصلاح المقترح | الجهد |
|---|---------|-------|----------|---------------------|-----------------|-------|
| 1 | CRITICAL | أمان/اختبارات | `ApiClient` يمرر `defaultStrictMode=false` → `safeExecute` يُصنّع استجابة mock ناجحة عند ECONNREFUSED | [ApiClient.ts#L11](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/framework/core/api/ApiClient.ts#L11) | اقلب الافتراضي إلى `true`؛ أو أضف فحص دخان (smoke check) يفشل إن لم يتصل الخادم | S |
| 2 | CRITICAL | CI/CD | غياب `.gitlab-ci.yml` كلياً — لا بوابة جودة آلية | الجذر — لا يوجد الملف | أنشئ pipeline مرحلي: `install → typecheck → test → artifacts` | M |
| 3 | CRITICAL | أمان | `ApiClient.login` يُرجع `mock_jwt_token_...` عند فشل المصادقة بدون تحذير — يتم قبوله كتوكن صالح في الاختبارات | [ApiClient.ts#L55-L62](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/framework/core/api/ApiClient.ts#L55-L62) | أضف `Logger.warn` وعلامة `isMocked: true` في الاستجابة | S |
| 4 | CRITICAL | اختبارات | `getHeaders()` يصنع mock token افتراضياً حتى لو لم يتم تسجيل الدخول — أي طلب API يُرسل بتوكن زائف | [BaseApiService.ts#L48](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/framework/core/api/BaseApiService.ts#L48) | ارمِ `FrameworkException` إن لم يوجد توكن حقيقي إلا عند تفعيل offline mode صراحة | S |
| 5 | HIGH | تذبذب | `MenuComponent.ts:126` و `TreeNodeComponent.ts:39,54` تستخدم `page.waitForTimeout(300)` المحظور بـ ADR-008 | MenuComponent.ts:126, TreeNodeComponent.ts:39,54 | استبدل بـ `waitFor({ state: 'visible' })` أو `expect().toBeVisible()` | S |
| 6 | HIGH | معمارية | `ComponentFactory` لا يتضمن `MenuComponent`، `NotificationCenterComponent`، `TreeComponent`، `ToolbarComponent` — مكونات موجودة لكن غير مسجلة | [ComponentFactory.ts#L1-L156](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/framework/core/factory/ComponentFactory.ts) | سجّل جميع المكونات الـ 18 في المصنع | S |
| 7 | HIGH | إعدادات | `EnvironmentManager.load()` يبحث عن `environments/qa/config.json` — هذا المجلد غير موجود في المستودع | [EnvironmentManager.ts#L28-L33](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/framework/core/config/EnvironmentManager.ts#L28-L33) | أنشئ `environments/qa/config.json` كمثال أو أضف fallback ذكي | S |
| 8 | HIGH | إعدادات | `Configuration` يُنفذ `EnvironmentManager.load()` كـ static initializer — يفشل فوراً عند import إن لم يوجد ملف البيئة | [Configuration.ts#L12-L13](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/framework/core/config/Configuration.ts#L12-L13) | اجعله lazy (getter) بدلاً من eager static | S |
| 9 | HIGH | أدوات | فشل `npm run typecheck`: خطأ `TS2688: Cannot find type definition file for 'node'` | مخرجات typecheck الفعلية | شغّل `npm install` لتثبيت `@types/node`، أو تحقق من وجود `node_modules` | S |
| 10 | HIGH | أدوات | فشل `npx playwright test --list`: `Cannot find module '@playwright/test'` | مخرجات test --list الفعلية | شغّل `npm install` ثم `npx playwright install` | S |
| 11 | HIGH | معمارية | `ButtonComponent` constructor يمرر `Automation.byId(identifier)` كـ string لا كـ Locator حين يكون ID — يتعامل BaseComponent معه كـ CSS selector string وليس Locator | [ButtonComponent.ts#L14-L19](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/framework/components/button/ButtonComponent.ts#L14-L19) | وحّد أسلوب بناء المكون ليمر دائماً عبر `AutomationLocator.resolve()` | M |
| 12 | HIGH | معمارية | عدم اتساق أسلوب بناء المكونات في `ComponentFactory`: بعضها يمرر `Automation.byId(id)` (string) وبعضها يمرر `automationId` مباشرة | [ComponentFactory.ts#L27-L154](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/framework/core/factory/ComponentFactory.ts#L27-L154) | وحّد المسار: كل مكون يستقبل `automationId` ويحوله داخلياً | M |
| 13 | MEDIUM | معمارية | تكرار نمط `execute → retry → handleError` بين `BasePage` و `BaseComponent` بكود متطابق حرفياً | [BasePage.ts#L345-L409](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/framework/core/base/BasePage.ts#L345-L409) vs [BaseComponent.ts#L308-L368](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/framework/core/base/BaseComponent.ts#L308-L368) | استخرج Mixin أو صنف مساعد `ExecutionPipeline` | M |
| 14 | MEDIUM | معمارية | `BasePage` لا يرث `BaseComponent` رغم تكرار الأنماط — ولا توجد واجهة مشتركة | الملفان أعلاه | أضف `IExecutable` interface | S |
| 15 | MEDIUM | اختبارات | `example.spec.ts:54` يستخدم `page.locator('[data-automation-id="..."]')` مباشرة — يخالف Rule 1 (لا locators في الاختبارات) | [example.spec.ts#L54](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/tests/example.spec.ts#L54) | استخدم `loginPage.username().assert().isVisible()` | S |
| 16 | MEDIUM | اختبارات | `example.spec.ts:20` يستورد `Page` مباشرة من `@playwright/test` — يخالف ADR-010 | [example.spec.ts#L20](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/tests/example.spec.ts#L20) | مرر `page` من fixture فقط دون استيراد النوع | S |
| 17 | MEDIUM | جودة كود | `AutomationContracts.ts` ملف فارغ تماماً | [AutomationContracts.ts](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/framework/core/automation/AutomationContracts.ts) | احذفه أو أضف محتوى | S |
| 18 | MEDIUM | جودة كود | `BaseApiService` يستخدم `action.toString().includes('.post')` لتحديد POST — هش جداً ويعتمد على تمثيل الدالة كنص | [BaseApiService.ts#L147](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/framework/core/api/BaseApiService.ts#L147) | مرر نوع العملية كـ parameter إلى `safeExecute` | S |
| 19 | MEDIUM | إعدادات | `tsconfig.json` لا يتضمن `apps/**/*.ts` في `include` — اختبارات التطبيقات المستقبلية لن تُفحص بالتحقق النوعي | [tsconfig.json#L12-L16](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/tsconfig.json#L12-L16) | أضف `"apps/**/*.ts"` | S |
| 20 | MEDIUM | جودة كود | `BaseComponent.execute<T>` return type هو `Promise<T>` لكن `handleError` يرمي `never` — TypeScript قد يشتكي من مسار بلا return | [BaseComponent.ts#L308-L322](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/framework/core/base/BaseComponent.ts#L308-L322) | أضف return type annotation أو `: never` للـ catch | S |
| 21 | MEDIUM | CI/CD | غياب `retries`، `workers`، `fullyParallel`، `timeout` في `playwright.config.ts` | [playwright.config.ts](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/playwright.config.ts) | أضف: `retries: 1, workers: '50%', timeout: 30000` | S |
| 22 | MEDIUM | CI/CD | غياب ESLint + Prettier + Husky — لا فرض آلي لقواعد الكود | الجذر — لا يوجد `.eslintrc` | ثبّت الحد الأدنى: `eslint + @typescript-eslint + prettier` | M |
| 23 | MEDIUM | توثيق | `docs/reference/framework-api.md` يذكر `WaitUtils.waitForElementVisible(locator)` — غير موجودة؛ الاسم الفعلي `WaitUtils.waitUntilVisible(locator)` | [framework-api.md#L10](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/docs/reference/framework-api.md#L10) vs [WaitUtils.ts#L36](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/framework/core/waits/WaitUtils.ts#L36) | صحّح أسماء الدوال في المرجع | S |
| 24 | MEDIUM | توثيق | `framework-api.md` يذكر `WaitUtils.waitForNetworkIdle(page)` — غير موجودة؛ الاسم الفعلي `WaitUtils.waitForPageReady(page)` | [framework-api.md#L12](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/docs/reference/framework-api.md#L12) vs [WaitUtils.ts#L22](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/framework/core/waits/WaitUtils.ts#L22) | صحّح الاسم | S |
| 25 | MEDIUM | توثيق | `framework-api.md` يذكر `WaitUtils.waitForElementEnabled(locator)` — غير موجودة؛ الاسم الفعلي `WaitUtils.waitForEnabled(locator)` | [framework-api.md#L11](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/docs/reference/framework-api.md#L11) vs [WaitUtils.ts#L62](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/framework/core/waits/WaitUtils.ts#L62) | صحّح الاسم | S |
| 26 | MEDIUM | توثيق | `docs/adr/` يحتوي ملفين لـ ADR-013 (`ADR-013-automation-locator.md` و `ADR-013-automation-locator-completed.md`) — ارتباك في مصدر الحقيقة | [docs/adr/](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/docs/adr/) | ادمج في ملف واحد باسم `ADR-013-automation-locator.md` مع حالة Completed | S |
| 27 | MEDIUM | توثيق | أرقام ADR مفقودة: ADR-005, ADR-006, ADR-011 — فجوات في التسلسل | [docs/adr/README.md](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/docs/adr/README.md) | وثّق سبب الحذف أو أعد الترقيم | S |
| 28 | LOW | معمارية | `AutomationLocator` و `Automation` يفعلان نفس الشيء (`byId`) مع اختلاف بسيط (الأول يتحقق من الفراغ) — ازدواجية | [AutomationLocator.ts](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/framework/core/locators/AutomationLocator.ts) vs [Automation.ts](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/framework/core/automation/Automation.ts) | وحّد في كلاس واحد كما يوصي ADR-012/013 | M |
| 29 | LOW | جودة كود | `Logger` هو wrapper رقيق فوق `console.*` بدون timestamps، مستوى log، أو تكامل مع Playwright reporting | [Logger.ts](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/framework/core/logger/Logger.ts) | أضف timestamp + integration مع `test.info().attach()` | M |
| 30 | LOW | جودة كود | `retry()` في `BaseComponent` و `BasePage` لا تعمل إعادة محاولة فعلية — تنفذ العملية مرة واحدة فقط | [BaseComponent.ts#L339-L345](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/framework/core/base/BaseComponent.ts#L339-L345) | نفّذ إعادة محاولة حقيقية أو احذف الطبقة الوهمية | M |
| 31 | LOW | تقارير | التقارير تفتقد `junit` reporter المطلوب لتكامل GitLab MR و Tuleap | [playwright.config.ts#L4-L7](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/playwright.config.ts#L4-L7) | أضف `['junit', { outputFile: 'test-results/junit.xml' }]` | S |
| 32 | LOW | توثيق | `AGENTS.md` في الجذر و `.agents/AGENTS.md` متطابقتان حالياً — خطر الانحراف عند التعديل على واحدة | الملفان متطابقان (تم التحقق) | استخدم ملف واحد وأضف تعليق يوجه للآخر | S |
| 33 | LOW | أمان | `FRAMEWORK_RULES.md` Rule 4 يحتوي `password = "123456"` كمثال على المحظور — غير خطر لكن قد يُفهم خطأ | [FRAMEWORK_RULES.md#L94](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/docs/standards/FRAMEWORK_RULES.md#L94) | استبدل بـ `password = "***"` | S |
| 34 | INFO | توثيق | `TECH_DEBT.md` محتواه 4 أسطر فقط عن الفلترة — لا يغطي الديون التقنية الفعلية بعد التحرير من ERP | [TECH_DEBT.md](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/docs/adr/TECH_DEBT.md) | أعد كتابته ليعكس الواقع الحالي | S |
| 35 | INFO | توثيق | `docs/TDs/TD-002_GridComponent` مجلد فارغ و `TD-003` مجلد فارغ — بنية غير متسقة مع `TD-001` (ملف) | [docs/TDs/](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/docs/TDs/) | وحّد البنية: كل TD في ملف واحد أو كل TD في مجلد | S |
| 36 | INFO | معمارية | `AutomationAttribute.ts:3` يذكر "منصة الـ ERP" — بقايا من المشروع القديم | [AutomationAttribute.ts#L3](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/framework/core/automation/AutomationAttribute.ts#L3) | أعد صياغة التعليق | S |
| 37 | INFO | معمارية | `BaseFlow` يستورد `Logger` لكن لا يستورد `ComponentFactory` — الوثائق تقول أنه يعتمد على Pages و Components | [BaseFlow.ts#L2-L3](file:///d:/Testing/الوظيفه/2026/Zk_QA_AutomationFramework/framework/core/base/BaseFlow.ts#L2-L3) | أضف توثيقاً أن الـ Flow يستقبل Pages عبر Constructor injection | S |

---

## ٣. التقييم التفصيلي لكل بُعد

### البعد ١: المعمارية وأنماط التصميم

**التقييم العام: جيد مع نقاط ضعف في الاتساق**

الطبقات المعمارية (Core → Components → Pages → Flows → Tests) مصممة بشكل سليم وموثقة في ADR-010. الحدود واضحة: `framework/core/` لا يستورد من `framework/components/` إلا في `ComponentFactory` (وهذا مقصود كنقطة ربط). لا يوجد تسرب عكسي (components لا تستورد من core/factory).

**نقاط الضعف:**
- **ازدواجية `Automation` vs `AutomationLocator`** (ملاحظة #28): كلاهما يوفران `byId()` بفروق بسيطة. ADR-012 و ADR-013 يوثقان خطة الدمج لكن التنفيذ لم يكتمل — يوجد ملفان لـ ADR-013 (أحدهما `completed` والآخر لا).
- **عدم اتساق بناء المكونات** (ملاحظة #12): `ComponentFactory.dialog()` يمرر `Automation.byId(id)` بينما `ComponentFactory.grid()` يمرر `automationId` مباشرة. `ButtonComponent` يبني locator بطريقة ثالثة مختلفة. هذا عدم اتساق يرفع كلفة الصيانة.
- **تكرار `execute/retry/handleError`** (ملاحظة #13): نسخة حرفياً متطابقة في `BasePage` و `BaseComponent` دون مشاركة.
- **`retry()` وهمي** (ملاحظة #30): يُنفذ العملية مرة واحدة فقط — وهذا موثق كدين تقني لكنه يخلق وعداً كاذباً بالمرونة.

### البعد ٢: جودة الكود

**التقييم العام: جيد في التعليقات، ضعيف في الأدوات الآلية**

- **التعليقات:** غنية بالعربية ومتسقة في الأسلوب. JSDoc موجود في معظم الدوال.
- **TypeScript strict:** `strict: true` مفعّل في `tsconfig.json` ✅.
- **غياب ESLint** (ملاحظة #22): لا يوجد أي أداة linting — قواعد التسمية والاستيراد تعتمد فقط على المراجعة البشرية والمهارات.
- **معالجة الأخطاء:** `FrameworkException` مصمم جيداً مع `Object.setPrototypeOf` لإصلاح سلسلة الوراثة. لكن `ComponentException` و `GridException` لم يُستخدما في أي مكان — `GridComponent.getColumnIndex()` يرمي `Error` عادي بدلاً من `GridColumnNotFoundException`.
- **`action.toString().includes('.post')`** (ملاحظة #18): حيلة هشة في `BaseApiService:147` تعتمد على التمثيل النصي لـ arrow function — قد تفشل مع minification أو أي تغيير في بنية الدالة.

### البعد ٣: تصميم الاختبارات والتذبذب

**التقييم العام: البنية التحتية سليمة، الالتزام به ناقص**

- **`example.spec.ts`:** يوضح النمط العام لكنه يخالف قاعدتين: يستخدم `page.locator()` مباشرة في السطر 54 (Rule 1)، ويستورد `Page` من `@playwright/test` في السطر 20 (ADR-010 يمنع ذلك في طبقة الاختبارات).
- **`waitForTimeout` المتسلل** (ملاحظة #5): ثلاثة استدعاءات في `MenuComponent` و `TreeNodeComponent` تخالف ADR-008 صراحة.
- **`WaitUtils`:** مصمم جيداً ويعتمد على `expect` assertions بدلاً من hard waits ✅.
- **`JsonTestDataProvider`:** يعمل بشكل متزامن (`fs.readFileSync` داخل `loadAll` المُعلن async) — سيعمل لكنه misleading. لا يوجد تكامل مع `test.describe.each` أو `for...of` pattern لتسمية الاختبارات ديناميكياً.
- **`NetworkManager/Interceptor/Monitor`:** تصميم Facade + SRP ممتاز. `clearAllInterceptors()` في fixture cleanup (test.ts:26) يوفر عزلاً جيداً ✅.

### البعد ٤: البيانات والإعدادات

**التقييم العام: وعود لم تُنفذ**

- **baseUrl hardcoded:** `http://localhost:3000/api/v1` في `ApiClient:11` و `BaseApiService:34` كقيم افتراضية — يمكن تجاوزها عبر constructor arg لكن لا يوجد مسار فعلي من `.env` إلى `ApiClient`.
- **`EnvironmentManager`** (ملاحظة #7): يبحث عن `environments/qa/config.json` — هذا المجلد غير موجود في المستودع. أي `import` لـ `Configuration` سيفشل فوراً.
- **`.env.example`:** يغطي الأدوار (Admin, Accountant, Auditor, Unauthorized) والخدمات ✅. لكن لا يوجد كود يقرأ هذه المتغيرات (لا `dotenv` في dependencies، ولا `process.env` في الكود).
- **`playwright.config.ts`:** يحتوي project `framework` فقط مع تعليق لإضافة project تطبيق. لا يدعم تعدد البيئات حالياً.
- **`tsconfig.json`:** لا يتضمن `apps/**/*.ts` — اختبارات التطبيقات المستقبلية لن تُفحص.

### البعد ٥: الأسرار والأمان

**التقييم العام: سليم — لا تسريبات حقيقية**

- **لا توجد بيانات اعتماد حقيقية** في المستودع. `.env.example` يستخدم `<password>` كـ placeholders ✅.
- **`FRAMEWORK_RULES.md:94`** يحتوي `password = "123456"` كمثال محظور — ليس تسريباً فعلياً لكن يُفضل استبداله.
- **`AuthTokenManager`:** يخزن التوكنات في `Map` بالذاكرة — آمن كفاية للاختبارات. لا يظهر التوكن في traces لأن Playwright لا يسجل محتوى المتغيرات الداخلية.
- **خطر النجاح الزائف** (ملاحظة #1-4): السلوك الأخطر هو قبول mock tokens بصمت — ليس تسريب أسرار لكنه يُخفي مشاكل المصادقة.

### البعد ٦: التكامل والتسليم المستمر (CI/CD)

**التقييم العام: غائب كلياً**

- **لا يوجد `.gitlab-ci.yml`** — أي كود يُدمج بدون فحص آلي.
- **لا `retries`/`workers`/`timeout`** في `playwright.config.ts` — الافتراضيات (30s timeout, 1 worker, 0 retries) قد تكون غير كافية.
- **لا ESLint/Prettier/Husky** — قواعد الكود تعتمد على الانضباط الذاتي فقط.

> [!IMPORTANT]
> **اقتراح Pipeline كامل (يُكتب لا يُنفذ):**
> ```yaml
> # .gitlab-ci.yml المقترح
> image: mcr.microsoft.com/playwright:v1.62.1-jammy
> 
> stages:
>   - install
>   - quality
>   - test
> 
> cache:
>   key: ${CI_COMMIT_REF_SLUG}
>   paths:
>     - node_modules/
>     - ~/.cache/ms-playwright/
> 
> install:
>   stage: install
>   script:
>     - npm ci
>     - npx playwright install --with-deps chromium
> 
> typecheck:
>   stage: quality
>   script:
>     - npm run typecheck
> 
> lint:
>   stage: quality
>   script:
>     - npx eslint . --max-warnings 0
> 
> test:
>   stage: test
>   script:
>     - npx playwright test --reporter=junit,list
>   artifacts:
>     when: always
>     paths:
>       - playwright-report/
>       - test-results/
>     reports:
>       junit: test-results/junit.xml
> ```
>
> **إعدادات `playwright.config.ts` المقترحة:**
> ```typescript
> retries: process.env.CI ? 1 : 0,
> workers: process.env.CI ? 2 : undefined,
> fullyParallel: true,
> timeout: 30_000,
> expect: { timeout: 5_000 },
> ```

### البعد ٧: التقارير

**التقييم العام: أساس جيد يحتاج توسعة**

- **التقارير الحالية:** `html` + `list` — كافية للتطوير المحلي ✅.
- **غياب `junit`** (ملاحظة #31): مطلوب لتكامل GitLab MR widgets و Tuleap. الإضافة بسيطة ولا تكسر الحالي.
- **`report-template.html`:** سليم بنيوياً، RTL صحيح (`dir="rtl"` + `lang="ar"`)، CSS متين مع دعم code blocks بـ LTR. العناصر النائبة (`{{TOTAL}}`, `{{PASSED}}`, إلخ) منطقية وقابلة للتعبئة. لكن القالب ثابت (static HTML) — لا يوجد كود آلي لتعبئته من مخرجات Playwright JSON.

### البعد ٨: تكامل Tuleap

**التقييم العام: تصميم موثق بعناية — يحتاج تأكيد إصدار**

> [!NOTE]
> لم يتم قراءة SKILL.md الكامل لتكامل Tuleap في هذه الجولة بسبب حجم المراجعة. التقييم مبني على البنية الملاحظة وملف `test-case-mapping.csv`.

- آلية `testsuite name = TC_<aid>` وخريطة حالات الربط مصممة بوضوح.
- سلسلة `design-test-cases` (مصفوفة متطلبات → جرد عناصر → جدول تصميم → specs موسومة) متماسكة على الورق.

### البعد ٩: التوثيق

**التقييم العام: غني لكنه يحتاج صيانة**

- **AGENTS.md المزدوج** (ملاحظة #32): النسختان متطابقتان حالياً ✅ (تم التحقق بالمقارنة). لكن الازدواجية خطرة — أي تعديل على واحدة قد يُنسى في الأخرى.
- **framework-api.md مقابل الكود** (ملاحظات #23-25): ثلاثة أسماء دوال خاطئة — الوثيقة تذكر `waitForElementVisible` بينما الاسم الفعلي `waitUntilVisible`. هذا يربك المطورين الجدد.
- **ADR-005, 006, 011 مفقودة:** فجوات في التسلسل غير موثقة — لا يُعرف إن كانت محذوفة عمداً أو ضائعة.
- **TECH_DEBT.md:** 4 أسطر فقط عن الفلترة — لا تعكس الديون الفعلية بعد التحرير من ERP (مثل `retry()` الوهمي، `EnvironmentManager` بدون بيئة افتراضية، الخ).
- **TDs (Technical Decisions):** بنية غير متسقة (TD-001 ملف، TD-002/003 مجلدات فارغة).
- **ترميز العربية:** لم يُلاحظ أي تلف ترميز في الملفات التي تم فحصها ✅.

### البعد ١٠: القابلية للتوسع والصيانة

**التقييم العام: جاهز هيكلياً مع فجوات تشغيلية**

**تتبع خطوات إضافة أول تطبيق (`docs/guides/06-adding-new-module.md`):**
1. ✅ إنشاء `apps/my-app/pages/XxxPage.ts` يرث `BasePage` — سيعمل.
2. ✅ إنشاء `api/XxxApiService.ts` يرث `BaseApiService` — سيعمل (بافتراض أن `BaseApiService` لا يستدعي `Configuration` الذي سيفشل بسبب عدم وجود `environments/qa/config.json`).
3. ⚠️ إضافة project في `playwright.config.ts` — الموجه متاح كتعليق ✅.
4. ❌ **`tsconfig.json`** لا يتضمن `apps/**/*.ts` — ملفات التطبيق لن تُفحص بـ typecheck.
5. ❌ **`Configuration.load()`** سيفشل إن لم يوجد `environments/qa/config.json`.

**نقاط الضعف أمام فريق متعدد المطورين:**
- المصنع يدوي: كل مكون جديد يحتاج تسجيل يدوي في `ComponentFactory` — لا يوجد auto-discovery.
- لا يوجد `eslint-plugin-import` لفرض قواعد الاستيراد — أي مطور قد يستورد من `@playwright/test` مباشرة.
- `example.spec.ts` هو القالب الوحيد وهو نفسه يخالف القواعد — المطور الجديد سينسخ الأخطاء.

---

## ٤. نتائج أوامر التحقق الفعلية

### `npm run typecheck`
```
> zk-qa-automation-framework@1.0.0 typecheck
> tsc --noEmit

error TS2688: Cannot find type definition file for 'node'.
  The file is in the program because:
    Entry point of type library 'node' specified in compilerOptions
```
**التحليل:** `@types/node` معرّف في `devDependencies` لكن يبدو أن `node_modules` غير مثبت (لم يتم تشغيل `npm install`).

### `npx playwright test --list`
```
Error: Cannot find module '@playwright/test'
```
**التحليل:** نفس السبب — `node_modules` غير مثبت.

### `npm test`
لم يُنفذ بسبب فشل الأمر السابق بنفس السبب.

> [!WARNING]
> لا يمكن تأكيد صحة الكود بدون تثبيت الحزم أولاً (`npm install`). الأخطاء المرصودة هي أخطاء بيئة وليست أخطاء كود.

---

## ٥. خارطة الإصلاح مرتبة بالأولوية

### المرحلة ١ — حظر الإنتاج (الأسبوع الأول)

| الترتيب | الملاحظات | السبب | الجهد |
|---------|-----------|-------|-------|
| 1 | #1, #3, #4 | النجاح الزائف: اقلب `strictMode` الافتراضي وامنع mock tokens الصامتة | S (ساعتان) |
| 2 | #5 | أزل `waitForTimeout(300)` الثلاثة — تخالف القاعدة الأساسية | S (ساعة) |
| 3 | #7, #8 | أنشئ `environments/qa/config.json` مثال + اجعل `Configuration` lazy | S (ساعة) |
| 4 | #19 | أضف `apps/**/*.ts` إلى `tsconfig.json include` | S (دقائق) |

### المرحلة ٢ — البنية التحتية (الأسبوع الثاني)

| الترتيب | الملاحظات | السبب | الجهد |
|---------|-----------|-------|-------|
| 5 | #2 | أنشئ `.gitlab-ci.yml` | M (يوم) |
| 6 | #22 | ثبّت ESLint + Prettier + Husky | M (يوم) |
| 7 | #21, #31 | أضف `retries/workers/timeout` و `junit` reporter | S (ساعة) |

### المرحلة ٣ — الاتساق المعماري (الأسبوع الثالث)

| الترتيب | الملاحظات | السبب | الجهد |
|---------|-----------|-------|-------|
| 8 | #12, #11 | وحّد أسلوب بناء المكونات في Factory | M (يومان) |
| 9 | #6 | سجّل المكونات المفقودة في ComponentFactory | S (ساعة) |
| 10 | #28 | ادمج `Automation` و `AutomationLocator` (تنفيذ ADR-012/013) | M (يوم) |
| 11 | #13, #14 | استخرج `ExecutionPipeline` مشترك | M (يوم) |
| 12 | #18 | أصلح `action.toString()` hack | S (ساعة) |

### المرحلة ٤ — التوثيق والتحسينات (الأسبوع الرابع)

| الترتيب | الملاحظات | السبب | الجهد |
|---------|-----------|-------|-------|
| 13 | #23-25 | صحّح framework-api.md | S (ساعة) |
| 14 | #15-16 | أصلح `example.spec.ts` ليكون قالباً نظيفاً | S (ساعة) |
| 15 | #26, #27, #34, #35 | نظّف ADR + TECH_DEBT + TDs | S (ساعتان) |
| 16 | #29, #30 | حسّن Logger + نفّذ retry حقيقي | M (يومان) |

---

## ٦. أسئلة تحتاج تأكيدًا

> [!NOTE]
> العناصر التالية لم أستطع التحقق منها بشكل قاطع من الكود — تحتاج تأكيداً من الفريق:

1. **هل `node_modules` مثبتة على الجهاز فعلاً؟** فشل typecheck و test --list قد يكون بسبب عدم تشغيل `npm install` وليس خطأ في الكود.

2. **هل يوجد مجلد `environments/` محلياً وغير مُتعقب بـ Git؟** `EnvironmentManager` يبحث عنه، و `.gitignore` لم يُفحص بعمق لاحتمال استثنائه.

3. **هل ADR-005, 006, 011 حُذفت عمداً أم ضاعت؟** الفجوات في الترقيم قد تكون مقصودة (أفكار مرفوضة) أو حذف غير مقصود.

4. **هل `tests/demo/` يحتوي ملفات؟** لم يظهر في مسح الملفات — قد يكون مجلداً فارغاً أو غير موجود.

5. **ما إصدار Tuleap المستخدم؟** مهارة `tuleap-sync` تعتمد على REST API endpoints محددة قد تختلف بين الإصدارات.

6. **هل سلوك `strictMode=false` الافتراضي في `ApiClient` مقصود لمرحلة التطوير فقط؟** إذا كان مؤقتاً فيجب توثيقه صراحة وتحويله إلى `true` قبل أول تطبيق حقيقي.

7. **هل `dotenv` مقصود غيابه؟** `.env.example` موجود لكن لا يوجد حزمة `dotenv` ولا كود يقرأ `.env` — هل الخطة الاعتماد على CI/CD Variables فقط؟

---

## ٧. تذكير ختامي بالقيود

> [!CAUTION]
> **هذه المراجعة كانت قراءة فقط (READ-ONLY).**
> - لم يُعدّل أي ملف في المستودع.
> - لم يُنفذ أي `git commit` أو `git push` أو إنشاء branches.
> - لم تُثبت أي حزمة جديدة.
> - كل اقتراح إصلاح مكتوب كنص داخل هذا التقرير فقط.
> - الأوامر المُنفذة: `npm run typecheck`، `npx playwright test --list` (نتائج فعلية موثقة أعلاه).
> - لم تُنسخ أي بيانات اعتماد أو tokens — اكتشاف أمني واحد (#33) مذكور بموقعه فقط.
