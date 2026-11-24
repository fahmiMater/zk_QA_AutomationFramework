import { Page } from '@playwright/test';
import { BaseComponent } from '../../core/base/BaseComponent';
import { RadioAssertions } from '../../core/assertions/components/radio/RadioAssertions';
import { Automation } from '../../core/automation/Automation';

/**
 * RadioButtonComponent
 * 
 * يمثل زر اختيار فردي (p-radioButton).
 * يعتمد حصرياً على הـ Input الأصلي المخفي للوصول لأعلى موثوقية 
 * باستخدام اللاحقة المشتقة `-input`.
 */
export class RadioButtonComponent extends BaseComponent {

    private readonly assertions: RadioAssertions;

    protected readonly baseAutomationId: string;

    /**
     * @param page كائن Playwright Page
     * @param automationId المعرّف الأساسي للمكون (مثال: 'payment-credit')
     */
    constructor(page: Page, automationId: string) {
        // نستهدف مباشرة الـ Input الخاص بالراديو
        super(page, Automation.byId(`${automationId}-input`));
        this.assertions = new RadioAssertions(this);
        this.baseAutomationId = automationId;
    }

    /**
     * اختيار زر الراديو.
     * يستعمل دالة check المدمجة من Playwright والتي تتمتع بـ Idempotency،
     * أي أنها لن تقوم بالنقر مجدداً إذا كان الخيار مفعلاً مسبقاً.
     * يمرر force: true للتعامل مع الإخفاء البصري لـ PrimeNG.
     */
    public async select(): Promise<void> {
        await this.execute(async () => {
            await this.locator.check({ force: true });
        });
    }

    /**
     * التحقق من تفعيل الزر.
     * يقرأ الخاصية الأساسية .checked من الـ DOM مباشرة.
     */
    public async isSelected(): Promise<boolean> {
        return await this.execute(async () => {
            return await this.locator.isChecked();
        });
    }

    /**
     * التحقق من حالة التعطيل.
     */
    public async isDisabled(): Promise<boolean> {
        return await this.execute(async () => {
            return await this.locator.isDisabled();
        });
    }
}
