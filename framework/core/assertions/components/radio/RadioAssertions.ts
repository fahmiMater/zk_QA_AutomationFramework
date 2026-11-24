import { expect } from '@playwright/test';
import { RadioButtonComponent } from '../../../../components/radio/RadioButtonComponent';
import { BaseAssertions } from '../../BaseAssertions';

export class RadioAssertions extends BaseAssertions {
    constructor(protected readonly component: RadioButtonComponent) {
        super(component);
    }

    async isSelected(): Promise<void> {
        await expect(this.component.getLocator()).toBeChecked();
    }

    async isNotSelected(): Promise<void> {
        await expect(this.component.getLocator()).not.toBeChecked();
    }
}
