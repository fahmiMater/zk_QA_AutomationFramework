import { Locator, Page } from '@playwright/test';

export class GridFilterComponent {
    constructor(private page: Page, private gridLocator: Locator) {}

    /**
     * إدخال قيمة فلتر لعمود معين (تفاصيل التنفيذ تعتمد على طبيعة واجهة الفلترة في PrimeNG).
     */
    public async byColumn(columnName: string, value: string): Promise<void> {
        // التنفيذ يعتمد على ما إذا كان الفلتر يظهر كحقل أسفل الـ Header أو في نافذة منبثقة
        // سيتم التوسع في هذه الدالة في SDK قادم مخصص للـ Filters
        throw new Error('Grid filtering implementation is pending UI contract.');
    }
}
