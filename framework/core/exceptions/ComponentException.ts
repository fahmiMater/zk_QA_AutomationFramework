import { FrameworkException } from './FrameworkException';

/**
 * استثناء المكونات (Component Exception)
 *
 * يمثل الاستثناء الأساسي لجميع الأخطاء
 * المتعلقة بمكونات واجهة المستخدم (UI Components).
 *
 * يجب أن ترث جميع استثناءات المكونات من هذا
 * الكلاس بدلاً من الوراثة مباشرة من
 * FrameworkException.
 *
 * أمثلة:
 * - GridException
 * - DialogException
 * - TabsException
 * - ToolbarException
 * - LookupException
 *
 * الأهداف:
 * - تجميع جميع أخطاء المكونات تحت نوع واحد.
 * - تسهيل معالجة أخطاء واجهة المستخدم.
 * - توفير نقطة انطلاق مشتركة لاستثناءات المكونات.
 */
export class ComponentException extends FrameworkException {

  /**
   * إنشاء استثناء جديد خاص بالمكونات.
   *
   * @param message وصف الخطأ.
   */
  constructor(
    message: string
  ) {

    super(message);

  }

}