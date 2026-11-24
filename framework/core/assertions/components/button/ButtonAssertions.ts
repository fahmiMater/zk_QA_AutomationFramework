import { expect } from '@playwright/test';
import { ButtonComponent } from '../../../../components/button/ButtonComponent';
import { BaseAssertions } from '../../BaseAssertions';

export class ButtonAssertions extends BaseAssertions {
    constructor(protected readonly component: ButtonComponent) {
        super(component);
    }

    async hasText(expectedText: string): Promise<void> {
        await expect(this.component.getLocator()).toHaveText(expectedText);
    }
}
