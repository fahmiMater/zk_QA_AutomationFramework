import { FilterOperator } from "./FilterOperator";

export interface GridFilter {

  /**
   * اسم العمود.
   */
  column: string;

  /**
   * نوع المقارنة.
   */
  operator: FilterOperator;

  /**
   * قيمة الفلترة.
   */
  value: string;
}