/**
 * المسجل المركزي للمنصة.
 *
 * جميع عمليات التسجيل يجب أن تمر من خلال هذا الكلاس.
 *
 * يمنع استخدام:
 * console.log()
 * مباشرة داخل المشروع.
 */
export class Logger {

  /**
   * تسجيل رسالة معلوماتية.
   *
   * @param message الرسالة المراد تسجيلها.
   */
  static info(message: string): void {
    console.log(`[INFO] ${message}`);
  }

  /**
   * تسجيل رسالة تحذير.
   *
   * @param message الرسالة المراد تسجيلها.
   */
  static warn(message: string): void {
    console.warn(`[WARN] ${message}`);
  }

  /**
   * تسجيل رسالة خطأ.
   *
   * @param message الرسالة المراد تسجيلها.
   */
  static error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }
}