import { ComponentException } from './ComponentException';

/**
 * استثناء الجداول (Grid Exception)
 *
 * يمثل الاستثناء الأساسي لجميع الأخطاء
 * المتعلقة بمكون Grid.
 *
 * يجب أن ترث جميع استثناءات Grid من هذا
 * الكلاس.
 *
 * أمثلة:
 * - GridColumnNotFoundException
 * - GridRowNotFoundException
 * - GridFilterException
 *
 * الأهداف:
 * - تجميع جميع أخطاء Grid.
 * - تسهيل التعامل مع أخطاء الجداول.
 */
export class GridException extends ComponentException {

  /**
   * إنشاء استثناء جديد خاص بالجداول.
   *
   * @param message وصف الخطأ.
   */
  constructor(
    message: string
  ) {

    super(message);

  }

}