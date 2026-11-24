/**
 * ExecutionContexts
 * 
 * طبقة مركزية لتعريف سياقات التنفيذ (Execution Contexts) بدلاً من كتابة مسارات نصية (Hardcoded).
 * تتيح لك هذه الطبقة تطبيق حالة التخزين (Storage State)، اللغة، والمنطقة الزمنية لأي دور (Role) دفعة واحدة.
 * 
 * الاستخدام في الاختبارات:
 * test.use(ExecutionContexts.Admin);
 */

export const StorageStatePaths = {
    Admin: 'playwright/.auth/admin.json',
    User: 'playwright/.auth/user.json',
};

export const ExecutionContexts = {
    Admin: {
        storageState: StorageStatePaths.Admin,
        // يمكن مستقبلاً إضافة المزيد من الخصائص هنا مثل:
        // locale: 'ar-SA',
        // timezoneId: 'Asia/Riyadh'
    },
    User: {
        storageState: StorageStatePaths.User,
    }
};
