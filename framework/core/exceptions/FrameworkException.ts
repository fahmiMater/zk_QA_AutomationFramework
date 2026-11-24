/**
 * الاستثناء الأساسي (Framework Exception)
 *
 * يمثل الجذر لجميع الاستثناءات المعرفة داخل
 * منصة الاختبارات.
 *
 * يجب أن ترث جميع الاستثناءات المخصصة من هذا
 * الكلاس بدلاً من الوراثة المباشرة من Error.
 *
 * أمثلة:
 * - ComponentException
 * - GridException
 * - DialogException
 * - LookupException
 *
 * الأهداف:
 * - توحيد جميع الاستثناءات داخل المنصة.
 * - تسهيل معالجة الأخطاء مركزياً.
 * - توفير نقطة انطلاق مشتركة لجميع الاستثناءات.
 */


export class FrameworkException extends Error {
/**
 * إنشاء استثناء جديد.
 *
 * @param message وصف الخطأ الذي يوضح سبب
 *                حدوث الاستثناء.
 */
constructor(
  message: string
) {

  super(message);

  /**
   * إصلاح سلسلة الوراثة (Prototype Chain)
   * لضمان أن يعمل instanceof بشكل صحيح
   * مع جميع الاستثناءات المشتقة.
   */
  Object.setPrototypeOf(
    this,
    new.target.prototype
  );

  /**
   * تعيين اسم الاستثناء باسم الكلاس الفعلي.
   */
  this.name =
    new.target.name;

}
}