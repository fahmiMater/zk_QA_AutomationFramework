# كيفية إنشاء مكون واجهة مستخدم جديد (UI Component)

في بنية إطار الأتمتة لدينا، تُمثل **المكونات (Components)** عناصر واجهة المستخدم القابلة لإعادة الاستخدام (مثل الجداول Grid، النوافذ المنبثقة Dialogs، القوائم المنسدلة Dropdowns وغيرها). الهدف منها هو تغليف منطق تفاعل Playwright مع هذه العناصر وعزله تماماً عن منطق الأعمال (Business Logic) الخاص بالاختبارات.

يشرح هذا الدليل كيفية إنشاء مكون جديد بطريقة صحيحة ومطابقة لـ CODING_STANDARDS الخاصة بنا.

## القواعد الأساسية للمكونات (Components Rules)
- **مسؤولية واحدة (Single Responsibility):** المكون يجب أن يعالج أداة واجهة مستخدم واحدة فقط (مثلاً: إما الجدول، أو النافذة، وليس كلاهما معاً).
- **لا منطق أعمال (No Business Logic):** يجب ألا يتخذ المكون قرارات متعلقة بسير العمل (Flows). هو فقط يقوم بأفعال مثل "انقر" أو "اقرأ النص".
- **استخدام WaitUtils:** لا تستخدم `page.waitForTimeout()` أبداً.
- **التسمية:** يجب أن ينتهي اسم الكلاس واسم الملف بكلمة `Component` (مثل: `GridComponent.ts`).

## خطوة بخطوة: إنشاء `ToolbarComponent`

لنفترض أن النظام يحتوي على شريط أدوات (Toolbar) يتكرر في عدة شاشات ونحتاج لبناء مكون له.

### 1. أنشئ الملف
قم بإنشاء ملف جديد تحت مسار المكونات المخصص في المشروع (مثلاً: `framework/components/ToolbarComponent.ts`).

### 2. اكتب كود المكون

```typescript
import { Page, Locator } from '@playwright/test';
// استيراد WaitUtils إذا لزم الأمر

/**
 * يمثل مكون شريط الأدوات (Toolbar).
 * يقدم دوال للتفاعل مع أزرار الحفظ، الإلغاء، وغيرها.
 */
export class ToolbarComponent {
    private readonly page: Page;
    private readonly container: Locator;

    // تهيئة الاعتمادات في المشيّد (Constructor)
    constructor(page: Page) {
        this.page = page;
        // الاعتماد على Automation Locator لتحديد الحاوية الأساسية
        this.container = page.locator('[data-automation-id="main-toolbar"]');
    }

    /**
     * النقر على زر الحفظ
     */
    public async clickSave(): Promise<void> {
        const saveBtn = this.container.locator('[data-automation-id="toolbar-save-btn"]');
        await saveBtn.click();
    }

    /**
     * النقر على زر الإلغاء
     */
    public async clickCancel(): Promise<void> {
        const cancelBtn = this.container.locator('[data-automation-id="toolbar-cancel-btn"]');
        await cancelBtn.click();
    }
    
    /**
     * التحقق مما إذا كان زر الحفظ مفعلاً
     */
    public async isSaveEnabled(): Promise<boolean> {
        const saveBtn = this.container.locator('[data-automation-id="toolbar-save-btn"]');
        return await saveBtn.isEnabled();
    }
}
```

### 3. استخدام المكون في الـ Page Object
الآن يمكن استخدام هذا المكون داخل كلاسات الصفحات (Pages) الخاصة بالتطبيق:

```typescript
import { ToolbarComponent } from '../../../framework/components/ToolbarComponent';

export class InvoicePage {
    public readonly toolbar: ToolbarComponent;

    constructor(page: Page) {
        // تمرير الـ page للمكون
        this.toolbar = new ToolbarComponent(page);
    }
    
    // ... دوال الصفحة الأخرى
}
```

### 4. استخدامه في الاختبار
```typescript
test('يجب حفظ الفاتورة بنجاح', async ({ page }) => {
    const invoicePage = new InvoicePage(page);
    
    // التفاعل مع المكون بكل سهولة وأناقة
    await invoicePage.toolbar.clickSave();
});
```

من خلال هذا النمط، تم إخفاء تفاصيل Playwright (الـ Locators وعمليات النقر) داخل المكون، مما يجعل الاختبار سهل القراءة والصيانة!
