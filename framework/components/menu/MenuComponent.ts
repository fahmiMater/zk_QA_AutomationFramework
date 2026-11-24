import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../core/base/BaseComponent';
import { Automation } from '../../core/automation/Automation';
import { AutomationLocator } from '../../core/locators/AutomationLocator';
import { MenuItemComponent } from './MenuItemComponent';

/**
 * Menu Component v2
 *
 * يمثل الهيكل الخارجي للقائمة (Menu, MenuBar, TieredMenu).
 * يعتمد على المعايير الدلالية `role="menu"` أو `role="menubar"`.
 */
export class MenuComponent extends BaseComponent {
    protected readonly baseAutomationId: string;

    /**
     * إنشاء مكون القائمة.
     *
     * @param page الصفحة الحالية.
     * @param identifier Automation ID أو Locator أو String Selector.
     */
    constructor(page: Page, identifier: string | Locator) {
        const isId = typeof identifier === 'string' && AutomationLocator.isAutomationId(identifier);
        const locator = AutomationLocator.resolve(page, identifier);
            
        super(page, locator);
        this.baseAutomationId = isId ? (identifier as string) : 'menu';
    }

    /** @internal Semantic Locator */
    public itemLocator(text: string): Locator {
        return this.page.locator(Automation.byId(`${this.baseAutomationId}-item-${text.toLowerCase().replace(/\s+/g, '-')}`));
    }

    /**
     * انتظار ظهور القائمة.
     */
    public async waitUntilOpened(): Promise<void> {
        await this.waitUntilVisible();
    }

    /**
     * تفتح القائمة إذا كانت مرتبطة بزر فتح (Menu Trigger).
     * لا حاجة لاستدعائها في القوائم الظاهرة دائماً كـ Menubar.
     *
     * ملاحظة: يجب أن يمرر المبرمج زر الفتح إذا لزم الأمر، 
     * أو تكون القائمة هي الزر بحد ذاته (Dropdown Button).
     * في تطبيقنا، سنفترض النقر على الحاوية نفسها كطريقة لفتحها إن كانت مغلقة.
     */
    public async open(): Promise<void> {
        if (!(await this.isVisible())) {
            // هذا يعتمد على سياق التطبيق. عادة يتم تمرير زر منفصل للقائمة
            // ولكننا سنقوم بمحاولة النقر على العنصر الرئيسي
            await this.locator.click();
            await this.waitUntilVisible();
        }
    }

    /**
     * تتبع المسار في القائمة (مثال: `['File', 'New', 'Document']`).
     * وتقوم بعمل Hover متسلسل للقوائم الفرعية تلقائياً إذا لزم الأمر للوصول للعنصر النهائي.
     *
     * @param path مصفوفة تمثل المسار المتسلسل للعناصر.
     * @returns كائن MenuItemComponent للعنصر النهائي.
     */
    public async item(path: string[]): Promise<MenuItemComponent> {
        if (!path || path.length === 0) {
            throw new Error('Menu item path cannot be empty');
        }

        let currentMenuItemLocator: Locator | null = null;

        for (let i = 0; i < path.length; i++) {
            const itemName = path[i];

            // في القوائم المنسدلة المعيارية، يتم إرفاق القوائم الفرعية في الـ DOM بعد الـ Hover 
            // أو تكون موجودة وتظهر فقط بعد الـ Hover.
            // لضمان الاستقرار، نبحث عن الـ menuitem بالاسم المطلوب في كامل الصفحة
            // في حال كانت مكتبة UI تفصل القوائم المنبثقة (Portals) خارج حاوية القائمة الأصلية.
            
            let targetLocator: Locator;
            
            // بالنسبة للعنصر الأول، نتوقع أن يكون داخل المكون الأساسي
            if (i === 0) {
                targetLocator = this.locator.getByRole('menuitem', { name: itemName, exact: true });
                if (await targetLocator.count() === 0) {
                    // Try fallback
                    targetLocator = this.locator.getByRole('menuitem', { name: itemName });
                }
            } else {
                // العناصر الفرعية غالباً تكون في Portals (مُلحقة بـ body)، 
                // لذا يفضل البحث عنها في الـ Page مباشرة لتفادي مشاكل الـ DOM المقطوع
                targetLocator = this.page.getByRole('menuitem', { name: itemName, exact: true });
                // We scope it to visible items to avoid finding hidden/unrelated menus with the same name
                // Though getByRole usually handles visible/interactable naturally, let's just grab the first visible one
            }

            // إذا كان هناك أكثر من عنصر (خصوصاً عند البحث العام)، نختار أول عنصر ظاهر
            const count = await targetLocator.count();
            let found = false;
            for (let j = 0; j < count; j++) {
                if (await targetLocator.nth(j).isVisible()) {
                    currentMenuItemLocator = targetLocator.nth(j);
                    found = true;
                    break;
                }
            }

            if (!found || !currentMenuItemLocator) {
                // Fallback to the first one just in case Playwright considers it hidden temporarily
                if (count > 0) {
                    currentMenuItemLocator = targetLocator.first();
                } else {
                    throw new Error(`Menu item not found at path: ${path.slice(0, i + 1).join(' -> ')}`);
                }
            }

            const menuItem = new MenuItemComponent(this.page, currentMenuItemLocator);

            // إذا لم يكن هذا العنصر النهائي، نقوم بعمل Hover لفتح القائمة التي تليه
            if (i < path.length - 1) {
                // تأكد أن العنصر يمتلك أطفالاً لتجنب الـ Hover غير الضروري أو الأخطاء
                if (await menuItem.hasChildren()) {
                    await currentMenuItemLocator.hover();
                    // تأخير بسيط لضمان انتهاء انيميشن القائمة الفرعية (CSS Transitions)
                    await this.page.waitForTimeout(300);
                } else {
                    // إذا لم يكن للعنصر النهائي قائمة فرعية، ولا يزال هناك عناصر في المسار فهذا خطأ في بنية المسار
                    throw new Error(`Menu item '${itemName}' does not have a submenu, cannot proceed to '${path[i + 1]}'`);
                }
            } else {
                // وصلنا للهدف
                return menuItem;
            }
        }

        throw new Error('Unexpected Error: Could not resolve menu item.');
    }
}
