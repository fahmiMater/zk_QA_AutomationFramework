/**
 * أنواع مكونات الواجهة الرسمية.
 *
 * تستخدم داخل data-automation-role
 * لتحديد نوع المكون بشكل مستقل
 * عن Angular أو PrimeNG.
 */
export enum AutomationRole {

  /**
   * صفحة.
   */
  Page = 'page',

  /**
   * جدول.
   */
  Grid = 'grid',

  /**
   * مربع حوار.
   */
  Dialog = 'dialog',

  /**
   * شريط أدوات.
   */
  Toolbar = 'toolbar',

  /**
   * تبويبات.
   */
  Tabs = 'tabs',

  /**
   * قائمة منسدلة.
   */
  Dropdown = 'dropdown',

  /**
   * زر.
   */
  Button = 'button',

  /**
   * مربع نص.
   */
  TextBox = 'textbox',

  /**
   * منطقة نص.
   */
  TextArea = 'textarea',

  /**
   * مربع اختيار.
   */
  Checkbox = 'checkbox',

  /**
   * زر اختيار.
   */
  Radio = 'radio',

  /**
   * نموذج.
   */
  Form = 'form',

  /**
   * Lookup.
   */
  Lookup = 'lookup',

  /**
   * شجرة.
   */
  Tree = 'tree',

  /**
   * قائمة.
   */
  Menu = 'menu'
}