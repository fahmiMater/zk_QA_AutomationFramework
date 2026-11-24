import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../core/base/BaseComponent';

/**
 * TreeNode Component v2
 *
 * يمثل عقدة فردية داخل مكون الشجرة.
 */
export class TreeNodeComponent extends BaseComponent {

    /**
     * إنشاء مكون عقدة الشجرة.
     *
     * @param page الصفحة الحالية.
     * @param locator الـ Locator الخاص بالعقدة (`role="treeitem"`).
     */
    constructor(page: Page, locator: Locator) {
        super(page, locator);
    }

    /**
     * توسيع العقدة لفتح الأبناء.
     * لا يقوم بشيء إذا كانت العقدة موسعة بالفعل أو ليس لديها أبناء.
     */
    public async expand(): Promise<void> {
        if (!(await this.hasChildren())) {
            return; // العقدة لا تمتلك أبناء
        }

        if (!(await this.isExpanded())) {
            // النقر على العقدة لتوسيعها
            // عادةً يُستخدم زر التوسيع الداخلي أو النقر المزدوج، 
            // لكن قياسياً النقر على العنصر الذي يحمل aria-expanded يوسعه.
            // إذا كان الـ ERP يفضل النقر المزدوج أو الأيقونة يمكننا تحديث هذا السلوك،
            // النقر على الزاوية العلوية اليسرى لتفادي النقر على الأبناء في حال كانت العقدة حاوية كبيرة
            await this.locator.click({ position: { x: 10, y: 10 } });
            
            // انتظار لتفادي Flakiness أثناء الحركة
            await this.page.waitForTimeout(300); // Wait for potential animation/lazy load
        }
    }

    /**
     * طي العقدة لإخفاء الأبناء.
     * لا يقوم بشيء إذا كانت مطوية أو ليس لديها أبناء.
     */
    public async collapse(): Promise<void> {
        if (!(await this.hasChildren())) {
            return;
        }

        if (await this.isExpanded()) {
            await this.locator.click({ position: { x: 10, y: 10 } });
            await this.page.waitForTimeout(300);
        }
    }

    /**
     * تحديد العقدة بالنقر عليها.
     */
    public async select(): Promise<void> {
        await this.locator.click({ position: { x: 10, y: 10 } });
    }

    /**
     * التحقق مما إذا كانت العقدة موسعة.
     *
     * @returns صحيح إذا كانت موسعة، وإلا خطأ.
     */
    public async isExpanded(): Promise<boolean> {
        const expandedAttr = await this.locator.getAttribute('aria-expanded');
        return expandedAttr === 'true';
    }

    /**
     * التحقق مما إذا كانت العقدة تمتلك أبناء (لها قابلية التوسيع).
     *
     * @returns صحيح إذا كان للعقدة أبناء.
     */
    public async hasChildren(): Promise<boolean> {
        const expandedAttr = await this.locator.getAttribute('aria-expanded');
        // إذا كان يحتوي على aria-expanded (سواء true أو false) فهذا يعني أنه قابل للتوسيع ويمتلك أبناء
        return expandedAttr !== null;
    }

    /**
     * الحصول على النص الظاهر للعقدة.
     *
     * @returns اسم العقدة.
     */
    public async getText(): Promise<string> {
        const text = await this.locator.textContent();
        return text?.trim() ?? '';
    }
}
