/**
 * أسماء خصائص الأتمتة الرسمية المستخدمة
 * بين منصة الـ ERP ومنصة الأتمتة.
 *
 * تعتبر هذه القيم جزءاً من Automation Contract
 * ويمنع استخدام أسماء الخصائص بشكل مباشر
 * داخل أي مكون من مكونات النظام.
 */
export enum AutomationAttribute {

  /**
   * المعرف الفريد للعنصر.
   */
  Id = 'data-automation-id',

  /**
   * نوع المكون.
   */
  Role = 'data-automation-role',

  /**
   * معرف الجدول.
   */
  Grid = 'data-automation-grid',

  /**
   * اسم العمود.
   */
  Column = 'data-automation-column',

  /**
   * اسم الحقل.
   */
  Field = 'data-automation-field',

  /**
   * اسم العملية.
   */
  Action = 'data-automation-action',

  /**
   * اسم التبويب.
   */
  Tab = 'data-automation-tab',

  /**
   * معرف مربع الحوار.
   */
  Dialog = 'data-automation-dialog',

  /**
   * عناصر الفلترة.
   */
  Filter = 'data-automation-filter',

  /**
   * معرف الصف.
   */
  RowId = 'data-automation-row-id'
}