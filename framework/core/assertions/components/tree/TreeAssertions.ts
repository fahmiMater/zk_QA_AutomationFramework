import { expect } from '@playwright/test';
import { TreeComponent } from '../../../../components/tree/TreeComponent';
import { BaseAssertions } from '../../BaseAssertions';

export class TreeAssertions extends BaseAssertions {
    constructor(protected readonly component: TreeComponent) {
        super(component);
    }

    async hasNode(nodeText: string): Promise<void> {
        await expect(this.component.nodeLocator(nodeText)).toBeVisible();
    }

    async isNodeExpanded(nodeText: string): Promise<void> {
        // Assume ARIA or derived ID is used for state
        await expect(this.component.nodeLocator(nodeText)).toHaveAttribute('aria-expanded', 'true');
    }
}
