/**
 * تعريف هيكل إعدادات البيئة.
 *
 * جميع ملفات config.json يجب أن تطابق هذا الشكل.
 */
export interface Environment {

  /**
   * اسم البيئة.
   *
   * أمثلة:
   * dev
   * qa
   * staging
   * prod
   */
  name: string;

  /**
   * الرابط الأساسي للنظام.
   */
  baseUrl: string;

  /**
   * المهلة الافتراضية بالمللي ثانية.
   */
  timeout: number;

  /**
   * عدد مرات إعادة المحاولة.
   */
  retryCount: number;
}