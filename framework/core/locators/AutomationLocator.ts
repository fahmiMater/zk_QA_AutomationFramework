import { FrameworkException } from '../exceptions/FrameworkException';

/**
 * Automation Locator
 *
 * المسؤولية:
 * إنشاء Selectors المعتمدة على Business Identity
 * باستخدام الخاصية القياسية:
 *
 * data-automation-id
 *
 * يعتبر هذا الكلاس نقطة الدخول الوحيدة لإنشاء
 * Automation Selectors داخل Framework.
 *
 * المبادئ المعمارية:
 *
 * - يعتمد على Business Identity فقط.
 * - لا يعتمد على نوع المكون.
 * - لا يعتمد على CSS Classes.
 * - لا يعتمد على XPath.
 * - لا يعتمد على النصوص الظاهرة.
 * - لا يعتمد على Playwright.
 *
 * ملاحظات:
 *
 * - يعيد Selector فقط.
 * - تحويل Selector إلى Locator يتم داخل BaseComponent.
 *
 * أمثلة:
 *
 * AutomationLocator.byId('account-number')
 *
 * =>
 *
 * [data-automation-id="account-number"]
 */
export class AutomationLocator {

  /**
   * المُنشئ الخاص.
   *
   * يمنع إنشاء كائنات من هذا الكلاس لأنه عبارة
   * عن Static Utility Class.
   */
  private constructor() { }

  /**
   * إنشاء Automation Selector.
   *
   * يعتمد على Business Identity الخاصة بالمكون.
   *
   * @param automationId معرف المكون.
   *
   * @returns CSS Selector.
   *
   * @throws FrameworkException
   * إذا كانت قيمة Automation ID فارغة.
   */
  static byId(
    automationId: string
  ): string {

    if (
      automationId == null ||
      automationId.trim() === ''
    ) {

      throw new FrameworkException(
        'Automation ID cannot be null, undefined, or empty.'
      );
    }

    return `[data-automation-id="${automationId.trim()}"]`;
  }

  /**
   * التحقق مما إذا كان المُدخل هو Automation ID قياسي أم لا.
   * يستخدم لمعرفة ما إذا كان يجب تغليف المعرف في محدد CSS أم تمريره مباشرة.
   */
  static isAutomationId(identifier: string): boolean {
    return /^[a-zA-Z0-9_-]+$/.test(identifier);
  }

  /**
   * يقوم بإرجاع Locator حقيقي بناءً على المُدخل:
   * إذا كان المُدخل Locator يعيده كما هو.
   * إذا كان المُدخل نصاً يطابق معايير الـ Automation ID، يحوله إلى محدد CSS الخاص به ثم يمرره لـ page.locator.
   * إذا كان نصاً يحتوي على محددات أخرى (Playwright selector/CSS/XPath)، يمرره مباشرة كـ Selector.
   */
  static resolve(page: import('@playwright/test').Page, identifier: string | import('@playwright/test').Locator): import('@playwright/test').Locator {
    if (typeof identifier !== 'string') {
        return identifier;
    }
    return this.isAutomationId(identifier) ? page.locator(this.byId(identifier)) : page.locator(identifier);
  }
}