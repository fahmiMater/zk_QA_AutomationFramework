import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../core/base/BaseComponent';

/**
 * MenuItem Component v2
 *
 * يمثل عنصراً فردياً داخل قائمة (Menu) أو شريط قوائم (MenuBar).
 */
export class MenuItemComponent extends BaseComponent {

    /**
     * إنشاء مكون عنصر القائمة.
     *
     * @param page الصفحة الحالية.
     * @param locator الـ Locator الخاص بالعنصر (`role="menuitem"` أو `role="menuitemcheckbox"`).
     */
    constructor(page: Page, locator: Locator) {
        super(page, locator);
    }

    /**
     * النقر على العنصر لتنفيذ الإجراء المرتبط به.
     * سيتم التحقق من أن العنصر غير معطل قبل النقر.
     */
    public async click(): Promise<void> {
        if (await this.isDisabled()) {
            throw new Error(`Cannot click on disabled menu item: ${await this.getText()}`);
        }
        await this.locator.click();
    }

    /**
     * التحقق مما إذا كان العنصر معطلاً.
     * يعتمد على خصائص WAI-ARIA `aria-disabled="true"`.
     *
     * @returns صحيح إذا كان العنصر معطلاً.
     */
    public async isDisabled(): Promise<boolean> {
        const disabledAttr = await this.locator.getAttribute('aria-disabled');
        return disabledAttr === 'true';
    }

    /**
     * التحقق مما إذا كان العنصر يحتوي على قائمة فرعية (Sub-menu).
     * يعتمد على `aria-haspopup="true"` أو `aria-haspopup="menu"`.
     *
     * @returns صحيح إذا كان يمتلك قائمة فرعية.
     */
    public async hasChildren(): Promise<boolean> {
        const hasPopup = await this.locator.getAttribute('aria-haspopup');
        return hasPopup === 'true' || hasPopup === 'menu';
    }

    /**
     * استخراج النص الظاهر للعنصر.
     *
     * @returns اسم/نص العنصر.
     */
    public async getText(): Promise<string> {
        const text = await this.locator.textContent();
        return text?.trim() ?? '';
    }
}
