import { expect } from '@playwright/test';
import { NotificationCenterComponent } from '../../../../components/notification/NotificationCenterComponent';
import { BaseAssertions } from '../../BaseAssertions';

export class NotificationAssertions extends BaseAssertions {
    constructor(protected readonly component: NotificationCenterComponent) {
        super(component);
    }

    async hasUnreadCount(expectedCount: number): Promise<void> {
        await expect(this.component.badge()).toHaveText(expectedCount.toString());
    }

    async hasItem(expectedTitle: string): Promise<void> {
        await expect(this.component.itemLocator(expectedTitle)).toBeVisible();
    }
}
