import { expect } from '@playwright/test';
import { FileUploadComponent } from '../../../../components/fileupload/FileUploadComponent';
import { BaseAssertions } from '../../BaseAssertions';

export class FileUploadAssertions extends BaseAssertions {
    constructor(protected readonly component: FileUploadComponent) {
        super(component);
    }

    async hasFile(fileName: string): Promise<void> {
        await expect(this.component.fileRow(fileName)).toBeVisible();
    }

    async hasFilesCount(expectedCount: number): Promise<void> {
        await expect(this.component.files()).toHaveCount(expectedCount);
    }
}
