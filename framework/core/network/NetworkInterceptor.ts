import { Page } from '@playwright/test';
import { NetworkExpectation } from './NetworkTypes';

/**
 * NetworkInterceptor
 * مخصص لاعتراض الشبكة وتعديل السلوك (Mocking/Stubbing/Aborting).
 * يستخدم لاختبار السيناريوهات السلبية (مثل Server Error 500) أو البيانات الوهمية.
 */
export class NetworkInterceptor {
    
    constructor(private readonly page: Page) {}

    /**
     * اعتراض الطلب واستبدال الاستجابة الحقيقية باستجابة وهمية (Mock).
     */
    public async mockResponse(expectation: NetworkExpectation, mockData: any, mockStatus: number = 200): Promise<void> {
        await this.page.route(expectation.url, async (route, request) => {
            // التحقق من أن الميثود متطابق قبل التدخل
            if (expectation.method && request.method().toUpperCase() !== expectation.method.toUpperCase()) {
                return route.continue();
            }

            // إرجاع البيانات الوهمية
            await route.fulfill({
                status: mockStatus,
                contentType: 'application/json',
                body: JSON.stringify(mockData)
            });
        });
    }

    /**
     * إحباط الطلب (Abort) لاختبار تعامل النظام مع انقطاع الاتصال أو حظر الموارد.
     */
    public async abortRequest(expectation: NetworkExpectation, errorCode: string = 'failed'): Promise<void> {
        await this.page.route(expectation.url, async (route, request) => {
            if (expectation.method && request.method().toUpperCase() !== expectation.method.toUpperCase()) {
                return route.continue();
            }

            await route.abort(errorCode);
        });
    }

    /**
     * إزالة جميع الاعتراضات (Routes) التي تم وضعها.
     */
    public async clearAllInterceptors(): Promise<void> {
        await this.page.unrouteAll();
    }
}
