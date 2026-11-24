import { EnvironmentManager } from './EnvironmentManager';
import { Environment } from '../contracts/Environment';

/**
 * نقطة الوصول الموحدة لجميع إعدادات النظام.
 *
 * يمنع الوصول المباشر إلى ملفات JSON
 * خارج هذا الكلاس.
 */
export class Configuration {

  private static readonly environment: Environment =
    EnvironmentManager.load();

  /**
   * اسم البيئة الحالية.
   */
  static get environmentName(): string {
    return this.environment.name;
  }

  /**
   * الرابط الأساسي للنظام.
   */
  static get baseUrl(): string {
    return this.environment.baseUrl;
  }

  /**
   * المهلة الافتراضية.
   */
  static get timeout(): number {
    return this.environment.timeout;
  }

  /**
   * عدد مرات إعادة المحاولة.
   */
  static get retryCount(): number {
    return this.environment.retryCount;
  }
}