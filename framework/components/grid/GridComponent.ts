import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../core/base/BaseComponent';
import { Automation } from '../../core/automation/Automation';
import { AutomationLocator } from '../../core/locators/AutomationLocator';
import { GridRowComponent } from './GridRowComponent';
import { GridSortComponent } from './GridSortComponent';
import { GridFilterComponent } from './GridFilterComponent';
import { GridPaginatorComponent } from './GridPaginatorComponent';

export class GridComponent extends BaseComponent {
    
    private columnCache: Map<string, number> | null = null;
    
    public readonly sortComponent: GridSortComponent;
    public readonly filterComponent: GridFilterComponent;
    public readonly paginatorComponent: GridPaginatorComponent;

    constructor(page: Page, identifier: string | Locator) {
        const isId = typeof identifier === 'string' && AutomationLocator.isAutomationId(identifier);
        const gridLocator = AutomationLocator.resolve(page, identifier);

        super(page, gridLocator);
        this.sortComponent = new GridSortComponent(page, this.locator);
        this.filterComponent = new GridFilterComponent(page, this.locator);
        this.paginatorComponent = new GridPaginatorComponent(page, this.locator);
    }

    public get rootLocator() {
        return this.locator;
    }

    /**
     * يبني خريطة لأعمدة الجدول (Column Name -> Index) لمرة واحدة فقط لتسريع الوصول.
     */
    public async buildColumnCache(): Promise<void> {
        if (this.columnCache) {
            return;
        }
        
        await this.execute(async () => {
            this.columnCache = new Map<string, number>();
            const headers = this.locator.getByRole('columnheader');
            const count = await headers.count();
            
            for (let i = 0; i < count; i++) {
                const text = await headers.nth(i).innerText();
                this.columnCache.set(text.trim(), i);
            }
        });
    }

    /**
     * يجلب فهرس العمود بناءً على اسمه عبر الـ Cache.
     * @param columnName اسم العمود
     */
    public async getColumnIndex(columnName: string): Promise<number> {
        await this.buildColumnCache();
        const index = this.columnCache?.get(columnName);
        
        if (index === undefined) {
            throw new Error(`Column '${columnName}' was not found in the grid headers.`);
        }
        return index;
    }

    /**
     * عدد الصفوف الظاهرة حالياً في الصفحة.
     */
    public async getRowCount(): Promise<number> {
        return await this.execute(async () => {
            // نستخدم tbody لضمان عدم احتساب صفوف الترويسة (thead)
            // PrimeNG p-table يحتوي غالباً على tbody 
            const rows = this.locator.locator('tbody').getByRole('row');
            return await rows.count();
        });
    }

    /**
     * الوصول إلى صف محدد (0-indexed).
     * @param rowIndex رقم الصف
     */
    public row(rowIndex: number): GridRowComponent {
        return new GridRowComponent(this.page, this, rowIndex);
    }

    // --- الوصول إلى المكونات الفرعية للجدول ---

    public sort(): GridSortComponent {
        return this.sortComponent;
    }

    public filter(): GridFilterComponent {
        return this.filterComponent;
    }

    public paginator(): GridPaginatorComponent {
        return this.paginatorComponent;
    }
}