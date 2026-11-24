import { Page, Request, Response } from '@playwright/test';
import { NetworkExpectation } from './NetworkTypes';

/**
 * NetworkMonitor
 * مخصص فقط لمراقبة الشبكة (Observation) والانتظار (Waiting).
 * لا يقوم بأي تعديل أو محاكاة (Mocking) على الطلبات.
 */
export class NetworkMonitor {
    
    constructor(private readonly page: Page) {}

    /**
     * ينتظر حتى يتم إرسال طلب يطابق التوقعات.
     */
    public async waitForRequest(expectation: NetworkExpectation, timeoutMs: number = 10000): Promise<Request> {
        return this.page.waitForRequest((request: Request) => {
            return this.matchExpectation(request.url(), request.method(), undefined, expectation);
        }, { timeout: timeoutMs });
    }

    /**
     * ينتظر حتى يعود رد من الخادم يطابق التوقعات.
     */
    public async waitForResponse(expectation: NetworkExpectation, timeoutMs: number = 10000): Promise<Response> {
        return this.page.waitForResponse((response: Response) => {
            return this.matchExpectation(response.url(), response.request().method(), response.status(), expectation);
        }, { timeout: timeoutMs });
    }

    /**
     * ينتظر حتى تصبح الشبكة خاملة تماماً (No active connections).
     * مفيدة بعد حفظ نموذج ضخم لتأكيد أن كل الطلبات الجانبية انتهت.
     */
    public async waitForIdle(timeoutMs: number = 15000): Promise<void> {
        await this.page.waitForLoadState('networkidle', { timeout: timeoutMs });
    }

    /**
     * دالة مساعدة للتحقق من تطابق الطلب/الاستجابة مع التوقعات (Contract).
     */
    private matchExpectation(
        url: string, 
        method: string, 
        status: number | undefined, 
        expectation: NetworkExpectation
    ): boolean {
        // التحقق من الرابط (URL)
        const isUrlMatch = typeof expectation.url === 'string'
            ? url.includes(expectation.url)
            : expectation.url.test(url);
            
        if (!isUrlMatch) return false;

        // التحقق من طريقة الطلب (Method)
        if (expectation.method && expectation.method.toUpperCase() !== method.toUpperCase()) {
            return false;
        }

        // التحقق من حالة الرد (Status) في حال تم تمريرها
        if (status !== undefined && expectation.status !== undefined && expectation.status !== status) {
            return false;
        }

        return true;
    }
}
