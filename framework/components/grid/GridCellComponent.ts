import { Locator, Page } from '@playwright/test';
import { GridComponent } from './GridComponent';

export class GridCellComponent {
    
    constructor(
        private page: Page,
        private grid: GridComponent,
        private rowLocator: Locator,
        public readonly columnName: string
    ) {}

    /**
     * يجلب الـ Locator الخاص بالخلية بناءً على الفهرس المخزن.
     */
    private async getCellLocator(): Promise<Locator> {
        const columnIndex = await this.grid.getColumnIndex(this.columnName);
        return this.rowLocator.getByRole('cell').nth(columnIndex);
    }

    /**
     * قراءة النص الظاهر داخل الخلية.
     */
    public async text(): Promise<string> {
        const cellLocator = await this.getCellLocator();
        const textContent = await cellLocator.textContent();
        return textContent?.trim() ?? '';
    }

    /**
     * للوصول إلى أي عناصر داخل الخلية مستقبلاً (أزرار، روابط، إلخ).
     * @param selector محدد فرعي (يُفضل أن يكون Role أو AutomationId)
     */
    public async locator(selector?: string): Promise<Locator> {
        const cellLocator = await this.getCellLocator();
        if (selector) {
            return cellLocator.locator(selector);
        }
        return cellLocator;
    }
}
