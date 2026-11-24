# برومبت تنفيذ ملاحظات المراجعة الهندسية

> **الاستخدام:** أعطِ هذا الملف كاملًا للوكيل داخل جذر المستودع (Antigravity أو ما يعادله).
> **الأساس:** [engineering-review-report.md](engineering-review-report.md) بعد تدقيقه في [engineering-review-audit.md](engineering-review-audit.md).
> **حالة التنفيذ قبل البدء:** المستودع نظيف، لا شيء منفذ من الملاحظات بعد.

---

## الدور والسياق

أنت مهندس أتمتة اختبارات أول (Principal Automation Engineer) تعمل على مستودع
`zk_QA_AutomationFramework` — إطار أتمتة اختبارات Playwright + TypeScript معماري
بـ Clean Architecture وData-Driven POM، مع 17 مهارة وكيل تحت `.agents/skills/`
ودليل فريق عربي تحت `docs/guides/`. المطلوب: تنفيذ ملاحظات المراجعة الهندسية
المؤكدة فقط، على مراحل، مع بوابة تحقق بعد كل مرحلة.

## قواعد صارمة (لا تُخترق)

1. **نفّذ الملاحظات المؤكدة فقط** المذكورة أدناه. الملاحظات المرفوضة في قسم
   "ممنوع تنفيذها" لا تُنفَّذ ولا يُلمس بسببها أي ملف.
2. **لا تسرب بيانات:** لا تكتب أي token أو كلمة مرور في أي ملف. الأمثلة تستخدم
   placeholders (`<username>`, `***`).
3. **التزام صغير لكل إصلاح:** التزام Git منفصل لكل مجموعة إصلاح مترابطة، برسالة
   Conventional Commits (`fix(api): ...`, `refactor(core): ...`,
   `docs(reference): ...`, `chore(ci): ...`).
4. **لا دفع (push):** التزم محليًا على فرع `fix/engineering-review-2026-11-24`.
   الدفع قرار المستخدم بعد مراجعته.
5. **بوابة التحقق** بعد كل مرحلة، ولا تنتقل للمرحلة التالية إلا بنجاحها:
   ```bash
   npm run typecheck
   npx playwright test --list
   npm test
   ```
   سجل نتيجة الأوامر الثلاثة (نجاح/فشل + المخرجات الملخصة) في تقرير التنفيذ.

## ممنوع تنفيذها (ملاحظات مرفوضة بالتدقيق — لا تلمس بسببها شيئًا)

| # | ملاحظة التقرير | سبب الرفض |
|---|---|---|
| #9 | فشل `npm run typecheck` (TS2688) | خطأ بيئة المحرّك (node_modules غير مثبتة عنده) — في بيئة مثبتة ينجح بصفر أخطاء |
| #10 | فشل `npx playwright test --list` | نفس السبب |
| #20 | مسار بلا return في `execute<T>` | لا تتجدد: `tsc --noEmit` يمر نظيفًا مع `strict: true` |

---

## المرحلة 1 — حظر النتائج الزائفة (الأولوية القصوى)

### 1.1 الملاحظة #1 — عكس افتراضي `strictMode`
- **الدليل:** `framework/core/api/ApiClient.ts:11` — `defaultStrictMode: boolean = false`
- **التنفيذ:** اجعل الافتراضي `true` في `ApiClient` وفي `BaseApiService`. الـ
  offline mock (`getOfflineMockData` في `framework/core/api/BaseApiService.ts`)
  لا يعمل إلا عند تمرير `{ strictMode: false }` صراحةً من المتصل.
- **القبول:** اختبار API بلا خادم يفشل افتراضيًا برسالة واضحة، وينجح فقط مع
  `strictMode: false` صريح. حدّث `tests/` و`.agents/skills/write-api-test/SKILL.md`
  (قسم "Critical trap") ليعكسا السلوك الجديد.

### 1.2 الملاحظة #3 — mock token صامت عند فشل المصادقة
- **الدليل:** `framework/core/api/ApiClient.ts` داخل `login()` — مسار catch
  يعيد `mock_jwt_token_${role}` بلا أي تحذير.
- **التنفيذ:** أضف `Logger.warn` قبل إرجاع أي توكن mock، وميّز القيمة
  (مثلاً بادئة موحدة) بحيث يمكن كشفها في التقارير.
- **القبول:** كل إنتاج توكن mock يظهر في مخرجات التشغيل بتحذير صريح.

### 1.3 الملاحظة #4 — `getHeaders` يصنع توكن زائف
- **الدليل:** `framework/core/api/BaseApiService.ts:48-49` —
  `this.tokenManager.getToken(targetRole) || \`mock_jwt_token_${targetRole.toLowerCase()}\``
- **التنفيذ:** عند غياب التوكن الحقيقي: ارمِ `FrameworkException` (من
  `framework/core/exceptions/FrameworkException.ts`) ما لم يكن وضع offline
  المفعّل صراحةً (نفس شرط 1.1). في وضع offline يُستخدم التوكن الوهمي مع
  `Logger.warn`.
- **القبول:** طلب بلا توكن حقيقي في الوضع الصارم يرمي استثناء برسالة تسمي الدور
  الناقص؛ لا مسار صامت.

### 1.4 الملاحظة #5 — حظر `waitForTimeout`
- **الدليل:** `framework/components/menu/MenuComponent.ts:126`؛
  `framework/components/tree/TreeNodeComponent.ts:39,54` (الثانية مع تعليق
  `// Wait for potential animation/lazy load`).
- **التنفيذ:** استبدل بانتظار شرطي: `locator.waitFor({ state: 'visible' })`
  أو `expect(...).toBeVisible()` عبر أنماط `WaitUtils`
  (`framework/core/waits/WaitUtils.ts`) أو auto-waiting لـ Playwright.
- **القبول:** `grep -rn "waitForTimeout" framework/` → صفر نتائج.

### 1.5 الملاحظة #7 — غياب ملف البيئة
- **الدليل:** `framework/core/config/EnvironmentManager.ts` (~سطر 33) يرمي
  `Environment configuration not found`؛ مجلد `environments/` غير موجود أصلًا.
- **التنفيذ:** أنشئ `environments/qa/config.json` نموذجيًا (بنية مطابقة
  لواجهة `Environment` في `framework/core/contracts/Environment.ts`، بقيم
  placeholder بلا أسرار) + سلوك fallback موثق (اسم بديل أو رسالة تشخيص أوضح).
- **القبول:** `npm test` يعمل دون استثناء إعدادات بعد الاستنساخ النظيف.

### 1.6 الملاحظة #8 — `Configuration` eager static
- **الدليل:** `framework/core/config/Configuration.ts:12-13` —
  `private static readonly environment = EnvironmentManager.load();`
- **التنفيذ:** حوّل التحميل إلى lazy (getter داخلي أو دالة تُستدعى عند أول
  وصول) بحيث لا يفشل `import` وحده إن غاب ملف البيئة.
- **القبول:** استيراد `Configuration` بلا ملف بيئة لا يرمي؛ الاستخدام الأول
  هو الذي يفشل برسالة واضحة.

### 1.7 الملاحظة #19 — `tsconfig` بلا `apps/**`
- **الدليل:** `tsconfig.json` — `include` فيه `framework/**`, `tests/**`,
  `playwright.config.ts` فقط.
- **التنفيذ:** أضف `"apps/**/*.ts"` إلى `include` (مطلوب أيضًا للخطوة 4 في
  مهارة `scaffold-module`).
- **القبول:** `npm run typecheck` يظل ناجحًا بعد الإضافة.

### 1.8 قرار dotenv (سؤال مفتوح من التدقيق)
لا يوجد أي كود يقرأ `.env` (`dependencies` فيها `zod` فقط؛ `EnvironmentManager`
يقرأ `process.argv` و`config.json`). **لا تنفذ اختيارًا من نفسك:** طبّق فقط
توثيق الحالتين في `docs/how-to/run-tests-effectively.md`، وسؤال المستخدم:
إضافة `dotenv` أم الاعتماد على GitLab CI/CD Variables حصريًا؟

**بوابة المرحلة 1:** الأوامر الثلاثة ناجحة + `grep -rn "waitForTimeout" framework/`
فارغ + التزامات منفصلة: `fix(api): enforce strict mode by default` ·
`fix(components): replace hard waits with conditional waits` ·
`fix(config): ship qa config template and lazy Configuration` ·
`chore(tsconfig): include apps tree`.

---

## المرحلة 2 — CI والبوابات الآلية

### 2.1 الملاحظة #2 — إنشاء `.gitlab-ci.yml`
- **التنفيذ:** نفّذ اقتراح التقرير (مراحل `install → typecheck → test`
  مع junit artifact) أو قالب مهارة `.agents/skills/gitlab-ci-setup/SKILL.md`
  (صورة `node:20-bookworm`، كاش `npm` ومتصفحات Playwright عبر
  `PLAYWRIGHT_BROWSERS_PATH`، `artifacts: when: always`).
- **القبول:** الملف موجود في الجذر، و`typecheck` مرحلة مستقلة فاشلة على فشل tsc.

### 2.2 الملاحظة #31 — junit reporter
- **التنفيذ:** في `playwright.config.ts` أضف
  `['junit', { outputFile: 'test-results/junit.xml' }]` إلى `reporter`.
  (مطلوب أيضًا لمهارتي `tuleap-sync` و`gitlab-ci-setup`.)
- **القبول:** `npm test` ينتج `test-results/junit.xml` سليمًا (اسم suite واحد
  على الأقل يطابق نمط `TC_<aid>` عند وجوده).

### 2.3 الملاحظة #21 — إعدادات استقرار
- **التنفيذ:** أضف `timeout`, `retries` (1 في CI عبر `process.env.CI`),
  `workers/fullyParallel` الصريحين لكل project في `playwright.config.ts`.
- **القبول:** الإعدادات ظاهرة وموثقة بتعليق عربي مختصر يشرح كل قيمة.

### 2.4 الملاحظة #22 — أدوات الجودة
- **التنفيذ:** ESLint (flat config) + Prettier + husky بحد أدنى:
  pre-commit يشغّل `npm run typecheck` وlint على الملفات المتغيرة.
- **القبول:** `npx eslint .` يعمل بلا أخطاء على الشجرة الحالية (أو تحذيرات
  معلومة ومقيدة في القائمة).

**بوابة المرحلة 2:** الأوامر الثلاثة + `npx eslint .` ناجحة + التزامات:
`chore(ci): add gitlab pipeline` · `chore(config): junit reporter and stability settings` ·
`chore(tooling): eslint prettier husky`.

---

## المرحلة 3 — الاتساق المعماري

### 3.1 الملاحظة #6 — تسجيل المكونات الناقصة
- **الدليل:** `framework/core/factory/ComponentFactory.ts` يسجل 13 مكوّنًا فقط؛
  لا `menu(` ولا `tree(` ولا `notification(` ولا `toolbar(` رغم وجود
  `framework/components/menu/` و`tree/` و`notification/` و`ToolbarComponent.ts`.
- **التنفيذ:** سجّل الأربعة بنفس نمط Factory (`Automation.byId`).
- **القبول:** `grep -cE "new .*Component\(" ComponentFactory.ts` = 17؛
  `npm run typecheck` و`npm test` ناجحان.

### 3.2 الملاحظتان #11+#12 — توحيد عقد المكونات
- **الدليل:** `framework/components/button/ButtonComponent.ts:13-15` يقبل
  `string | Locator` ويتفرع داخليًا؛ الـ Factory متسق لكن العقد غير موحد بين
  المكونات.
- **التنفيذ:** وحّد العقد: كل مكوّن يستقبل `automationId: string` ويبني
  محدده داخليًا عبر `Automation` — لا `string | Locator` ولا تفريع داخل
  constructors المكونات (اجتياز M عبر 18 مكونًا).
- **القبول:** `grep -rn "string | Locator" framework/components/` → صفر نتائج.

### 3.3 الملاحظة #28 — دمج `Automation`/`AutomationLocator`
- **الدليل:** كلاهما فيه `byId`؛ الأول بلا فحص فراغ والثاني يرمي
  `FrameworkException`. راجع `docs/adr/ADR-012-Automation-Locator-Merge.md`
  و`ADR-013` قبل التنفيذ.
- **التنفيذ:** نقطة دخول واحدة (الصارمة) مع فحص فراغ إلزامي؛ أبقِ إعادة توجيه
  مؤقتة إن لزم ثم نظّف.
- **القبول:** استخدام واحد فقط لإنشاء محددات الأتمتة في كل `framework/`؛
  الملف الفارغ #17 (`framework/core/automation/AutomationContracts.ts` —
  `wc -c` = 0) يُحذف في نفس الالتزام.

### 3.4 الملاحظتان #13+#14 — توحيد خط التنفيذ
- **الدليل:** `execute/retry/handleError` مكررة بين
  `framework/core/base/BasePage.ts:345` و`framework/core/base/BaseComponent.ts:308`؛
  و`BasePage` لا يرث `BaseComponent` ولا يشاركه واجهة.
- **التنفيذ:** استخرج خط التنفيذ المشترك (BaseComponent أو خدمة موحدة) وأضف
  واجهة `IExecutable`؛ ألغِ التكرار.
- **القبول:** تعريف واحد لـ `execute/retry/handleError` في `framework/`.

### 3.5 الملاحظة #18 — إصلاح `action.toString()` hack
- **الدليل:** `framework/core/api/BaseApiService.ts:147` —
  `['post','put'].some(m => action.toString().includes(\`.${m}\`))`.
- **التنفيذ:** مرر نوع العملية معاملًا صريحًا إلى `safeExecute`
  (`method: 'get'|'post'|'put'|'delete'`) واحكم عليه مباشرة.
- **القبول:** صفر استخدام لـ `toString()` في `framework/core/api/`.

### 3.6 الملاحظة #30 — `retry` وهمي
- **الدليل:** `framework/core/base/BaseComponent.ts:~339` —
  `protected async retry<T>(action) { return await action(); }` — تنفيذ واحد
  بلا حلقة.
- **التنفيذ:** إما retry حقيقي (عدد جولات + back-end بسيط قابل للضبط) أو حذف
  الدالة واستبدال استدعاءاتها — اختر الأنسب لسلوك المكونات الحالي ونفّذه.
- **القبول:** لا دالة باسم retry تُنفّذ مرة واحدة؛ سلوك موثق بتعليق.

### 3.7 الملاحظة #29 — `Logger`
- **الدليل:** `framework/core/logger/Logger.ts` — `info/warn/error` فقط بلا
  timestamps.
- **التنفيذ:** أضف timestamp ISO + مستوى `debug`، وأبقِ الواجهة الثابتة.
- **القبول:** كل سجلات الإطار تحمل وقتًا.

**بوابة المرحلة 3:** الأوامر الثلاثة ناجحة + التزامات:
`refactor(factory): register missing components` · `refactor(components): unify component contract` ·
`refactor(core): merge automation locator entry point` · `refactor(base): extract shared execution pipeline` ·
`fix(api): pass explicit http method to safeExecute`.

---

## المرحلة 4 — التوثيق

### 4.1 الملاحظتان #15+#16 — تطهير القالب
- **الدليل:** `tests/example.spec.ts:54` — `await expect(page.locator('[data-automation-id="login-username"]')).toBeVisible();`
  (locator مباشر) و`:20` — `import('@playwright/test').Page` (type-only).
- **التنفيذ:** أعد كتابة القالب على نمط مهارة `write-ui-test` (Page Object +
  `assert()` + استيراد من `framework/core/fixtures/test.ts` + نوع من الإطار).
- **القبول:** صفر `page.locator` في `tests/example.spec.ts`، وصفر مرجع
  `@playwright/test` مباشر فيه.

### 4.2 الملاحظات #23–#25 — مطابقة `framework-api.md` للكود
- **الدليل:** `docs/reference/framework-api.md:10-12` يذكر
  `waitForElementVisible`/`waitForNetworkIdle`/`waitForElementEnabled` — الفعلي
  في `framework/core/waits/WaitUtils.ts`: `waitUntilVisible` (L36)، `waitForEnabled`
  (L62)، ولا مقابل لـ NetworkIdle.
- **التنفيذ:** صحّح الأسماء؛ لـ NetworkIdle: احذف السطر أو وثّق أنه غير متاح.
- **القبول:** كل دالة موثقة في `framework-api.md` موجودة بنفس التوقيع في الكود.

### 4.3 الملاحظة #33 — مثال كلمة المرور المحظور
- **الدليل:** `docs/standards/FRAMEWORK_RULES.md:94` — `password = "123456"`.
- **التنفيذ:** استبدله بـ placeholder واضح (`"***"` أو `<password>`).
- **القبول:** `grep -rn "123456" docs/` → صفر نتائج.

### 4.4 الملاحظة #36 — ذكر ERP المتبقي
- **الدليل:** `framework/core/automation/AutomationAttribute.ts:3` —
  «بين منصة الـ ERP ومنصة الأتمتة».
- **التنفيذ:** صياغة محايدة («بين منصة الاختبار ومنصة الأتمتة»).
- **القبول:** `grep -rn "ERP" framework/` → صفر نتائج.

### 4.5 الملاحظتان #26+#27+#34+#35 — ترميم التوثيق
- **الدليل:** `docs/adr/` بلا ADR-005/006/011 وبملفي ADR-013؛
  `docs/adr/TECH_DEBT.md` 4 أسطر عن الفلترة فقط؛ `docs/TDs/TD-002_GridComponent/`
  و`TD-003/` مجلدان (تحتاج تأكيد فراغهما بـ `ls` قبل الحذف).
- **التنفيذ:** (أ) أضف `docs/adr/adr-registry.md` يوثق الفجوات وحالتها.
  (ب) أعد كتابة `TECH_DEBT.md` ليغطي المديونية المتبقية بعد التنفيذ (أسطر
  `grep TODO/FIXME` + ديون المحددات من سجل `locator-debt` إن وُجد).
  (ج) وحّد بنية TDs (ملف لكل TD) واحذف المجلدات الفارغة بعد تأكيد فراغها.
- **القبول:** سجل ADR موجود ومطابق للقائمة الفعلية؛ TECH_DEBT يعكس الواقع.

### 4.6 الملاحظة #32 — ازدواجية AGENTS.md
- **الدليل:** `diff AGENTS.md .agents/AGENTS.md` → IDENTICAL حاليًا.
- **التنفيذ:** اجعل الجذر المصدر الوحيد ووثّق قاعدة المزامنة (سطر في
  `docs/CONTRIBUTING.md` + فحص تطابق في pre-commit إن أمكن).
- **القبول:** قاعدة موثقة؛ التزامان متطابقان بعد كل تعديل.

**بوابة المرحلة 4 (النهائية):** الأوامر الثلاثة ناجحة + فحوصات القبول أعلاه +
تقرير تنفيذ `docs/reviews/2026-11-24-engineering-review/IMPLEMENTATION-LOG.md`
يحوي: لكل ملاحظة — الحالة (منفذة/مرفوضة/مؤجلة بقرار)، الالتزام الذي نفذها،
نتائج الفحوصات. التزامات: `docs(reference): sync framework api docs with code` ·
`docs(standards): sanitize example credentials` · `docs(adr): registry and tech debt refresh`.

## ما بعد التنفيذ
أنشئ MR من فرع `fix/engineering-review-2026-11-24` إلى `main` (عبر مهارة
`mr-workflow`)، بوصف عربي يلخص المراحل الأربع ونتائج البوابات، واربط تقرير
المراجعة الأصلي وتقرير التدقيق وتقرير التنفيذ في الوصف.
