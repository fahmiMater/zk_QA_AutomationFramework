import { test, expect } from '../framework/core/fixtures/test';
import { ComponentFactory } from '../framework/core/factory/ComponentFactory';

/**
 * ============================================================
 * مثال عام (Template) — اختبار UI مستقل بذاته
 * ============================================================
 * هذا الاختبار يوضح النمط القياسي للفريق:
 * 1) بناء Page Object يرث BasePage ويستخدم ComponentFactory.
 * 2) الاعتماد على data-automation-id فقط (لا نصوص ولا CSS).
 * 3) الـ fixture المخصص من framework/core/fixtures/test.
 *
 * في تطبيق حقيقي: استبدل page.setContent بالانتقال إلى رابط الصفحة،
 * وانقل الصفحة إلى apps/<your-app>/pages/ وفق دليل الفريق.
 */

class ExampleLoginPage {
  private readonly components: ComponentFactory;

  constructor(page: import('@playwright/test').Page) {
    this.components = new ComponentFactory(page);
  }

  username() {
    return this.components.textBox('login-username');
  }

  password() {
    return this.components.textBox('login-password');
  }

  submit() {
    return this.components.button('login-submit');
  }
}

test.describe('Example — نمط الاختبار القياسي', () => {

  test('تسجيل دخول ناجح باستخدام المكونات الدلالية', async ({ page }) => {
    // محاكاة صفحة بسيطة تحتوي معرّفات دلالية
    await page.setContent(`
      <input type="text" data-automation-id="login-username" />
      <input type="password" data-automation-id="login-password" />
      <button data-automation-id="login-submit">Login</button>
    `);

    const loginPage = new ExampleLoginPage(page);

    await loginPage.username().fill('demo_user');
    await loginPage.password().fill('demo_password');
    await loginPage.submit().click();

    // تحقق عام: الصفحة لا تزال تعرض العناصر (بدون خادم حقيقي)
    await expect(page.locator('[data-automation-id="login-username"]')).toBeVisible();
  });
});
