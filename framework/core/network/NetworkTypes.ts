/**
 * NetworkExpectation
 * العقد (Contract) الذي يحدد ما يجب على الإطار توقعه عند مراقبة أو اعتراض طلبات الشبكة.
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';

export interface NetworkExpectation {
    /**
     * رابط الـ API المتوقع. يمكن أن يكون نصاً دقيقاً أو تعبيراً منتظماً (RegExp) وهو الأفضل.
     * مثال: /api\/invoices/
     */
    url: RegExp | string;

    /**
     * طريقة الطلب (Method) لضمان عدم الخلط بين طلب جلب (GET) وطلب حفظ (POST).
     * إذا لم يُحدد، سيتم تجاهله أثناء الفحص.
     */
    method?: HttpMethod;

    /**
     * رمز حالة الاستجابة المتوقع (Status Code).
     * يستخدم بشكل أساسي في المراقبة (Monitor) لانتظار رد معين (مثلاً 200 أو 500).
     */
    status?: number;
}
