import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../core/base/BaseComponent';
import { Automation } from '../../core/automation/Automation';

/**
 * LookupComponent
 * 
 * يمثل حقل إكمال تلقائي (p-autoComplete) أو قائمة بحث.
 * يعتمد على استراتيجية Derived Automation IDs للابتعاد التام عن PrimeNG CSS Classes.
 */
export class LookupComponent extends BaseComponent {

    protected readonly baseAutomationId: string;

    /**
     * @param page كائن Playwright Page
     * @param automationId المعرّف الأساسي للمكون (مثال: 'vendor-lookup')
     */
    constructor(page: Page, automationId: string) {
        // نمرر حقل الإدخال الأساسي ليكون هو الـ locator الرئيسي للمكون (لأنه المدخل الرئيسي)
        // أو يمكننا تمرير المعرف العام للمكون ككل
        super(page, Automation.byId(automationId));
        this.baseAutomationId = automationId;
    }

    /** @internal Semantic Locator */
    public input(): Locator {
        return this.page.locator(Automation.byId(`${this.baseAutomationId}-input`));
    }

    /** @internal Semantic Locator */
    public button(): Locator {
        return this.page.locator(Automation.byId(`${this.baseAutomationId}-btn`));
    }

    /** @internal Semantic Locator */
    public item(text: string): Locator {
        return this.page.locator(Automation.byId(`${this.baseAutomationId}-item-${text.toLowerCase().replace(/\s+/g, '-')}`));
    }

    /**
     * إدخال النص في حقل البحث لطلب النتائج من السيرفر.
     * @param term النص المراد البحث عنه
     */
    public async search(term: string): Promise<void> {
        await this.execute(async () => {
            const inputLocator = this.page.locator(Automation.byId(`${this.baseAutomationId}-input`));
            await inputLocator.waitFor({ state: 'visible' });
            
            // تنظيف الحقل قبل الكتابة
            await inputLocator.clear();
            // استخدام type أو fill لمحاكاة الكتابة واستدعاء الأحداث في PrimeNG
            // fill هو الأسرع والأكثر موثوقية في Playwright، ولكن في الـ AutoComplete أحياناً type(term, { delay }) تكون أفضل
            // سنستخدم fill ونتأكد من استجابة PrimeNG
            await inputLocator.fill(term);

            // انتظار تحميل النتائج (إن وجد مؤشر للتحميل أو فقط ننتظر ظهور خيار واحد على الأقل)
            // الانتظار الفعلي سيتم في دالة selectResult ولكن يمكننا إضافة انتظار احتياطي للـ loader لو استدعى الأمر
        });
    }

    /**
     * اختيار نتيجة بناءً على النص.
     * @param text النص المطابق للنتيجة المراد النقر عليها
     */
    public async selectResult(text: string): Promise<void> {
        await this.execute(async () => {
            const itemLocator = this.page.locator(Automation.byId(`${this.baseAutomationId}-item`));
            
            // ننتظر حتى تظهر النتائج
            await itemLocator.first().waitFor({ state: 'attached' });
            
            // اختيار الخيار المطابق تماماً
            const targetItem = itemLocator.filter({ hasText: text });
            await targetItem.first().click(); // النقر على أول عنصر يطابق النص
        });
    }

    /**
     * دالة مساعدة مركبة للبحث والاختيار مباشرة.
     * @param term النص المبحوث عنه
     * @param text النص المراد اختياره من القائمة (اختياري، إن لم يمرر سيختار أول نتيجة معروضة)
     */
    public async searchAndSelect(term: string, text?: string): Promise<void> {
        await this.search(term);
        
        await this.execute(async () => {
            const itemLocator = this.page.locator(Automation.byId(`${this.baseAutomationId}-item`));
            await itemLocator.first().waitFor({ state: 'attached' });

            if (text) {
                const targetItem = itemLocator.filter({ hasText: text });
                await targetItem.first().click();
            } else {
                await itemLocator.first().click();
            }
        });
    }

    /**
     * استرجاع جميع النصوص للنتائج المعروضة حالياً.
     */
    public async getResults(): Promise<string[]> {
        return await this.execute(async () => {
            const itemLocator = this.page.locator(Automation.byId(`${this.baseAutomationId}-item`));
            
            // نتأكد من ظهور النتائج قبل القراءة
            // إذا لم توجد نتائج فيمكننا تجاهل الخطأ وإرجاع قائمة فارغة
            try {
                await itemLocator.first().waitFor({ state: 'attached', timeout: 3000 });
                const texts = await itemLocator.allInnerTexts();
                return texts.map(t => t.trim());
            } catch (e) {
                // إذا لم تظهر أي نتيجة بعد المهلة، نرجع قائمة فارغة
                return [];
            }
        });
    }

    /**
     * مسح القيمة وإلغاء التحديد.
     */
    public async clear(): Promise<void> {
        await this.execute(async () => {
            const clearIcon = this.page.locator(Automation.byId(`${this.baseAutomationId}-clear`));
            
            if (await clearIcon.isVisible()) {
                await clearIcon.click();
            } else {
                // إذا لم يوجد زر تفريغ، نقوم بمسح الحقل يدوياً
                const inputLocator = this.page.locator(Automation.byId(`${this.baseAutomationId}-input`));
                if (await inputLocator.isVisible()) {
                    await inputLocator.clear();
                }
            }
        });
    }

    /**
     * قراءة القيمة الحالية في حقل البحث.
     */
    public async getValue(): Promise<string> {
        return await this.execute(async () => {
            const inputLocator = this.page.locator(Automation.byId(`${this.baseAutomationId}-input`));
            await inputLocator.waitFor({ state: 'attached' });
            return await inputLocator.inputValue();
        });
    }

    /**
     * التحقق من حالة التعطيل.
     */
    public async isDisabled(): Promise<boolean> {
        return await this.execute(async () => {
            const inputLocator = this.page.locator(Automation.byId(`${this.baseAutomationId}-input`));
            await inputLocator.waitFor({ state: 'attached' });
            
            const disabledAttr = await inputLocator.getAttribute('disabled');
            const ariaDisabledAttr = await inputLocator.getAttribute('aria-disabled');
            
            return disabledAttr !== null || ariaDisabledAttr === 'true';
        });
    }
}
