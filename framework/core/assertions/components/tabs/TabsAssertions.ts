import { expect } from '@playwright/test';
import { TabsComponent } from '../../../../components/tabs/TabsComponent';
import { BaseAssertions } from '../../BaseAssertions';

export class TabsAssertions extends BaseAssertions {
    constructor(protected readonly component: TabsComponent) {
        super(component);
    }

    async hasActiveTab(expectedTabTitle: string): Promise<void> {
        await expect(this.component.activeTab()).toHaveText(expectedTabTitle);
    }

    async hasTabsCount(expectedCount: number): Promise<void> {
        await expect(this.component.tabs()).toHaveCount(expectedCount);
    }
}
