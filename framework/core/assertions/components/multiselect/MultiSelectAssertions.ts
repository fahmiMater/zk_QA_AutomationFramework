import { expect } from '@playwright/test';
import { MultiSelectComponent } from '../../../../components/multiselect/MultiSelectComponent';
import { BaseAssertions } from '../../BaseAssertions';

export class MultiSelectAssertions extends BaseAssertions {
    constructor(protected readonly component: MultiSelectComponent) {
        super(component);
    }

    async hasSelectedOptionsCount(expectedCount: number): Promise<void> {
        await expect(this.component.tokens()).toHaveCount(expectedCount);
    }

    async containsSelectedOption(expectedText: string): Promise<void> {
        const token = this.component.tokens().filter({ hasText: expectedText });
        await expect(token).toBeVisible();
    }
}
