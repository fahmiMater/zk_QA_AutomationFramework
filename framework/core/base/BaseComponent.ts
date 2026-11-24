import { Locator, Page } from '@playwright/test';

/**
 * BaseComponent
 *
 * Parent class for all UI components.
 */
export abstract class BaseComponent {

    protected readonly page: Page;

    protected readonly locator: Locator;

    protected readonly selector: string;

    constructor(
        page: Page,
        selectorOrLocator: string | Locator
    ) {

        this.page = page;

        if (typeof selectorOrLocator === 'string') {
            this.selector = selectorOrLocator;
        } else {
            this.selector = 'dynamic-locator';
        }
        
        // التحويل يعتمد على مكونات خارجية أو يمكننا الاعتماد على page مباشرة
        // للحفاظ على عمل AutomationLocator.resolve يجب استدعاؤه هنا أو في المكونات الفرعية.
        // نظراً لوجود استدعاءات مختلفة في المكونات المعقدة سنحتفظ هنا بتهيئة مباشرة
        // إذا كان المكون يرسل Locator نأخذه كما هو.
        this.locator = typeof selectorOrLocator === 'string' ? page.locator(selectorOrLocator) : selectorOrLocator;

    }
  /**
 * إرجاع كائن Locator الخاص بالمكون.
 *
 * يوفر هذا الأسلوب نقطة وصول موحدة إلى Locator الداخلي
 * مع الحفاظ على إخفاء تفاصيل التنفيذ عن المستخدم.
 *
 * يستخدم هذا الأسلوب عند الحاجة إلى تنفيذ عمليات متقدمة
 * لا يوفرها BaseComponent بصورة مباشرة.
 *
 * @returns كائن Locator الخاص بالمكون.
 */
public getLocator(): Locator {

    return this.locator;

}
   /**
 * إرجاع المحدد (Selector) المستخدم لإنشاء المكون.
 *
 * يستخدم هذا الأسلوب لأغراض:
 *
 * - تسجيل العمليات (Logging).
 * - تشخيص الأخطاء.
 * - إنشاء التقارير.
 * - عرض معلومات المكون.
 *
 * @returns قيمة Selector الخاصة بالمكون.
 */
public getSelector(): string {

    return this.selector;

}

 /**
 * التحقق من صحة Locator الخاص بالمكون.
 *
 * في المرحلة الحالية لا تحتوي هذه الدالة على أي منطق،
 * وإنما تم إنشاؤها كجزء من العقد المعماري (Contract)
 * لـ BaseComponent.
 *
 * سيتم تنفيذ منطق التحقق في مرحلة Validation.
 *
 * يمكن للمكونات المشتقة إعادة تعريف هذه الدالة إذا
 * احتاجت إلى قواعد تحقق إضافية.
 */
    // تم التخلص من الدالة حيث لم تعد ضرورية مع المعمارية الجديدة

/**
 * التحقق من وجود العنصر داخل الصفحة.
 *
 * تستخدم هذه الدالة لمعرفة ما إذا كان العنصر موجوداً
 * في شجرة عناصر الصفحة (DOM)، بغض النظر عن كونه
 * ظاهراً أو مخفياً.
 *
 * تستخدم عادة قبل تنفيذ أي عملية على العنصر لتجنب
 * حدوث أخطاء أثناء التشغيل.
 *
 * @returns
 * true إذا كان العنصر موجوداً، وإلا false.
 */
public async exists(): Promise<boolean> {

    return await this.locator.count() > 0;

}

/**
 * التحقق من أن العنصر ظاهر للمستخدم.
 *
 * تستخدم هذه الدالة للتأكد من إمكانية رؤية العنصر
 * قبل تنفيذ العمليات التي تتطلب ظهوره.
 *
 * @returns
 * true إذا كان العنصر ظاهراً، وإلا false.
 */
public async isVisible(): Promise<boolean> {

    return await this.locator.isVisible();

}

/**
 * التحقق من أن العنصر مخفي.
 *
 * تستخدم هذه الدالة عند الحاجة للتأكد من اختفاء
 * عنصر معين من واجهة المستخدم.
 *
 * @returns
 * true إذا كان العنصر مخفياً، وإلا false.
 */
public async isHidden(): Promise<boolean> {

    return await this.locator.isHidden();

}

/**
 * التحقق من أن العنصر مفعل.
 *
 * تستخدم هذه الدالة قبل تنفيذ العمليات التي تتطلب
 * تفاعل المستخدم مع العنصر.
 *
 * @returns
 * true إذا كان العنصر مفعلاً، وإلا false.
 */
public async isEnabled(): Promise<boolean> {

    return await this.locator.isEnabled();

}

/**
 * التحقق من أن العنصر غير مفعل.
 *
 * تستخدم هذه الدالة للتحقق من أن العنصر في حالة
 * عدم السماح بالتفاعل.
 *
 * @returns
 * true إذا كان العنصر غير مفعل، وإلا false.
 */
public async isDisabled(): Promise<boolean> {

    return await this.locator.isDisabled();

}

/**
 * انتظار ظهور العنصر.
 *
 * تستخدم هذه الدالة لإيقاف التنفيذ مؤقتاً حتى يصبح
 * العنصر مرئياً للمستخدم أو تنتهي مدة الانتظار.
 *
 * تستخدم قبل العمليات التي تتطلب ظهور العنصر مثل:
 *
 * - الكتابة.
 * - الضغط.
 * - الاختيار.
 *
 * @param timeout
 * الحد الأقصى لمدة الانتظار بالمللي ثانية.
 *
 * @returns
 * Promise يتم حله عند ظهور العنصر.
 */
public async waitUntilVisible(
    timeout: number = 5000
): Promise<void> {

    await this.locator.waitFor({

        state: 'visible',

        timeout

    });

}

/**
 * انتظار اختفاء العنصر.
 *
 * تستخدم هذه الدالة عند الحاجة للتأكد من اختفاء
 * العنصر قبل متابعة تنفيذ الخطوات التالية.
 *
 * @param timeout
 * الحد الأقصى لمدة الانتظار بالمللي ثانية.
 *
 * @returns
 * Promise يتم حله عند اختفاء العنصر.
 */
public async waitUntilHidden(
    timeout: number = 5000
): Promise<void> {

    await this.locator.waitFor({

        state: 'hidden',

        timeout

    });

}

/**
 * تمييز العنصر مؤقتاً داخل الصفحة.
 *
 * تستخدم هذه الدالة أثناء التطوير وتصحيح الأخطاء
 * لتحديد العنصر المستهدف بصرياً.
 *
 * لا تؤثر هذه العملية على سلوك التطبيق، وإنما تضيف
 * إطاراً مؤقتاً حول العنصر ثم تزيله تلقائياً.
 *
 * @returns Promise يتم حله بعد إزالة التمييز.
 */
public async highlight(): Promise<void> {

    await this.locator.evaluate((element: Element) => {

        const htmlElement = element as HTMLElement;

        const originalOutline = htmlElement.style.outline;

        htmlElement.style.outline = "3px solid red";

        setTimeout(() => {

            htmlElement.style.outline = originalOutline;

        }, 1000);

    });

}

/**
 * التقاط صورة للعنصر.
 *
 * تستخدم هذه الدالة لتوثيق حالة العنصر أثناء
 * الاختبارات أو عند تحليل الأخطاء.
 *
 * @param path
 * مسار حفظ الصورة.
 *
 * @returns Promise يتم حله بعد حفظ الصورة.
 */
public async screenshot(
    path: string
): Promise<void> {

    await this.locator.screenshot({

        path

    });

}

/**
 * إرجاع معلومات المكون.
 *
 * تستخدم هذه الدالة لأغراض التشخيص،
 * التسجيل، وإنشاء التقارير.
 *
 * @returns معلومات المكون الحالية.
 */
public getComponentInfo(): {

    selector: string;

} {

    return {

        selector: this.selector

    };

}


/**
 * تنفيذ عملية داخل المكون مع تطبيق
 * استراتيجية معالجة الأخطاء.
 *
 * @param action
 * العملية المطلوب تنفيذها.
 *
 * @returns
 * ناتج العملية.
 */
protected async execute<T>(
    action: () => Promise<T>
): Promise<T> {

    try {

        return await this.retry(action);

    } catch (error) {

        this.handleError(error);

    }

}

/**
 * إعادة تنفيذ العملية عند الحاجة.
 *
 * تم إنشاء هذه الدالة كجزء من العقد المعماري
 * لـ BaseComponent.
 *
 * سيتم تطوير استراتيجية إعادة المحاولة
 * في مهمة مستقلة لاحقاً.
 *
 * @param action
 * العملية المطلوب تنفيذها.
 *
 * @returns
 * ناتج العملية.
 */
protected async retry<T>(
    action: () => Promise<T>
): Promise<T> {

    return await action();

}

/**
 * معالجة الأخطاء.
 *
 * توفر هذه الدالة نقطة موحدة لمعالجة الأخطاء
 * داخل BaseComponent.
 *
 * سيتم تطويرها لاحقاً لإضافة:
 *
 * - Logging
 * - Screenshot
 * - Error Report
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