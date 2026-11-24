import { Locator, Page } from '@playwright/test';
import { GridComponent } from './GridComponent';
import { GridCellComponent } from './GridCellComponent';

/**
 * غلاف بسيط للـ Checkbox داخل الصف.
 * يتيح لنا توافقية عالية مع فلسفة الإطار: row.checkbox().check()
 */
class GridRowCheckboxWrapper {
    constructor(private checkboxLocator: Locator) {}

    public async check(): Promise<void> {
        if (!(await this.checkboxLocator.isChecked())) {
            await this.checkboxLocator.click();
        }
    }

    public async uncheck(): Promise<void> {
        if (await this.checkboxLocator.isChecked()) {
            await this.checkboxLocator.click();
        }
    }

    public async isChecked(): Promise<boolean> {
        return await this.checkboxLocator.isChecked();
    }
}

export class GridRowComponent {
    public readonly rowLocator: Locator;

    constructor(
        private page: Page,
        private grid: GridComponent,
        public readonly rowIndex: number
    ) {
        // الوصول للصف ضمن الـ tbody لضمان تجاهل صف الترويسة
        this.rowLocator = this.grid.rootLocator.locator('tbody').getByRole('row').nth(this.rowIndex);
    }

    /**
     * الوصول لخلية محددة بناءً على اسم العمود.
     * @param columnName اسم العمود في الترويسة
     */
    public cell(columnName: string): GridCellComponent {
        return new GridCellComponent(this.page, this.grid, this.rowLocator, columnName);
    }

    /**
     * الوصول للـ Checkbox الخاص بتحديد الصف.
     */
    public checkbox(): GridRowCheckboxWrapper {
        const cbLocator = this.rowLocator.getByRole('checkbox');
        return new GridRowCheckboxWrapper(cbLocator);
    }

    /**
     * التحقق مما إذا كان الصف محدد حالياً (بالاعتماد على الـ checkbox الداخلي أو غيره).
     */
    public async isSelected(): Promise<boolean> {
        return await this.checkbox().isChecked();
    }
}
