import * as fs from 'fs';
import * as path from 'path';

export interface DataDrivenTestCase {
  operationName: string;
  testCaseId: string;
  reqId: string;
  technique: string;
  title: string;
  preconditions: string;
  testSteps: string;
  testDataApiInfo: string;
  expectedResult: string;
}

/**
 * Universal Data-Driven Reader supporting JSON, CSV, and Markdown table parsing.
 */
export class TestDataReader {
  /**
   * Reads test cases from a JSON file.
   */
  public static readJson(filePath: string): DataDrivenTestCase[] {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) {
      return [];
    }
    const rawData = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(rawData) as DataDrivenTestCase[];
  }

  /**
   * Reads test cases directly from Markdown Master Suite table files.
   */
  public static readMarkdownMasterSuite(filePath: string): DataDrivenTestCase[] {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) {
      return [];
    }

    const fileContent = fs.readFileSync(fullPath, 'utf8');
    const lines = fileContent.split(/\r?\n/);
    const testCases: DataDrivenTestCase[] = [];

    for (const line of lines) {
      if (line.startsWith('|') && line.includes('TC_')) {
        const parts = line.split('|').map(p => p.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
        if (parts.length >= 8) {
          testCases.push({
            operationName: parts[0] || 'Official Payment Vouchers',
            testCaseId: parts[1].replace(/\*\*/g, ''),
            reqId: parts[2],
            technique: parts[3],
            title: parts[4],
            preconditions: parts[5],
            testSteps: parts[6],
            testDataApiInfo: parts[7],
            expectedResult: parts[8] || '',
          });
        }
      }
    }

    return testCases;
  }
}
