import { Page } from '@playwright/test';
import { BaseComponent } from '../../core/base/BaseComponent';
import { TextBoxAssertions } from '../../core/assertions/components/textbox/TextBoxAssertions';

/**
 * TextBoxComponent
 *
 * يمثل حقل الإدخال النصي القياسي داخل واجهة المستخدم.
 * يوفر العمليات الأساسية مثل كتابة النص، مسح النص، واسترجاع النص الحالي.
 */
export class TextBoxComponent extends BaseComponent {

    private readonly assertions: TextBoxAssertions;

    /**
     * إنشاء مكون TextBox جديد.
     *
     * @param page كائن Playwright Page.
     * @param selector المحدد النصي للعنصر (يتم توليده عادة عبر Automation.byId).
     */
    constructor(
        page: Page,
        selector: string
    ) {
        super(page, selector);
        this.assertions = new TextBoxAssertions(this);
    }

    /**
     * الوصول إلى توكيدات المكون.
     */
    public assert(): TextBoxAssertions {
        return this.assertions;
    }

    /**
     * إدخال نص داخل الحقل.
     *
     * يقوم بانتظار ظهور الحقل ثم يقوم بإدخال النص بداخله.
     *
     * @param text النص المطلوب إدخاله.
     * @returns Promise يتم حله بعد كتابة النص.
     */
    public async fill(text: string): Promise<void> {
        await this.execute(async () => {
            await this.waitUntilVisible();
            await this.locator.fill(text);
        });
    }

    /**
     * مسح محتوى الحقل النصي.
     *
     * يقوم بانتظار ظهور الحقل ثم مسح أي نص موجود بداخله.
     *
     * @returns Promise يتم حله بعد مسح الحقل.
     */
    public async clear(): Promise<void> {
        await this.execute(async () => {
            await this.waitUntilVisible();
            await this.locator.clear();
        });
    }

    /**
     * استرجاع النص الحالي الموجود داخل الحقل.
     *
     * @returns النص الموجود داخل الحقل كـ Promise<string>.
     */
    public async getText(): Promise<string> {
        return this.execute(async () => {
            await this.waitUntilVisible();
            return await this.locator.inputValue();
        });
    }

}
