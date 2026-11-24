import { expect } from '@playwright/test';
import { CheckboxComponent } from '../../../../components/checkbox/CheckboxComponent';
import { BaseAssertions } from '../../BaseAssertions';

export class CheckboxAssertions extends BaseAssertions {
    constructor(protected readonly component: CheckboxComponent) {
        super(component);
    }

    async isChecked(): Promise<void> {
        await expect(this.component.getLocator()).toBeChecked();
    }

    async isUnchecked(): Promise<void> {
        await expect(this.component.getLocator()).not.toBeChecked();
    }
}
