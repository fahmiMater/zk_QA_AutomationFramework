import { Locator, Page } from '@playwright/test';

import { Automation } from '../automation/Automation';

export abstract class BaseFactory {

    protected constructor(
        protected readonly page: Page
    ) {}

    /**
     * Creates locator by Automation Id.
     */
    protected byId(
        automationId: string
    ): Locator {

        return this.page.locator(
            Automation.byId(automationId)
        );
    }

}