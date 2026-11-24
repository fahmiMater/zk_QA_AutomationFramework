import { expect } from '@playwright/test';
import { GridComponent } from '../../../../components/grid/GridComponent';
import { BaseAssertions } from '../../BaseAssertions';

export class GridAssertions extends BaseAssertions {
    constructor(protected readonly component: GridComponent) {
        super(component);
    }

    async hasRows(expected: number): Promise<void> {
        const rows = this.component.getLocator().locator('tbody tr');
        await expect(rows).toHaveCount(expected);
    }

    async isNotEmpty(): Promise<void> {
        const rows = this.component.getLocator().locator('tbody tr');
        await expect(rows).not.toHaveCount(0);
    }

    async isEmpty(): Promise<void> {
        const rows = this.component.getLocator().locator('tbody tr');
        await expect(rows).toHaveCount(0);
    }

    async contains(text: string): Promise<void> {
        await expect(this.component.getLocator()).toContainText(text);
    }
}