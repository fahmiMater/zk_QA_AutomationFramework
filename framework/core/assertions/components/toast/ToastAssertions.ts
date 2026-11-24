import { expect } from '@playwright/test';
import { ToastComponent } from '../../../../components/toast/ToastComponent';
import { BaseAssertions } from '../../BaseAssertions';

export class ToastAssertions extends BaseAssertions {
    constructor(protected readonly component: ToastComponent) {
        super(component);
    }

    async hasMessage(expectedMessage: string): Promise<void> {
        await expect(this.component.message()).toContainText(expectedMessage);
    }

    async hasSeverity(severity: 'success' | 'info' | 'warn' | 'error'): Promise<void> {
        await expect(this.component.getLocator()).toHaveAttribute('data-severity', severity);
    }
}
