/**
 * TestDataProvider
 * 
 * واجهة قياسية لمزودات البيانات (Data Providers) داخل إطار العمل.
 * تعزل طريقة جلب البيانات (JSON, API, DB) عن كود الاختبارات.
 * وظيفة الإطار هنا هي الجلب فقط وإرجاع Data مجهولة النوع (Generic)، 
 * بينما يحدد الـ Project نوع الحالة المطلوبة.
 */
export interface TestDataProvider {
    
    /**
     * جلب جميع حالات الاختبار من المصدر وتحويلها إلى النوع المطلوب T
     * 
     * @returns Promise مصفوفة من حالات الاختبار
     */
    loadAll<T>(): Promise<T[]>;
    
}
