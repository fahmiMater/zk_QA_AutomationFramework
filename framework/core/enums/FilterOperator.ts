/**
 * أنواع عمليات الفلترة المدعومة.
 */
export enum FilterOperator {

  /**
   * يبدأ بـ
   */
  StartsWith = 'startsWith',

  /**
   * يحتوي على
   */
  Contains = 'contains',

  /**
   * لا يحتوي على
   */
  NotContains = 'notContains',

  /**
   * ينتهي بـ
   */
  EndsWith = 'endsWith',

  /**
   * يساوي
   */
  Equals = 'equals',

  /**
   * لا يساوي
   */
  NotEquals = 'notEquals'
}