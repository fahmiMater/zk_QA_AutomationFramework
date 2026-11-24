import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../core/base/BaseComponent';
import { FileUploadAssertions } from '../../core/assertions/components/fileupload/FileUploadAssertions';
import { Automation } from '../../core/automation/Automation';
import { AutomationLocator } from '../../core/locators/AutomationLocator';
import { ButtonComponent } from '../button/ButtonComponent';

/**
 * FileUpload Component v1
 * 
 * يمثل الغلاف القياسي (Wrapper) لمكونات رفع الملفات (Composite Workflow Component).
 * يدعم اختيار ملف أو عدة ملفات وقراءتها والوصول إلى أزرار التحكم دون الاعتماد على مكتبة UI محددة.
 * 
 * Locator Strategy:
 * 1. Automation IDs
 * 2. `<input type="file">`
 * 3. عناصر HTML القياسية
 */
export class FileUploadComponent extends BaseComponent {
    protected readonly baseAutomationId: string;

    /**
     * إنشاء مكون الرفع.
     *
     * @param page الصفحة الحالية.
     * @param identifier Automation ID أو Locator أو String Selector.
     */
    constructor(page: Page, identifier: string | Locator) {
        const isId = typeof identifier === 'string' && AutomationLocator.isAutomationId(identifier);
        const locator = AutomationLocator.resolve(page, identifier);
            
        super(page, locator);
        this.baseAutomationId = isId ? (identifier as string) : 'fileupload';
    }

    /** @internal Semantic Locator */
    public fileRow(fileName: string): Locator {
        return this.page.locator(Automation.byId(`${this.baseAutomationId}-file-${fileName.toLowerCase().replace(/\s+/g, '-')}`));
    }

    /** @internal Semantic Locator */
    public files(): Locator {
        return this.page.locator(Automation.byId(`${this.baseAutomationId}-file`));
    }

    /**
     * اختيار ملف أو عدة ملفات باستخدام Playwright setInputFiles.
     * يبحث عن أول `<input type="file">` مخفي أو ظاهر ضمن الحاوية.
     * 
     * @param filePaths مسارات الملفات (محلية).
     */
    public async selectFiles(filePaths: string[]): Promise<void> {
        const fileInput = this.locator.locator('input[type="file"]').first();
        await fileInput.setInputFiles(filePaths);
    }

    /**
     * استرجاع أسماء الملفات التي تم اختيارها حالياً.
     * هذا يعتمد على طبيعة الإطار، قد تكون ضمن عناصر مخصصة.
     * لكن كافتراضي، سنبحث عن أي عناصر تمثل أسماء الملفات المختارة (مثال: PrimeNG uses `p-fileupload-row` or similar inner text elements, 
     * but we will try to rely on semantic tags or Automation IDs. Since we don't know the specifics, 
     * a generic robust way is checking the files attached to the input, or falling back to text if displayed).
     * Since Playwright can evaluate the input files directly, we will use that as the source of truth for standard inputs.
     * 
     * @returns قائمة بأسماء الملفات.
     */
    public async getSelectedFiles(): Promise<string[]> {
        const fileInput = this.locator.locator('input[type="file"]').first();
        const filesCount = await fileInput.evaluate((el: HTMLInputElement) => el.files ? el.files.length : 0);
        
        const fileNames: string[] = [];
        for (let i = 0; i < filesCount; i++) {
            const name = await fileInput.evaluate((el: HTMLInputElement, index) => el.files![index].name, i);
            fileNames.push(name);
        }
        
        return fileNames;
    }

    /**
     * إرجاع ButtonComponent الخاص بزر الرفع (Upload).
     * يبحث أولاً بـ Automation ID، ثم يعتمد على الدلالات (Aria label or text).
     * 
     * @returns ButtonComponent
     */
    public async uploadButton(): Promise<ButtonComponent> {
        // نبحث عن زر الرفع بـ automation id أو aria-label أو النص
        const uploadBtnLocator = this.locator.getByRole('button', { name: /upload|رفع/i }).first();
        // يمكن للمطور تمرير automation id لاحقاً كخيار، ولكن حالياً نعتمد على الدلالة القياسية أو fallback
        return new ButtonComponent(this.page, uploadBtnLocator);
    }

    /**
     * إرجاع ButtonComponent الخاص بزر الإلغاء (Cancel).
     * 
     * @returns ButtonComponent
     */
    public async cancelButton(): Promise<ButtonComponent> {
        // نبحث عن زر الإلغاء بـ automation id أو aria-label أو النص
        const cancelBtnLocator = this.locator.getByRole('button', { name: /cancel|إلغاء/i }).first();
        return new ButtonComponent(this.page, cancelBtnLocator);
    }
}
