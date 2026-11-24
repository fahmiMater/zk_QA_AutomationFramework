import { expect } from '@playwright/test';
import { DropdownComponent } from '../../../../components/dropdown/DropdownComponent';
import { BaseAssertions } from '../../BaseAssertions';

export class DropdownAssertions extends BaseAssertions {
    constructor(protected readonly component: DropdownComponent) {
        super(component);
    }

    async hasSelectedOption(expectedText: string): Promise<void> {
        await expect(this.component.value()).toHaveText(expectedText);
    }

    async isEmpty(): Promise<void> {
        // Assume empty if value is empty or missing
        await expect(this.component.value()).toBeEmpty();
    }

    async hasOptionsAvailable(count: number): Promise<void> {
        await expect(this.component.options()).toHaveCount(count);
    }
}
