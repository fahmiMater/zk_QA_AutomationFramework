import { Locator, Page, expect } from '@playwright/test';

/**
 * Wait Utilities
 *
 * يحتوي على جميع عمليات الانتظار المشتركة
 * المستخدمة داخل إطار الأتمتة.
 *
 * يمنع استخدام:
 *
 * page.waitForTimeout()
 *
 * إلا لأغراض Debugging فقط.
 */
export class WaitUtils {

  /**
   * الانتظار حتى اكتمال تحميل الصفحة.
   *
   * @param page الصفحة الحالية.
   */
  static async waitForPageReady(
    page: Page
  ): Promise<void> {

    await page.waitForLoadState(
      'networkidle'
    );
  }

  /**
   * الانتظار حتى ظهور عنصر.
   *
   * @param locator العنصر المستهدف.
   */
  static async waitUntilVisible(
    locator: Locator
  ): Promise<void> {

    await expect(locator)
      .toBeVisible();
  }

  /**
   * الانتظار حتى اختفاء عنصر.
   *
   * @param locator العنصر المستهدف.
   */
  static async waitUntilHidden(
    locator: Locator
  ): Promise<void> {

    await expect(locator)
      .toBeHidden();
  }

  /**
   * الانتظار حتى يصبح العنصر قابلاً للنقر.
   *
   * @param locator العنصر المستهدف.
   */
  static async waitForEnabled(
    locator: Locator
  ): Promise<void> {

    await expect(locator)
      .toBeEnabled();
  }

  /**
   * الانتظار حتى ظهور نص معين.
   *
   * @param locator العنصر المستهدف.
   * @param text النص المتوقع.
   */
  static async waitForText(
    locator: Locator,
    text: string
  ): Promise<void> {

    await expect(locator)
      .toContainText(text);
  }
}