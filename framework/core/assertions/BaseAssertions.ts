import { expect } from '@playwright/test';
import { BaseComponent } from '../base/BaseComponent';

export abstract class BaseAssertions {

    protected constructor(
        protected readonly component: BaseComponent
    ) {}

    async isVisible(): Promise<void> {

        await expect(
            this.component.getLocator()
        ).toBeVisible();

    }

    async isHidden(): Promise<void> {

        await expect(
            this.component.getLocator()
        ).toBeHidden();

    }

    async exists(): Promise<void> {

        await expect(
            this.component.getLocator()
        ).toHaveCount(1);

    }

}