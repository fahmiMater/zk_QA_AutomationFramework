import * as fs from 'fs';
import * as path from 'path';

import { Environment } from '../contracts/Environment';

/**
 * مدير البيئات.
 *
 * مسؤول عن:
 * - تحديد البيئة الحالية.
 * - تحميل ملف الإعدادات.
 * - التحقق من وجود البيئة.
 */
export class EnvironmentManager {

  /**
   * تحميل إعدادات البيئة الحالية.
   */
  static load(): Environment {

    const envArgument = process.argv.find(
      argument => argument.startsWith('--env=')
    );

    const environmentName =
      envArgument?.split('=')[1] ?? 'qa';

    const configPath = path.resolve(
      process.cwd(),
      'environments',
      environmentName,
      'config.json'
    );

    if (!fs.existsSync(configPath)) {
      throw new Error(
        `Environment configuration not found: ${configPath}`
      );
    }

    const configurationContent =
      fs.readFileSync(configPath, 'utf8');

    return JSON.parse(
      configurationContent
    ) as Environment;
  }
}