import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../core/base/BaseComponent';
import { Automation } from '../../core/automation/Automation';
import { AutomationLocator } from '../../core/locators/AutomationLocator';
import { NotificationItemComponent } from './NotificationItemComponent';

/**
 * NotificationCenter Component v2
 *
 * يُدير مركز الإشعارات (Composite + Transient Component).
 * يتعامل مع أيقونة الجرس، וلـ Badge، واللوحة المنبثقة، وقائمة الإشعارات.
 */
export class NotificationCenterComponent extends BaseComponent {
    protected readonly baseAutomationId: string;

    /**
     * الحاوية المنبثقة للإشعارات.
     * غالباً تكون منفصلة عن زر الجرس في الـ DOM (مثلاً في body).
     */
    private overlayLocator: Locator;

    /**
     * إنشاء مكون مركز الإشعارات.
     *
     * @param page الصفحة الحالية.
     * @param triggerIdentifier مُعرف زر فتح الإشعارات (الجرس).
     * @param overlayIdentifier مُعرف لوحة الإشعارات المنبثقة (اختياري، يبحث عن `role="dialog"` أو `region` افتراضياً).
     */
    constructor(page: Page, triggerIdentifier: string | Locator, overlayIdentifier?: string | Locator) {
        const isId = typeof triggerIdentifier === 'string' && AutomationLocator.isAutomationId(triggerIdentifier);
        const trigger = AutomationLocator.resolve(page, triggerIdentifier);
            
        super(page, trigger);

        this.baseAutomationId = isId ? (triggerIdentifier as string) : 'notification';

        if (overlayIdentifier) {
            this.overlayLocator = typeof overlayIdentifier === 'string'
                ? page.locator(overlayIdentifier.startsWith('.') || overlayIdentifier.startsWith('//') ? overlayIdentifier : Automation.byId(overlayIdentifier))
                : overlayIdentifier;
        } else {
            // افتراضياً نبحث عن حاوية الإشعارات من خلال الدلالات
            this.overlayLocator = page.getByRole('dialog', { name: /notification|إشعار/i }).or(page.locator('[data-automation-id="notification-overlay"]'));
        }
    }

    /** @internal Semantic Locator */
    public badge(): Locator {
        return this.page.locator(Automation.byId(`${this.baseAutomationId}-badge`));
    }

    /** @internal Semantic Locator */
    public itemLocator(text: string): Locator {
        return this.page.locator(Automation.byId(`${this.baseAutomationId}-item-${text.toLowerCase().replace(/\s+/g, '-')}`));
    }

    /**
     * فتح مركز الإشعارات إن لم يكن مفتوحاً.
     */
    public async open(): Promise<void> {
        if (!(await this.overlayLocator.isVisible())) {
            await this.locator.click();
            await this.overlayLocator.waitFor({ state: 'visible' });
        }
    }

    /**
     * قراءة عدد الإشعارات غير المقروءة من الـ Badge.
     * يعتمد على `role="status"` بداخل الـ trigger.
     *
     * @returns العدد كقم صحيح، أو 0 إذا لم يوجد.
     */
    public async getUnreadCount(): Promise<number> {
        const badge = this.locator.getByRole('status').or(this.locator.locator('.badge, [data-badge]'));
        if (await badge.count() > 0) {
            const text = await badge.first().textContent();
            const count = parseInt(text?.trim() ?? '0', 10);
            return isNaN(count) ? 0 : count;
        }
        return 0;
    }

    /**
     * استرجاع جميع الإشعارات المحملة حالياً في الـ DOM.
     * (لا يقوم بعمل Infinite Scroll).
     *
     * @returns مصفوفة من كائنات NotificationItemComponent.
     */
    public async items(): Promise<NotificationItemComponent[]> {
        // البحث عن الـ items داخل الـ overlay
        // قد يكون role="listitem" أو automation-id
        let itemsLocator = this.overlayLocator.getByRole('listitem');
        
        let count = await itemsLocator.count();
        if (count === 0) {
            itemsLocator = this.overlayLocator.locator('[data-automation-id="notification-item"]');
            count = await itemsLocator.count();
        }

        const items: NotificationItemComponent[] = [];
        for (let i = 0; i < count; i++) {
            items.push(new NotificationItemComponent(this.page, itemsLocator.nth(i)));
        }

        return items;
    }

    /**
     * استرجاع أحدث إشعار معروض.
     * اختصار لجلب أول عنصر في القائمة.
     *
     * @returns أحدث NotificationItemComponent.
     */
    public async latest(): Promise<NotificationItemComponent> {
        const allItems = await this.items();
        if (allItems.length === 0) {
            throw new Error('No notifications found in the Notification Center.');
        }
        return allItems[0];
    }

    /**
     * النقر على زر "تعليم الكل كمقروء" (Mark all as read).
     * لا يقوم بالتحقق من النتيجة. مجرد ضغط على الزر.
     */
    public async markAllAsRead(): Promise<void> {
        const markAllBtn = this.overlayLocator.getByRole('button', { name: /mark all|مقروء/i });
        if (await markAllBtn.count() > 0) {
            await markAllBtn.first().click();
        } else {
            throw new Error('Mark all as read button not found.');
        }
    }
}
