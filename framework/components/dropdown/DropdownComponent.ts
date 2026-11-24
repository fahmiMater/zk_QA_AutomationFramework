import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../core/base/BaseComponent';
import { DropdownAssertions } from '../../core/assertions/components/dropdown/DropdownAssertions';
import { Automation } from '../../core/automation/Automation';

/**
 * DropdownComponent
 * 
 * يمثل قائمة منسدلة تعتمد على PrimeNG (p-dropdown).
 * يطبق استراتيجية (Derived Automation IDs) حيث يعتمد حصرياً على
 * الـ automationId لتحديد عناصره الداخلية بدلاً من الاعتماد على CSS Classes الخاصة بـ PrimeNG.
 */
export class DropdownComponent extends BaseComponent {

    private readonly assertions: DropdownAssertions;


    protected readonly baseAutomationId: string;

    /**
     * @param page كائن Playwright Page
     * @param automationId المعرّف الأساسي للمكون (مثال: 'country-dropdown')
     */
    constructor(page: Page, automationId: string) {
        // نمرر الـ Locator المستخرج للمكون الأب
        super(page, Automation.byId(automationId));
        this.assertions = new DropdownAssertions(this);
        this.baseAutomationId = automationId;
    }

    /** @internal Semantic Locator for Assertions */
    public value(): Locator {
        return this.page.locator(Automation.byId(`${this.baseAutomationId}-value`));
    }

    /** @internal Semantic Locator for Assertions */
    public options(): Locator {
        return this.page.locator(Automation.byId(`${this.baseAutomationId}-option`));
    }

    /**
     * الوصول إلى توكيدات المكون.
     */
    public assert(): DropdownAssertions {
        return this.assertions;
    }

    /**
     * فتح القائمة المنسدلة
     */
    public async open(): Promise<void> {
        await this.execute(async () => {
            await this.waitUntilVisible();
            await this.locator.click();
            // بما أن القائمة تُضاف إلى הـ body فلا حاجة للانتظار بـ CSS
            // نعتمد على الانتظار الضمني لـ Playwright في العمليات القادمة
        });
    }

    /**
     * إغلاق القائمة المنسدلة (عبر ضغط مفتاح Escape)
     */
    public async close(): Promise<void> {
        await this.execute(async () => {
            await this.page.keyboard.press('Escape');
        });
    }

    /**
     * البحث داخل القائمة المنسدلة
     * يبحث عن العنصر ذو المقطع '-search' ضمن معرّف القائمة الأساسي.
     * @param term النص المراد البحث عنه
     */
    public async search(term: string): Promise<void> {
        await this.execute(async () => {
            const searchInput = this.page.locator(Automation.byId(`${this.baseAutomationId}-search`));
            await searchInput.waitFor({ state: 'visible' });
            await searchInput.fill(term);
        });
    }

    /**
     * اختيار قيمة بناءً على النص الظاهر للمستخدم.
     * يبحث في العناصر ذات المقطع '-option'
     * @param text النص الظاهر
     */
    public async selectByVisibleText(text: string): Promise<void> {
        await this.execute(async () => {
            await this.open();
            
            // تحديد جميع الخيارات
            const optionLocator = this.page.locator(Automation.byId(`${this.baseAutomationId}-option`));
            await optionLocator.first().waitFor({ state: 'attached' }); // ننتظر ظهور أي خيار
            
            // اختيار الخيار المطابق للنص
            const targetOption = optionLocator.filter({ hasText: text });
            await targetOption.first().click(); // first() احتياطاً في حال تكرار النص
        });
    }

    /**
     * استرجاع كافة الخيارات المتاحة كقائمة نصوص
     */
    public async getAvailableOptions(): Promise<string[]> {
        return await this.execute(async () => {
            await this.open();
            
            const optionLocator = this.page.locator(Automation.byId(`${this.baseAutomationId}-option`));
            await optionLocator.first().waitFor({ state: 'attached' });
            
            const texts = await optionLocator.allInnerTexts();
            
            await this.close();
            
            return texts.map(t => t.trim());
        });
    }

    /**
     * مسح التحديد الحالي عبر أيقونة الإلغاء المشتقة (-clear)
     */
    public async clear(): Promise<void> {
        await this.execute(async () => {
            // قد تكون الأيقونة بداخل الـ dropdown الأساسي أو بجانبه،
            // لكن استخدام page.locator أضمن إذا كانت في الـ DOM العام.
            // نستخدم page.locator للبحث العام في الصفحة.
            const globalClearIcon = this.page.locator(Automation.byId(`${this.baseAutomationId}-clear`));
            
            if (await globalClearIcon.isVisible()) {
                await globalClearIcon.click();
            }
        });
    }

    /**
     * استرجاع القيمة المختارة (النص المكتوب بداخل مكون Dropdown نفسه)
     * (غالباً يكون بداخل span ضمن الـ locator الرئيسي أو يمكن استخدام innerText)
     */
    public async getSelectedValue(): Promise<string> {
        return await this.execute(async () => {
            await this.waitUntilVisible();
            return (await this.locator.innerText()).trim();
        });
    }

    /**
     * التحقق من التعطيل
     * في PrimeNG يمكن الاعتماد على CSS لكن التوجيه الصارم يمنع ذلك.
     * لذلك سنفحص وجود الـ attribute "disabled" أو "aria-disabled" كإجراء بديل.
     */
    public async isDisabled(): Promise<boolean> {
        return await this.execute(async () => {
            await this.waitUntilVisible();
            
            // يمكن لـ PrimeNG إضافة disabled class، لكننا سنتحقق من الخصائص القياسية المتاحة
            const disabledAttr = await this.locator.getAttribute('disabled');
            const ariaDisabledAttr = await this.locator.getAttribute('aria-disabled');
            
            return disabledAttr !== null || ariaDisabledAttr === 'true';
        });
    }
}
