import { Configuration } from './Configuration';

/**
 * معلومات جلسة التنفيذ الحالية.
 *
 * يتم استخدامها لتخزين معلومات وقت التشغيل
 * المتاحة لجميع أجزاء المنصة.
 */
export class ExecutionContext {

  /**
   * وقت بداية التنفيذ.
   */
  static readonly executionStartTime =
    new Date();

  /**
   * البيئة الحالية.
   */
  static readonly environment =
    Configuration.environmentName;
}