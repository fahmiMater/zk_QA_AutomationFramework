import { test as baseTest } from '@playwright/test';
import { NetworkManager } from '../network/NetworkManager';

/**
 * Execution Context (Fixtures)
 * هذا الملف يمثل النواة الحقيقية لتوسيع بيئة Playwright ودمج خدمات الإطار المتنوعة.
 * يتم من خلاله تمرير مدير الشبكة (NetworkManager) كـ Fixture أصلي داخل كل اختبار.
 */

export type ExecutionContextFixtures = {
    network: NetworkManager;
};

// نقوم بوراثة (Extend) كائن test الأصلي من Playwright وإضافة Fixtures الخاصة بنا.
export const test = baseTest.extend<ExecutionContextFixtures>({
    
    // تعريف الـ Fixture الخاص بالشبكة
    network: async ({ page }, use) => {
        // إنشاء Instance لمدير الشبكة وربطها بنفس الـ Page الخاصة بالاختبار الحالي
        const networkManager = new NetworkManager(page);
        
        // تمريرها للمطور لكي يستخدمها داخل الاختبار
        await use(networkManager);
        
        // يمكن إضافة أي عمليات تنظيف (Cleanup) هنا إذا لزم الأمر بعد انتهاء الاختبار
        await networkManager.interceptor.clearAllInterceptors();
    },

    // مستقبلاً يمكن إضافة:
    // api: async ({ request }, use) => { ... }
    // auth: async ({ page }, use) => { ... }
});

export { expect } from '@playwright/test';
