import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../core/base/BaseComponent';
import { ToastAssertions } from '../../core/assertions/components/toast/ToastAssertions';
import { Automation } from '../../core/automation/Automation';
import { AutomationLocator } from '../../core/locators/AutomationLocator';

/**
 * Toast Component v2
 *
 * يمثل رسالة نظام منبثقة (Single Toast Message) (Atomic Component).
 * يعتمد على معايير الدلالات (Semantic HTML) `role="alert"` أو `role="status"`.
 */
export class ToastComponent extends BaseComponent {

    private readonly assertions: ToastAssertions;


    /**
     * إنشاء مكون الرسالة.
     *
     * @param page الصفحة الحالية.
     * @param identifier Automation ID أو Locator الخاص برسالة الـ Toast الفردية.
     */
    protected readonly baseAutomationId: string;

    constructor(page: Page, automationId: string) {
        super(page, AutomationLocator.resolve(page, automationId));
        this.assertions = new ToastAssertions(this);
        this.baseAutomationId = automationId;
    }

    /** @internal */
    public message(): Locator {
        return this.page.locator(Automation.byId(`${this.baseAutomationId}-message`));
    }

    /**
     * الوصول إلى توكيدات المكون.
     */
    public assert(): ToastAssertions {
        return this.assertions;
    }

    /**
     * استرجاع نص الترويسة (عنوان الرسالة).
     */
    public async getTitle(): Promise<string> {
        const heading = this.page.locator(Automation.byId(`${this.baseAutomationId}-title`));
        if (await heading.count() > 0) {
            return (await heading.first().textContent())?.trim() ?? '';
        }
        return '';
    }

    /**
     * استرجاع تفاصيل الرسالة.
     * نظراً لعدم وجود role مخصص لتفاصيل الرسالة، سنعتمد على استخراج النص الكامل 
     * ثم طرح نص العنوان منه، أو يمكننا البحث عن paragraph. 
     * لتبسيط الأمر، نُرجع كامل النص ما عدا العنوان.
     * (في المشاريع الحقيقية يُفضل استخدام automation-id="toast-detail").
     */
    public async getDetail(): Promise<string> {
        // نستخدم استراتيجية الحصول على النص الداخلي للمكون
        const fullText = await this.locator.innerText();
        const title = await this.getTitle();
        
        // استبعاد العنوان إذا كان موجوداً ضمن النص الكامل
        if (title && fullText.startsWith(title)) {
            return fullText.replace(title, '').trim();
        }
        return fullText.trim();
    }

    /**
     * معرفة نوع الرسالة.
     * لا يقوم المكون بـ "تخمين" النوع. 
     * إذا توفرت `data-severity` صريحة، نعيدها.
     * إذا لم تتوفر، نعيد الـ role المكتشف (`alert` أو `status`).
     */
    public async getType(): Promise<string> {
        const severity = await this.locator.getAttribute('data-severity');
        if (severity) {
            return severity.toLowerCase();
        }

        const role = await this.locator.getAttribute('role');
        return role ? role.toLowerCase() : 'unknown';
    }

    /**
     * النقر على زر الإغلاق (X) يدوياً قبل أن يختفي تلقائياً.
     */
    public async close(): Promise<void> {
        const closeBtn = this.page.locator(Automation.byId(`${this.baseAutomationId}-close-btn`));
        if (await closeBtn.count() > 0) {
            await closeBtn.first().click();
        } else {
            throw new Error('Close button not found in Toast message');
        }
    }
}
