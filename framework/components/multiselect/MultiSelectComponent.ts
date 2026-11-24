import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../../core/base/BaseComponent';
import { Automation } from '../../core/automation/Automation';

/**
 * MultiSelect Component v1
 * 
 * يمثل قائمة منسدلة متعددة الاختيارات (Selection Component).
 * يعتمد على استراتيجية Derived Automation IDs لتحديد أجزائه (مثل `-search`, `-option`, `-clear`).
 */
export class MultiSelectComponent extends BaseComponent {

    protected readonly baseAutomationId: string;

    constructor(page: Page, automationId: string) {
        super(page, Automation.byId(automationId));
        this.baseAutomationId = automationId;
    }

    /** @internal Semantic Locator for Assertions */
    public tokens(): Locator {
        return this.page.locator(Automation.byId(`${this.baseAutomationId}-token`));
    }

    /**
     * فتح القائمة المنسدلة
     */
    public async open(): Promise<void> {
        await this.execute(async () => {
            await this.waitUntilVisible();
            await this.locator.click();
        });
    }

    /**
     * إغلاق القائمة المنسدلة (عبر ضغط مفتاح Escape)
     */
    public async close(): Promise<void> {
        await this.execute(async () => {
            await this.page.keyboard.press('Escape');
        });
    }

    /**
     * البحث داخل القائمة المنسدلة.
     * يرمي Exception إذا لم يجد حقل البحث. (مبدأ No Guessing).
     * @param term النص المراد البحث عنه
     */
    public async search(term: string): Promise<void> {
        await this.execute(async () => {
            const searchInput = this.page.locator(Automation.byId(`${this.baseAutomationId}-search`));
            
            // تحقق صريح من وجود حقل البحث (No Guessing)
            if (!(await searchInput.isVisible())) {
                throw new Error(`Search field not found for MultiSelect '${this.baseAutomationId}'.`);
            }
            
            await searchInput.fill(term);
        });
    }

    /**
     * اختيار مجموعة قيم بناءً على النص الظاهر للمستخدم.
     * @param values النصوص المراد اختيارها
     */
    public async select(values: string[]): Promise<void> {
        await this.execute(async () => {
            await this.open();
            
            const optionLocator = this.page.locator(Automation.byId(`${this.baseAutomationId}-option`));
            await optionLocator.first().waitFor({ state: 'attached' }); 
            
            for (const value of values) {
                const targetOption = optionLocator.filter({ hasText: value }).first();
                
                // نفترض أن العنصر يحتوي على checkbox أو يعتمد على aria-selected أو attribute مشابه لمعرفة حالته.
                // في PrimeNG قد يحتوي الخيار الداخلي على أيقونة الصح أو فئة 'p-highlight'.
                // للحفاظ على الاستقلالية، نكتفي بالنقر إذا لم نكن متأكدين من تحديده مسبقاً،
                // أو إذا كنا نعلم أن النقر يقوم بتبديل الحالة (Toggle).
                // للحصول على دقة 100% في الـ MultiSelect يجب التحقق من عدم كونه محدداً أصلاً،
                // ولكن كإصدار أول، النقر عليه كافٍ بناءً على افتراض أنه غير محدد.
                
                // يمكن التحقق من aria-selected إذا كان مدعوماً
                const isSelected = await targetOption.getAttribute('aria-selected') === 'true';
                if (!isSelected) {
                    await targetOption.click();
                }
            }
            
            await this.close();
        });
    }

    /**
     * إلغاء اختيار مجموعة قيم محددة.
     * @param values النصوص المراد إلغاء اختيارها
     */
    public async unselect(values: string[]): Promise<void> {
        await this.execute(async () => {
            await this.open();
            
            const optionLocator = this.page.locator(Automation.byId(`${this.baseAutomationId}-option`));
            await optionLocator.first().waitFor({ state: 'attached' }); 
            
            for (const value of values) {
                const targetOption = optionLocator.filter({ hasText: value }).first();
                
                const isSelected = await targetOption.getAttribute('aria-selected') === 'true';
                // بعض المكتبات تعتمد على checkbox داخلي، إذا كان aria-selected متاحاً نستخدمه
                if (isSelected) {
                    await targetOption.click();
                }
                // وإذا لم يكن aria-selected مستخدماً في المكتبة، سيتم الاعتماد على النقر دائماً 
                // أو يجب تخصيص الفحص بناءً على وجود checkbox محدد. سنكتفي حالياً بـ aria-selected.
            }
            
            await this.close();
        });
    }

    /**
     * مسح التحديد الحالي (تفريغ جميع التحديدات).
     */
    public async clear(): Promise<void> {
        await this.execute(async () => {
            const clearIcon = this.page.locator(Automation.byId(`${this.baseAutomationId}-clear`));
            
            if (await clearIcon.isVisible()) {
                await clearIcon.click();
            }
        });
    }

    /**
     * استرجاع القيم المحددة الحالية كنصوص.
     * @returns مصفوفة من النصوص المحددة
     */
    public async getSelectedValues(): Promise<string[]> {
        return await this.execute(async () => {
            await this.open();
            
            const optionLocator = this.page.locator(Automation.byId(`${this.baseAutomationId}-option`));
            if (await optionLocator.count() > 0) {
                // نبحث عن العناصر التي تحمل aria-selected="true" بشكل مباشر
                const selectedOptions = this.page.locator(`${Automation.byId(`${this.baseAutomationId}-option`)}[aria-selected="true"]`);
                const count = await selectedOptions.count();
                const texts: string[] = [];
                for (let i = 0; i < count; i++) {
                    texts.push((await selectedOptions.nth(i).innerText()).trim());
                }
                await this.close();
                return texts;
            }
            
            await this.close();
            return [];
        });
    }
}
