import { Page, Request, Response } from '@playwright/test';
import { NetworkMonitor } from './NetworkMonitor';
import { NetworkInterceptor } from './NetworkInterceptor';
import { NetworkExpectation } from './NetworkTypes';

/**
 * NetworkManager
 * الواجهة الموحدة (Facade) للتعامل مع الشبكة.
 * يمتلك وصولاً لكل من `monitor` و `interceptor`، ويوفر دوال مساعدة مباشرة
 * لتبسيط كتابة الاختبارات دون كسر معمارية الفصل (SRP).
 */
export class NetworkManager {
    public readonly monitor: NetworkMonitor;
    public readonly interceptor: NetworkInterceptor;

    constructor(private readonly page: Page) {
        this.monitor = new NetworkMonitor(page);
        this.interceptor = new NetworkInterceptor(page);
    }

    // ========================================================================
    // Facade Methods (لتسهيل الاستخدام المباشر في الاختبارات)
    // ========================================================================

    /**
     * انتظار رد من الخادم يتطابق مع التوقعات (مأخوذة من Monitor).
     */
    public async waitForResponse(expectation: NetworkExpectation, timeoutMs?: number): Promise<Response> {
        return this.monitor.waitForResponse(expectation, timeoutMs);
    }

    /**
     * انتظار إرسال طلب يتطابق مع التوقعات (مأخوذة من Monitor).
     */
    public async waitForRequest(expectation: NetworkExpectation, timeoutMs?: number): Promise<Request> {
        return this.monitor.waitForRequest(expectation, timeoutMs);
    }

    /**
     * انتظار خمول الشبكة تماماً.
     */
    public async waitForIdle(timeoutMs?: number): Promise<void> {
        return this.monitor.waitForIdle(timeoutMs);
    }

    /**
     * محاكاة استجابة وهمية (مأخوذة من Interceptor).
     */
    public async mockResponse(expectation: NetworkExpectation, mockData: any, mockStatus?: number): Promise<void> {
        return this.interceptor.mockResponse(expectation, mockData, mockStatus);
    }
}
