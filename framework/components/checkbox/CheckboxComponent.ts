import { Page } from '@playwright/test';
import { BaseComponent } from '../../core/base/BaseComponent';
import { CheckboxAssertions } from '../../core/assertions/components/checkbox/CheckboxAssertions';
import { Automation } from '../../core/automation/Automation';

/**
 * CheckboxComponent
 * 
 * يمثل مربع اختيار (p-checkbox) معتمداً حصرياً على الـ Input الأصلي المخفي
 * باستخدام استراتيجية المعرفات المشتقة (Derived Automation IDs) بلاحقة `-input`.
 */
export class CheckboxComponent extends BaseComponent {

    private readonly assertions: CheckboxAssertions;

    protected readonly baseAutomationId: string;

    /**
     * @param page كائن Playwright Page
     * @param automationId المعرّف الأساسي للمكون (مثال: 'user-active')
     */
    constructor(page: Page, automationId: string) {
        // الـ Locator الأساسي للمكون سيكون مباشرة الـ Input
        super(page, Automation.byId(`${automationId}-input`));
        this.assertions = new CheckboxAssertions(this);
        this.baseAutomationId = automationId;
    }

    /**
     * تفعيل المربع.
     * يستخدم دالة check من Playwright والتي هي Idempotent وتتعامل مع الـ Inputs المخفية بنجاح عبر force.
     */
    public async check(): Promise<void> {
        await this.execute(async () => {
            // نستخدم force لأن PrimeNG يخفي الـ input الأصلي بصرياً (opacity: 0, position: absolute, etc)
            await this.locator.check({ force: true });
        });
    }

    /**
     * إلغاء تفعيل المربع.
     * Idempotent: لا تفعل شيئاً إذا كان المربع غير مفعل.
     */
    public async uncheck(): Promise<void> {
        await this.execute(async () => {
            await this.locator.uncheck({ force: true });
        });
    }

    /**
     * التحقق مما إذا كان المربع مفعلاً.
     * يستقرئ الحالة مباشرة من عنصر الـ HTML القياسي.
     */
    public async isChecked(): Promise<boolean> {
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
