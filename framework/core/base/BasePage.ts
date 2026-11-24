import type {
    Page
} from "@playwright/test";

import { ComponentFactory } from '../factory/ComponentFactory';

/**
 * ============================================================
 * BasePage
 * ============================================================
 *
 * الفئة الأساسية (Base Class) لجميع صفحات النظام داخل
 * QA Automation SDK.
 *
 * يمثل BasePage الطبقة المسؤولة عن إدارة الصفحة كاملة،
 * ويعمل كنقطة انطلاق موحدة لجميع الصفحات.
 *
 * المسؤوليات:
 *
 * - إدارة كائن Playwright Page.
 * - توفير نقطة وصول لمصنع المكونات (ComponentFactory).
 * - توحيد دورة حياة الصفحة.
 * - توفير الخدمات المشتركة لجميع الصفحات.
 * - منع تكرار الكود.
 *
 * لا يحتوي BasePage على:
 *
 * - منطق الأعمال (Business Logic).
 * - تنفيذ سيناريوهات الاختبار.
 * - أي سلوك خاص بصفحة معينة.
 *
 * جميع الصفحات داخل النظام يجب أن ترث من هذا الكلاس.
 */
export abstract class BasePage {

      /**
     * ============================================================
     * Properties
     * ============================================================
     */

    /**
     * كائن Playwright المسؤول عن إدارة الصفحة الحالية.
     *
     * يستخدم هذا الكائن من قبل جميع الوظائف المشتركة
     * داخل BasePage.
     */
    protected readonly page: Page;

    /**
     * مصنع المكونات (Component Factory).
     *
     * يوفر وصولاً مباشراً لبناء المكونات (TextBox, Grid, Tree...)
     * داخل الـ Page Objects المشتقة باستخدام Automation IDs.
     */
    protected readonly components: ComponentFactory;


        /**
     * ============================================================
     * Required Properties
     * ============================================================
     */

    /**
     * عنوان الصفحة (URL).
     *
     * يجب على كل صفحة مشتقة تحديد عنوانها الخاص.
     *
     * مثال:
     *
     * /login
     * /sales
     * /journal-entry
     */
    protected abstract readonly url: string;

    /**
     * اسم الصفحة.
     *
     * يستخدم لأغراض:
     *
     * - التشخيص.
     * - Logging.
     * - التقارير.
     * - التحقق من الصفحة.
     */
    protected abstract readonly title: string;


        /**
     * ============================================================
     * Constructor
     * ============================================================
     */

    /**
     * إنشاء صفحة جديدة.
     *
     * يقوم الـ Constructor باستقبال كائن Playwright Page
     * وربطه بالصفحة الحالية وبناء مصنع المكونات.
     *
     * لا يقوم بأي عمليات إضافية مثل:
     *
     * - الانتقال إلى الصفحة.
     * - التحقق من الصفحة.
     * - إنشاء المكونات.
     *
     * سيتم تنفيذ هذه العمليات خلال دورة حياة الصفحة
     * (Page Lifecycle).
     *
     * @param page
     * كائن Playwright Page.
     */
    protected constructor(
        page: Page
    ) {

        this.page = page;
        this.components = new ComponentFactory(page);

    }

    /**
     * ============================================================
     * Public API
     * ============================================================
     */

    /**
     * إرجاع كائن Playwright Page.
     *
     * يوفر هذا الأسلوب نقطة وصول موحدة إلى الصفحة الحالية
     * مع الحفاظ على مبدأ إخفاء تفاصيل التنفيذ.
     *
     * يستخدم عند الحاجة للوصول إلى وظائف Playwright
     * غير المغطاة داخل BasePage.
     *
     * @returns كائن Playwright Page.
     */
    public getPage(): Page {

        return this.page;

    }

    /**
     * إرجاع عنوان الصفحة المتوقع.
     *
     * يعيد قيمة URL المعرفة داخل الصفحة المشتقة،
     * ويستخدم لأغراض:
     *
     * - التشخيص.
     * - التحقق من الصفحة.
     * - إنشاء التقارير.
     *
     * @returns عنوان الصفحة المتوقع.
     */
    public getUrl(): string {

        return this.url;

    }

        /**
     * إرجاع اسم الصفحة.
     *
     * يستخدم هذا الأسلوب للحصول على اسم الصفحة
     * لأغراض:
     *
     * - Logging.
     * - التقارير.
     * - التشخيص.
     *
     * @returns اسم الصفحة.
     */
    public getTitle(): string {

        return this.title;

    }

        /**
     * إرجاع معلومات الصفحة.
     *
     * يستخدم هذا الأسلوب في:
     *
     * - Logging.
     * - Diagnostics.
     * - Reporting.
     *
     * @returns معلومات الصفحة الحالية.
     */
    public getPageInfo(): {

        title: string;

        url: string;

    } {

        return {

            title: this.getTitle(),

            url: this.getUrl()

        };

    }

    /**
 * الانتقال إلى الصفحة.
 *
 * يقوم هذا الأسلوب بالانتقال إلى عنوان الصفحة
 * المعرفة داخل الصفحة المشتقة.
 *
 * لا يقوم هذا الأسلوب بالتحقق من صحة الصفحة،
 * وإنما يقتصر على تنفيذ عملية التنقل فقط.
 *
 * تستخدم validatePage() للتحقق من نجاح
 * عملية الانتقال.
 *
 * @returns Promise يتم حله عند انتهاء عملية التنقل.
 */
public async navigate(): Promise<void> {

    await this.page.goto(
        this.url
    );

}

/**
 * انتظار اكتمال تحميل الصفحة.
 *
 * يستخدم هذا الأسلوب انتظار حالة تحميل الصفحة
 * قبل البدء في تنفيذ العمليات الأخرى.
 *
 * في الإصدار الحالي يعتمد على حالة "load"،
 * ويمكن تطوير استراتيجية الانتظار مستقبلاً
 * دون تغيير الواجهة العامة.
 *
 * @returns Promise يتم حله عند اكتمال تحميل الصفحة.
 */
public async waitForLoad(): Promise<void> {

    await this.page.waitForLoadState(
        "load"
    );

}

    /**
     * ============================================================
     * Validation
     * ============================================================
     */

    /**
     * التحقق من أن الصفحة الحالية هي الصفحة الصحيحة.
     *
     * لا يفرض BasePage طريقة معينة للتحقق،
     * وإنما يترك لكل صفحة مشتقة تحديد آلية
     * التحقق المناسبة لها.
     *
     * أمثلة:
     *
     * - التحقق من URL.
     * - التحقق من عنصر مميز.
     * - التحقق من عنوان الصفحة.
     *
     * @returns Promise يحتوي نتيجة التحقق.
     */
    public abstract validatePage(): Promise<boolean>;

        /**
     * التحقق من أن الصفحة مفتوحة.
     *
     * يعتمد هذا الأسلوب على validatePage()
     * بحيث يوفر نقطة دخول موحدة لبقية
     * مكونات الـ SDK.
     *
     * @returns Promise يحتوي نتيجة التحقق.
     */
    public async isOpen(): Promise<boolean> {

        return await this.validatePage();

    }

        /**
     * ============================================================
     * Diagnostics
     * ============================================================
     */

    /**
     * التقاط صورة للصفحة الحالية.
     *
     * يستخدم هذا الأسلوب لتوثيق حالة الصفحة أثناء
     * تنفيذ الاختبارات أو عند تحليل الأخطاء.
     *
     * @param path
     * مسار حفظ الصورة.
     *
     * @returns Promise يتم حله بعد حفظ الصورة.
     */
    public async screenshot(
        path: string
    ): Promise<void> {

        await this.page.screenshot({

            path

        });

    }

        /**
     * ============================================================
     * Execution Pipeline
     * ============================================================
     */

    /**
     * تنفيذ عملية داخل الصفحة.
     *
     * يوفر هذا الأسلوب نقطة موحدة لتنفيذ العمليات
     * المشتركة داخل BasePage، مع إمكانية إضافة:
     *
     * - Logging.
     * - Retry Strategy.
     * - Performance Metrics.
     * - Error Handling.
     *
     * دون تعديل الصفحات المشتقة.
     *
     * @param action
     * العملية المطلوب تنفيذها.
     *
     * @returns ناتج تنفيذ العملية.
     */
    protected async execute<T>(
        action: () => Promise<T>
    ): Promise<T> {

        try {

            return await this.retry(
                action
            );

        } catch (error) {

            this.handleError(
                error
            );

        }

    }


        /**
     * إعادة تنفيذ العملية عند الحاجة.
     *
     * تم إنشاء هذا الأسلوب كجزء من العقد المعماري
     * لـ BasePage.
     *
     * سيتم تطوير استراتيجية إعادة المحاولة
     * في مهمة مستقلة لاحقاً.
     *
     * @param action
     * العملية المطلوب تنفيذها.
     *
     * @returns ناتج تنفيذ العملية.
     */
    protected async retry<T>(
        action: () => Promise<T>
    ): Promise<T> {

        return await action();

    }

    /**
     * معالجة الأخطاء.
     *
     * يوفر هذا الأسلوب نقطة موحدة لمعالجة الأخطاء
     * داخل BasePage.
     *
     * سيتم تطويره مستقبلاً لإضافة:
     *
     * - Logging.
     * - Screenshot.
     * - Error Reports.
     *
     * @param error
     * الخطأ الذي حدث.
     */
    protected handleError(
        error: unknown
    ): never {

        throw error;

    }

    
    }