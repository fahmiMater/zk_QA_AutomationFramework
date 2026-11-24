import { z } from 'zod';

/**
 * Utility for schema and contract validation using Zod.
 * Ensures API response payloads conform strictly to expected data contracts.
 */
export class ApiResponseValidator {
  /**
   * Validates target data against a Zod Schema.
   * Throws a detailed error if validation fails.
   */
  public static validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
    const result = schema.safeParse(data);
    if (!result.success) {
      const formattedErrors = result.error.issues
        .map((issue) => `  - Path [${issue.path.join('.')}]: ${issue.message}`)
        .join('\n');
      throw new Error(`[API Schema Validation Failed]:\n${formattedErrors}`);
    }
    return result.data;
  }

  /**
   * Safe validation returning a boolean result.
   */
  public static isValid<T>(schema: z.ZodSchema<T>, data: unknown): boolean {
    return schema.safeParse(data).success;
  }
}
