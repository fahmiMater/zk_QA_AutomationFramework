import { Locator, Page } from '@playwright/test';

export class GridSortComponent {
    constructor(private page: Page, private gridLocator: Locator) {}

    /**
     * فرز حسب اسم العمود.
     */
    public async byColumn(columnName: string): Promise<void> {
        const header = this.gridLocator.getByRole('columnheader', { name: columnName, exact: true });
        await header.click();
    }
}
