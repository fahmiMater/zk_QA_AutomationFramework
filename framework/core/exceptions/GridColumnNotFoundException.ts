import { GridException } from './GridException';

/**
 * استثناء عدم العثور على عمود.
 *
 * يتم إطلاقه عند محاولة الوصول إلى
 * عمود غير موجود داخل الجدول.
 */
export class GridColumnNotFoundException
  extends GridException {

  /**
   * اسم العمود المطلوب.
   */
  readonly columnName: string;

  /**
   * إنشاء الاستثناء.
   *
   * @param columnName اسم العمود.
   */
  constructor(
    columnName: string
  ) {

    super(
      `Grid column not found: ${columnName}`
    );

    this.columnName =
      columnName;

  }

}