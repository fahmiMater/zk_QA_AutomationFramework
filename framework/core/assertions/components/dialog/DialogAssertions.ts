import { expect } from '@playwright/test';
import { DialogComponent } from '../../../../components/dialog/DialogComponent';
import { BaseAssertions } from '../../BaseAssertions';

export class DialogAssertions extends BaseAssertions {
    constructor(protected readonly component: DialogComponent) {
        super(component);
    }

    async hasTitle(expectedTitle: string): Promise<void> {
        await expect(this.component.title()).toHaveText(expectedTitle);
    }

    async isOpened(): Promise<void> {
        await expect(this.component.getLocator()).toBeVisible();
    }
}
