import { expect } from '@playwright/test';
import { DatePickerComponent } from '../../../../components/datepicker/DatePickerComponent';
import { BaseAssertions } from '../../BaseAssertions';

export class DatePickerAssertions extends BaseAssertions {
    constructor(protected readonly component: DatePickerComponent) {
        super(component);
    }

    async hasDate(expectedDate: string): Promise<void> {
        // PrimeNG calendar usually uses an input field
        await expect(this.component.getLocator().locator('input')).toHaveValue(expectedDate);
    }

    async isEmpty(): Promise<void> {
        await expect(this.component.getLocator().locator('input')).toBeEmpty();
    }
}
