import { expect } from '@playwright/test';
import { MenuComponent } from '../../../../components/menu/MenuComponent';
import { BaseAssertions } from '../../BaseAssertions';

export class MenuAssertions extends BaseAssertions {
    constructor(protected readonly component: MenuComponent) {
        super(component);
    }

    async hasItemVisible(itemText: string): Promise<void> {
        await expect(this.component.itemLocator(itemText)).toBeVisible();
    }
}
