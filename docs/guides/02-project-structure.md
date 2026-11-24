# الدليل ٢: هيكل المشروع

```
zk_QA_AutomationFramework/
├── framework/                  ← محرك الإطار (لا تُعدّل إلا لهدف واضح)
│   ├── components/             ← 18 مكوّن UI جاهزًا (button, grid, dialog, tabs...)
│   └── core/
│       ├── api/                ← ApiClient, BaseApiService, AuthTokenManager, ApiResponseValidator
│       ├── automation/         ← Automation (بناء المحددات الدلالية) + AutomationLocator
│       ├── base/               ← BaseComponent, BasePage, BaseFlow
│       ├── config/             ← EnvironmentManager, Configuration, ExecutionContext
│       ├── data/providers/     ← JsonTestDataProvider (الاختبارات الموجهة بالبيانات)
│       ├── factory/            ← ComponentFactory (نقطة الوصول للمكونات)
│       ├── fixtures/           ← test (الـ fixtures المخصصة — مثل network)
│       ├── locators/           ← AutomationLocator
│       ├── logger/             ← Logger (info/warn/error)
│       ├── network/            ← NetworkManager (اعتراض الشبكة)
│       └── waits/              ← WaitUtils (الانتظار الشرطي — ممنوع الـ Hard Wait)
├── tests/                      ← اختبارات الإطار + example.spec.ts (قالب البداية)
├── docs/
│   ├── guides/                 ← أدلة الفريق بالعربية (أنت هنا)
│   ├── adr/                    ← قرارات معمارية موثقة
│   ├── standards/              ← معايير الكود والتسمية والمحددات
│   ├── explanation/            ← شروحات معمارية
│   └── tutorials/              ← دروس تعليمية
├── .agents/skills/             ← مهارات جاهزة لوكلاء الذكاء الاصطناعي
├── playwright.config.ts        ← إعداد Playwright
└── package.json
```

## القاعدة التنظيمية الأهم
- **كود تطبيقك لا يُكتب داخل `framework/`.** عند البدء بمشروع تطبيق فعلي، أنشئ مجلد `apps/<اسم-التطبيق>/` بنفس النمط الموثق في [docs/standards/NAMING_CONVENTION.md](../standards/NAMING_CONVENTION.md):
  - `apps/<app>/pages/` — صفحات Page Objects
  - `apps/<app>/api/` — خدمات API + Schemas
  - `apps/<app>/flows/` — التدفقات متعددة الخطوات
  - `apps/<app>/data/` — ملفات JSON للبيانات
  - `apps/<app>/tests/` — ملفات `.spec.ts`

- ثم أضف مشروعًا جديدًا في `playwright.config.ts` يوجّه إلى مجلد اختباراتك (القالب موجود كتعليق داخل الملف).
