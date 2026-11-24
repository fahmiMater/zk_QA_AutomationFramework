import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../core/base/BaseComponent';
import { ButtonAssertions } from '../../core/assertions/components/button/ButtonAssertions';
import { Automation } from '../../core/automation/Automation';

/**
 * Button Component v1
 * 
 * يمثل زر (Atomic Component).
 */
export class ButtonComponent extends BaseComponent {

    private readonly assertions: ButtonAssertions;
    constructor(page: Page, identifier: string | Locator) {
        const locator = typeof identifier === 'string'
            ? (identifier.startsWith('.') || identifier.startsWith('//') ? page.locator(identifier) : Automation.byId(identifier))
            : identifier;
            
        super(page, locator);
        this.assertions = new ButtonAssertions(this);
    }

    /**
     * الوصول إلى توكيدات المكون.
     */
    public assert(): ButtonAssertions {
        return this.assertions;
    }

    /**
     * النقر على الزر.
     */
    public async click(): Promise<void> {
        await this.locator.click();
    }

    /**
     * استخراج النص الخاص بالزر.
     */
    public async getText(): Promise<string> {
        return (await this.locator.textContent())?.trim() ?? '';
    }
}
