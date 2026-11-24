import { TestDataProvider } from '../TestDataProvider';
import * as fs from 'fs';
import * as path from 'path';

/**
 * JsonTestDataProvider
 * 
 * تنفيذ لمزود البيانات يعتمد على ملفات JSON المحلية.
 * يقوم بقراءة ملف JSON، أو جميع الملفات في مجلد معين، وإرجاع محتوياتها.
 */
export class JsonTestDataProvider implements TestDataProvider {
    
    private readonly sourcePath: string;

    /**
     * @param relativeOrAbsolutePath المسار المطلق أو النسبي لملف أو مجلد JSON
     */
    constructor(relativeOrAbsolutePath: string) {
        // إذا كان مساراً نسبياً نفترض أنه ينطلق من جذر المشروع
        this.sourcePath = path.isAbsolute(relativeOrAbsolutePath) 
            ? relativeOrAbsolutePath 
            : path.resolve(process.cwd(), relativeOrAbsolutePath);
    }

    public async loadAll<T>(): Promise<T[]> {
        const stats = fs.statSync(this.sourcePath);
        
        let files: string[] = [];
        
        if (stats.isDirectory()) {
            files = fs.readdirSync(this.sourcePath)
                .filter(f => f.endsWith('.json'))
                .map(f => path.join(this.sourcePath, f));
        } else if (stats.isFile() && this.sourcePath.endsWith('.json')) {
            files = [this.sourcePath];
        } else {
            throw new Error(`Invalid data source path: ${this.sourcePath}`);
        }

        let allCases: T[] = [];
        
        for (const file of files) {
            const content = fs.readFileSync(file, 'utf-8');
            const data = JSON.parse(content);
            
            // التعامل مع حالة أن الملف يحتوي مصفوفة أو كائن واحد
            if (Array.isArray(data)) {
                allCases = allCases.concat(data);
            } else {
                allCases.push(data);
            }
        }
        
        return allCases;
    }
}
