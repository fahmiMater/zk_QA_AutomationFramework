import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../core/base/BaseComponent';
import { Automation } from '../../core/automation/Automation';
import { AutomationLocator } from '../../core/locators/AutomationLocator';

/**
 * Dialog Component v2
 * 
 * يمثل نافذة حوار عامة داخل النظام مبنية على الـ Semantic HTML.
 */
export class DialogComponent extends BaseComponent {
    protected readonly baseAutomationId: string;

    /**
     * إنشاء مكون الحوار.
     * @param page الصفحة الحالية
     * @param identifier Automation ID أو الـ Locator الجاهز للـ Dialog
     */
    constructor(page: Page, identifier?: string | Locator) {
        // إذا لم يتم تمرير معرف، نفترض أن هناك حوار واحد ظاهر في الشاشة كـ Modal
        const isId = typeof identifier === 'string' && AutomationLocator.isAutomationId(identifier);
        const locator = identifier 
            ? AutomationLocator.resolve(page, identifier)
            : page.getByRole('dialog');
            
        super(page, locator);
        this.baseAutomationId = isId ? (identifier as string) : 'dialog';
    }

    /** @internal Semantic Locator */
    public title(): Locator {
        return this.page.locator(Automation.byId(`${this.baseAutomationId}-title`));
    }

    /**
     * انتظار ظهور النافذة واكتمال الأنيميشن (إن وجد).
     */
    public async waitUntilOpened(): Promise<void> {
        await this.waitUntilVisible();
    }

    /**
     * انتظار اختفاء النافذة تماماً (لحل مشاكل الـ Flakiness أثناء الإغلاق).
     */
    public async waitUntilClosed(): Promise<void> {
        await this.waitUntilHidden();
    }

    /**
     * قراءة عنوان النافذة (Title).
     */
    public async getTitle(): Promise<string> {
        const heading = this.title();
        const text = await heading.textContent();
        return text?.trim() ?? '';
    }

    /**
     * النقر على أي زر داخل الـ Dialog بناءً على معرّفه الدلالي (Action ID).
     * @param actionId الإجراء المراد اتخاذه (مثال: 'save', 'cancel')
     */
    public async clickButton(actionId: string): Promise<void> {
        const button = this.page.locator(Automation.byId(`${this.baseAutomationId}-${actionId}-btn`));
        await button.click();
    }

    /**
     * النقر على أيقونة الإغلاق (X) في أعلى النافذة.
     */
    public async closeViaIcon(): Promise<void> {
        const closeBtn = this.page.locator(Automation.byId(`${this.baseAutomationId}-close-btn`));
        await closeBtn.click();
    }

    /**
     * التحقق مما إذا كان الحوار ظاهراً حالياً في الشاشة.
     */
    public async isDisplayed(): Promise<boolean> {
        return await this.isVisible();
    }
}
