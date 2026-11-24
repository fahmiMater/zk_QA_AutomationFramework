import { AutomationAttribute } from './AutomationAttribute';
import { AutomationRole } from './AutomationRole';

/**
 * نقطة الوصول الموحدة لبناء Automation Selectors.
 *
 * يمنع كتابة Selectors الخاصة بعقد الأتمتة
 * داخل المكونات بشكل مباشر.
 */
export class Automation {

  /**
   * إنشاء Selector اعتماداً على
   * data-automation-id.
   *
   * @param id المعرف.
   */
  static byId(id: string): string {

    return `[${AutomationAttribute.Id}="${id}"]`;
  }

  /**
   * إنشاء Selector اعتماداً على
   * data-automation-role.
   *
   * @param role نوع المكون.
   */
  static byRole(role: AutomationRole): string {

    return `[${AutomationAttribute.Role}="${role}"]`;
  }

  /**
   * إنشاء Selector اعتماداً على أي
   * Automation Attribute.
   *
   * @param attribute اسم الخاصية.
   * @param value القيمة.
   */
  static byAttribute(
    attribute: AutomationAttribute,
    value: string
  ): string {

    return `[${attribute}="${value}"]`;
  }

  /**
   * إنشاء Selector اعتماداً على
   * data-automation-action.
   *
   * @param action اسم العملية.
   */
  static byAction(
    action: string
  ): string {

    return this.byAttribute(
      AutomationAttribute.Action,
      action
    );
  }

  /**
   * إنشاء Selector اعتماداً على
   * data-automation-column.
   *
   * @param column اسم العمود.
   */
  static byColumn(
    column: string
  ): string {

    return this.byAttribute(
      AutomationAttribute.Column,
      column
    );
  }

  /**
   * إنشاء Selector اعتماداً على
   * data-automation-field.
   *
   * @param field اسم الحقل.
   */
  static byField(
    field: string
  ): string {

    return this.byAttribute(
      AutomationAttribute.Field,
      field
    );
  }

  /**
   * إنشاء Selector اعتماداً على
   * data-automation-grid.
   *
   * @param grid اسم الجدول.
   */
  static byGrid(
    grid: string
  ): string {

    return this.byAttribute(
      AutomationAttribute.Grid,
      grid
    );
  }

  /**
   * إنشاء Selector اعتماداً على
   * data-automation-dialog.
   *
   * @param dialog اسم مربع الحوار.
   */
  static byDialog(
    dialog: string
  ): string {

    return this.byAttribute(
      AutomationAttribute.Dialog,
      dialog
    );
  }

  /**
   * إنشاء Selector اعتماداً على
   * data-automation-tab.
   *
   * @param tab اسم التبويب.
   */
  static byTab(
    tab: string
  ): string {

    return this.byAttribute(
      AutomationAttribute.Tab,
      tab
    );
  }

}