import { expect } from '@playwright/test';
import { LookupComponent } from '../../../../components/lookup/LookupComponent';
import { BaseAssertions } from '../../BaseAssertions';

export class LookupAssertions extends BaseAssertions {
    constructor(protected readonly component: LookupComponent) {
        super(component);
    }

    async hasValue(expected: string): Promise<void> {
        await expect(this.component.input()).toHaveValue(expected);
    }

    async isEmpty(): Promise<void> {
        await expect(this.component.input()).toBeEmpty();
    }
}
