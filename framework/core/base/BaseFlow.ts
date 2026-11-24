
import { Page } from '@playwright/test';
import { Logger } from '../logger/Logger';

/**
 * التدفق الأساسي (Base Flow)
 *
 * يمثل الطبقة المسؤولة عن تنفيذ العمليات التجارية
 * (Business Processes) داخل النظام.
 *
 * أمثلة:
 * - AccountFlow
 * - JournalEntryFlow
 * - VoucherFlow
 * - BudgetFlow
 *
 * المسؤوليات:
 * - تجميع خطوات متعددة من الصفحات.
 * - تمثيل العمليات التجارية الحقيقية.
 * - إعادة استخدام السيناريوهات المشتركة.
 *
 * لا يسمح لـ Flow بالتعامل مع:
 * - Locators
 * - Selectors
 * - عناصر Playwright مباشرة
 *
 * يجب أن يعتمد فقط على:
 * - Pages
 * - Components
 */
export abstract class BaseFlow {

  /**
   * الصفحة الحالية.
   */
  protected readonly page: Page;
 


  /**
   * المُنشئ الأساسي.
   *
   * @param page الصفحة الحالية القادمة من Playwright.
   * @param logger كائن Logger للاستخدام داخل التدفق.
   */
  constructor(page: Page) {
    this.page = page;
   
  }

  /**
   * تسجيل رسالة معلوماتية.
   *
   * سيتم استبدالها لاحقاً بـ Logger احترافي.
   *
   * @param message الرسالة المراد تسجيلها.
   */
  protected log(message: string): void {
    Logger.info(`[FLOW] ${message}`);
  }

  /**
   * تسجيل بداية عملية تجارية.
   *
   * @param flowName اسم التدفق.
   */
  protected startFlow(flowName: string): void {
    Logger.info(`========== START FLOW: ${flowName} ==========`);
  }

  /**
   * تسجيل نهاية عملية تجارية.
   *
   * @param flowName اسم التدفق.
   */
  protected endFlow(flowName: string): void {
    Logger.info(`========== END FLOW: ${flowName} ==========`);
  }
}
