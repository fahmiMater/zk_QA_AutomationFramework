import { expect } from '@playwright/test';
import { TextBoxComponent } from '../../../../components/textbox/TextBoxComponent';
import { BaseAssertions } from '../../BaseAssertions';

export class TextBoxAssertions extends BaseAssertions {
    constructor(protected readonly component: TextBoxComponent) {
        super(component);
    }

    async hasText(expected: string): Promise<void> {
        await expect(this.component.getLocator()).toHaveValue(expected);
    }

    async isReadonly(): Promise<void> {
        await expect(this.component.getLocator()).toHaveAttribute('readonly', '');
    }

    async hasPlaceholder(expected: string): Promise<void> {
        await expect(this.component.getLocator()).toHaveAttribute('placeholder', expected);
    }

    async isEmpty(): Promise<void> {
        await expect(this.component.getLocator()).toBeEmpty();
    }
}
