import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../core/base/BaseComponent';

/**
 * NotificationItem Component v2
 *
 * يُمثل إشعاراً واحداً داخل مركز الإشعارات (Atomic within a Composite).
 */
export class NotificationItemComponent extends BaseComponent {

    /**
     * إنشاء مكون الإشعار הפردي.
     *
     * @param page الصفحة الحالية.
     * @param locator الـ Locator الخاص بعنصر الإشعار (غالبًا ما يكون `role="listitem"`).
     */
    constructor(page: Page, locator: Locator) {
        super(page, locator);
    }

    /**
     * استخراج عنوان الإشعار (إن وجد).
     *
     * @returns نص الترويسة للإشعار.
     */
    public async getTitle(): Promise<string> {
        const heading = this.locator.getByRole('heading');
        if (await heading.count() > 0) {
            return (await heading.first().textContent())?.trim() ?? '';
        }
        return '';
    }

    /**
     * استخراج التفاصيل أو كامل النص للإشعار.
     *
     * @returns نص الإشعار كاملًا.
     */
    public async getDetail(): Promise<string> {
        const fullText = await this.locator.innerText();
        const title = await this.getTitle();
        if (title && fullText.startsWith(title)) {
            return fullText.replace(title, '').trim();
        }
        return fullText.trim();
    }

    /**
     * معرفة ما إذا كان الإشعار مقروءاً أم لا (بدون تخمينات!).
     * يعتمد على قيم دلالية حتمية.
     *
     * @returns true إذا كان غير مقروء، وإلا false.
     */
    public async isUnread(): Promise<boolean> {
        // فحص الـ Attributes الدلالية الواضحة.
        const isDataReadFalse = await this.locator.getAttribute('data-read') === 'false';
        const isDataStateUnread = await this.locator.getAttribute('data-state') === 'unread';
        const isAriaCurrent = await this.locator.getAttribute('aria-current') === 'true'; // Sometimes used for active/unread
        const isAriaSelected = await this.locator.getAttribute('aria-selected') === 'true'; // Sometimes used in lists

        return isDataReadFalse || isDataStateUnread || isAriaCurrent || isAriaSelected;
    }

    /**
     * النقر على الإشعار لفتح التفاصيل أو الرابط المرتبط.
     */
    public async click(): Promise<void> {
        await this.locator.click();
    }
}
