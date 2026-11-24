import { Locator, Page } from '@playwright/test';

export class GridPaginatorComponent {
    constructor(private page: Page, private gridLocator: Locator) {}

    /**
     * الانتقال للصفحة التالية.
     */
    public async next(): Promise<void> {
        const nextButton = this.gridLocator.getByRole('button', { name: 'Next Page' });
        await nextButton.click();
    }

    /**
     * الانتقال للصفحة السابقة.
     */
    public async prev(): Promise<void> {
        const prevButton = this.gridLocator.getByRole('button', { name: 'Previous Page' });
        await prevButton.click();
    }
}
