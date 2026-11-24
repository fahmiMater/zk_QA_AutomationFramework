import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../core/base/BaseComponent';
import { Automation } from '../../core/automation/Automation';
import { AutomationLocator } from '../../core/locators/AutomationLocator';

/**
 * Tabs Component v2
 *
 * يمثل مجموعة تبويبات داخل النظام بالاعتماد على المعايير الدلالية (Semantic HTML).
 *
 * المسؤوليات:
 * - قراءة التبويبات المتوفرة واختيار إحداها.
 * - معرفة التبويب النشط حالياً.
 * - التحقق من التبويبات المعطلة.
 */
export class TabsComponent extends BaseComponent {
    protected readonly baseAutomationId: string;

    /**
     * إنشاء مكون التبويبات.
     *
     * @param page الصفحة الحالية.
     * @param identifier Automation ID أو Locator جاهز أو String Selector.
     */
    constructor(page: Page, identifier: string | Locator) {
        const isId = typeof identifier === 'string' && AutomationLocator.isAutomationId(identifier);
        const locator = AutomationLocator.resolve(page, identifier);
            
        super(page, locator);
        this.baseAutomationId = isId ? (identifier as string) : 'tabs';
    }

    /** @internal Semantic Locator */
    public activeTab(): Locator {
        return this.page.locator(Automation.byId(`${this.baseAutomationId}-tab-active`)).or(this.locator.getByRole('tab', { selected: true }));
    }

    /** @internal Semantic Locator */
    public tabs(): Locator {
        return this.page.locator(Automation.byId(`${this.baseAutomationId}-tab`)).or(this.locator.getByRole('tab'));
    }

    /**
     * انتظار ظهور حاوية التبويبات (TabList).
     */
    public async waitUntilOpened(): Promise<void> {
        await this.waitUntilVisible();
    }

    /**
     * الحصول على أسماء جميع التبويبات.
     */
    public async getTabNames(): Promise<string[]> {
        const tabs = this.locator.getByRole('tab');
        const count = await tabs.count();
        const result: string[] = [];

        for (let i = 0; i < count; i++) {
            const text = await tabs.nth(i).textContent();
            result.push(text?.trim() ?? '');
        }

        return result;
    }

    /**
     * إرجاع عدد التبويبات المتاحة.
     */
    public async getTabCount(): Promise<number> {
        return await this.locator.getByRole('tab').count();
    }

    /**
     * التحقق من وجود التبويب بناءً على معرّفه الدلالي.
     *
     * @param tabId المعرف الخاص بالتبويب (مثال: 'sales')
     */
    public async hasTab(tabId: string): Promise<boolean> {
        const tab = this.page.locator(Automation.byId(`${this.baseAutomationId}-tab-${tabId}`));
        return await tab.count() > 0;
    }

    /**
     * الحصول على اسم التبويب النشط حالياً.
     */
    public async getActiveTab(): Promise<string> {
        const activeTab = this.locator.getByRole('tab', { selected: true });
        const text = await activeTab.textContent();
        return text?.trim() ?? '';
    }

    /**
     * الانتقال إلى تبويب محدد عبر النقر عليه بناءً على معرّفه الدلالي.
     *
     * @param tabId المعرف الخاص بالتبويب
     */
    public async selectTab(tabId: string): Promise<void> {
        const tab = this.page.locator(Automation.byId(`${this.baseAutomationId}-tab-${tabId}`));
        
        if (await tab.count() === 0) {
            throw new Error(`Tab not found: ${tabId}`);
        }
        
        await tab.click();
    }

    /**
     * التحقق مما إذا كان التبويب معطلاً بناءً على معرّفه الدلالي.
     * 
     * @param tabId المعرف الخاص بالتبويب
     */
    public async isTabDisabled(tabId: string): Promise<boolean> {
        const tab = this.page.locator(Automation.byId(`${this.baseAutomationId}-tab-${tabId}`));
        
        if (await tab.count() === 0) {
            throw new Error(`Tab not found: ${tabId}`);
        }
        
        return await tab.isDisabled();
    }
}