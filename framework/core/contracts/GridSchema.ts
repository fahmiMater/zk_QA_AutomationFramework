/**
 * يمثل بنية الجدول بعد قراءتها من الـ DOM.
 *
 * يتم إنشاء الـ Schema مرة واحدة فقط
 * ثم إعادة استخدامها أثناء عمر GridComponent.
 */
export interface GridSchema {

  /**
   * أسماء الأعمدة بالترتيب.
   */
  headers: string[];

  /**
   * خريطة تربط اسم العمود برقمه.
   */
  columnIndexes: Map<string, number>;

}