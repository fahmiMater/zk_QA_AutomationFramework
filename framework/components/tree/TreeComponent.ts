import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../core/base/BaseComponent';
import { Automation } from '../../core/automation/Automation';
import { TreeNodeComponent } from './TreeNodeComponent';

/**
 * Tree Component v2
 *
 * يمثل الهيكل الخارجي للشجرة ويتولى مهام البحث والوصول للعقد (Composite Architecture).
 */
export class TreeComponent extends BaseComponent {

    protected readonly baseAutomationId: string;

    /**
     * إنشاء مكون الشجرة.
     *
     * @param page الصفحة الحالية.
     * @param automationId المعرف التلقائي للشجرة.
     */
    constructor(page: Page, automationId: string) {
        super(page, Automation.byId(automationId));
        this.baseAutomationId = automationId;
    }

    /** @internal Semantic Locator for Assertions */
    public nodeLocator(text: string): Locator {
        return this.page.locator(Automation.byId(`${this.baseAutomationId}-node-${text.toLowerCase().replace(/\s+/g, '-')}`));
    }

    /** @internal Semantic Locator for Assertions */
    public nodeIcon(text: string): Locator {
        return this.page.locator(Automation.byId(`${this.baseAutomationId}-node-${text.toLowerCase().replace(/\s+/g, '-')}-icon`));
    }

    /**
     * انتظار ظهور الشجرة.
     */
    public async waitUntilOpened(): Promise<void> {
        await this.waitUntilVisible();
    }

    /**
     * الوصول إلى عقدة عبر مسارها، مع توسيع العقد الأبوية آلياً (Auto-expand) للوصول إليها.
     *
     * @param path مسار العقد المتسلسل (مثال: ['Finance', 'Customers', 'Invoices']).
     * @returns كائن TreeNodeComponent للعقدة النهائية.
     */
    public async node(path: string[]): Promise<TreeNodeComponent> {
        if (!path || path.length === 0) {
            throw new Error('Path cannot be empty');
        }

        let currentNodeLocator: Locator | null = null;

        for (let i = 0; i < path.length; i++) {
            const nodeName = path[i];
            
            // في المعايير الدلالية، العقد الأبناء تكون غالباً ضمن role="group" أو مجرد treeitem
            // إذا كنا نبحث عن العقدة الأولى، نبحث مباشرة داخل الشجرة.
            // إذا كنا نبحث عن الأبناء، نستمر بالبحث كـ treeitem يطابق الاسم.
            // لتجنب الأخطاء بسبب عدم توحيد الـ DOM، سنبحث ببساطة عن الـ treeitem المرغوب
            // الذي يحتوي على النص المطلوب داخل نطاق الشجرة بالكامل.
            // لكن لضمان التسلسل الصحيح (وعدم الخلط إذا كان اسم العقدة مكرراً)، يمكن الاستفادة من aria-level
            const level = i + 1;
            
            // نبحث عن الـ treeitem الذي يحتوي على النص المحدد، وفي نفس مستوى الـ aria-level
            const targetLocator = this.locator.getByRole('treeitem', { name: nodeName, exact: true });

            const count = await targetLocator.count();
            if (count === 0) {
                // إذا لم نعثر عليها بـ exact، نحاول بـ exact: false مؤقتاً كاحتياط
                const fallbackLocator = this.locator.getByRole('treeitem', { name: nodeName });
                if (await fallbackLocator.count() === 0) {
                    throw new Error(`Node not found at path: ${path.slice(0, i + 1).join(' -> ')}`);
                }
                currentNodeLocator = fallbackLocator.first();
            } else {
                // نأخذ أول نتيجة لأن aria-level أو بنية الشجرة المعقدة قد تجعل getByRole تجد أكثر من عنصر
                // سنفترض أن الاسم فريد أو أننا نعتمد على أول واحد إذا تكرر.
                // (في إصدارات متقدمة يمكن تقييد البحث ليكون child للعقدة الأبوية السابقة فقط)
                currentNodeLocator = targetLocator.first();
            }

            const treeNode = new TreeNodeComponent(this.page, currentNodeLocator);

            // إذا لم تكن العقدة الأخيرة في المسار، يجب أن نوسعها لنتمكن من البحث عن أبنائها في الدورة القادمة
            if (i < path.length - 1) {
                await treeNode.expand();
            } else {
                // وصلنا للعقدة النهائية
                return treeNode;
            }
        }

        throw new Error('Unexpected Error: Could not resolve tree node.');
    }
}
