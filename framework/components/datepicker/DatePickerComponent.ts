import { Page } from '@playwright/test';
import { BaseComponent } from '../../core/base/BaseComponent';
import { DatePickerAssertions } from '../../core/assertions/components/datepicker/DatePickerAssertions';
import { Automation } from '../../core/automation/Automation';

/**
 * DatePickerComponent
 * 
 * يمثل مكون التقويم (p-datepicker / p-calendar).
 * يعتمد على Derived Automation IDs للحقل وزر الفتح (-input, -trigger).
 * ويعتمد على ARIA Roles والنصوص للتعامل مع الأحشاء الداخلية للتقويم (Overlay) 
 * لتخفيف العبء على مطوري الواجهات ولتجنب استخدام كلاسات PrimeNG.
 */
export class DatePickerComponent extends BaseComponent {

    private readonly assertions: DatePickerAssertions;

    protected readonly baseAutomationId: string;

    /**
     * @param page كائن Playwright Page
     * @param automationId المعرّف الأساسي للمكون (مثال: 'invoice-date')
     */
    constructor(page: Page, automationId: string) {
        // الـ Locator الأساسي للمكون سيكون حاوية الإدخال أو الـ wrapper إذا أردنا.
        // للتبسيط، نمرر المعرف الأساسي ونشتق منه في الدوال.
        super(page, Automation.byId(automationId));
        this.assertions = new DatePickerAssertions(this);
        this.baseAutomationId = automationId;
    }

    /**
     * الوصول إلى توكيدات المكون.
     */
    public assert(): DatePickerAssertions {
        return this.assertions;
    }

    /**
     * إدخال التاريخ مباشرة كنص في الحقل.
     * @param dateText النص المراد إدخاله (مثال: '2026-07-11')
     */
    public async setDate(dateText: string): Promise<void> {
        await this.execute(async () => {
            const inputLocator = this.page.locator(Automation.byId(`${this.baseAutomationId}-input`));
            await inputLocator.waitFor({ state: 'visible' });
            await inputLocator.clear();
            await inputLocator.fill(dateText);
            // محاكاة الخروج من الحقل لكي يقرأ PrimeNG القيمة ويطبقها
            await inputLocator.blur();
        });
    }

    /**
     * فتح نافذة التقويم (Overlay).
     */
    public async openCalendar(): Promise<void> {
        await this.execute(async () => {
            const triggerLocator = this.page.locator(Automation.byId(`${this.baseAutomationId}-trigger`));
            
            // نتحقق إن كان التقويم مفتوحاً مسبقاً (عادة PrimeNG يعطي aria-expanded)
            // إذا لم نتمكن من ذلك ببساطة ننقر على الزر.
            if (await triggerLocator.isVisible()) {
                await triggerLocator.click();
            } else {
                // إذا لم يوجد زر trigger، ننقر على حقل الإدخال ليفتح التقويم
                const inputLocator = this.page.locator(Automation.byId(`${this.baseAutomationId}-input`));
                await inputLocator.click();
            }
        });
    }

    /**
     * اختيار تاريخ محدد من واجهة التقويم باستخدام ARIA والنصوص المرئية.
     * @param year السنة
     * @param month الشهر (1-12)
     * @param day اليوم
     */
    public async selectDate(year: number, month: number, day: number): Promise<void> {
        await this.openCalendar();
        
        await this.execute(async () => {
            // هذا مجرد تبسيط (Mock Implementation) يعتمد على قدرات ARIA الافتراضية
            // يتم ضبط هذه الـ Locators حسب ما تولده PrimeNG للـ ARIA (عادة تولد أزرار بـ aria-label)
            
            // اختيار السنة (مبسط)
            // في الواقع، اختيار السنة والشهر في PrimeNG قد يحتاج لفتح قوائم منسدلة داخل الـ overlay
            // أو النقر المتكرر على أزرار "الشهر التالي/السابق"
            
            // لاختيار اليوم، PrimeNG عادة تضع الأيام في أزرار أو خلايا جدول:
            // سنبحث عن العنصر الذي يحتوي على النص الدقيق لليوم المعين ويكون قابل للنقر.
            // نستخدم exact: true لتجنب مطابقة "25" مع "5" أو "15"
            const dayLocator = this.page.getByText(day.toString(), { exact: true }).filter({
                hasNot: this.page.locator('[aria-disabled="true"]') // تفادي الأيام المعطلة أو التي خارج الشهر
            });
            
            await dayLocator.first().click();
        });
    }

    /**
     * قراءة التاريخ الحالي من حقل الإدخال.
     */
    public async getDate(): Promise<string> {
        return await this.execute(async () => {
            const inputLocator = this.page.locator(Automation.byId(`${this.baseAutomationId}-input`));
            return await inputLocator.inputValue();
        });
    }

    /**
     * مسح التاريخ (إفراغ الحقل أو استخدام زر Clear).
     */
    public async clear(): Promise<void> {
        await this.execute(async () => {
            const clearLocator = this.page.locator(Automation.byId(`${this.baseAutomationId}-clear`));
            
            if (await clearLocator.isVisible()) {
                await clearLocator.click();
            } else {
                const inputLocator = this.page.locator(Automation.byId(`${this.baseAutomationId}-input`));
                await inputLocator.clear();
                await inputLocator.blur(); // Trigger update
            }
        });
    }

    /**
     * التحقق من حالة التعطيل.
     */
    public async isDisabled(): Promise<boolean> {
        return await this.execute(async () => {
            const inputLocator = this.page.locator(Automation.byId(`${this.baseAutomationId}-input`));
            const disabledAttr = await inputLocator.getAttribute('disabled');
            return disabledAttr !== null;
        });
    }
}
