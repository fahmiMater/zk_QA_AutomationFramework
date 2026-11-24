import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    /**
     * Framework SDK tests (اختبارات الإطار نفسه)
     */
    {
      name: 'framework',
      testDir: './tests',
      use: { headless: true }
    }
    // أضف هنا مشاريع تطبيقاتك الخاصة، مثال:
    // {
    //   name: 'application',
    //   testDir: './apps/my-app/tests',
    //   use: { browserName: 'chromium', headless: true }
    // }
  ]
});
