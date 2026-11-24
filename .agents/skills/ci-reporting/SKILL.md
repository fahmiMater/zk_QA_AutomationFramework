---
name: ci-reporting
description: Produces an Arabic RTL HTML test report from Playwright results and publishes it as GitLab CI artifacts (pages/job artifacts). Use when the user wants readable HTML reports instead of raw console output.
---

# HTML Reporting (Arabic RTL) for Local GitLab

## Output language (mandatory)
- Report content MUST be Arabic (RTL). Keep test names, selectors, error messages, paths and technical terms in English where they originate from code.

## Report assets
1. Shared template: `docs/templates/report-template.html` — already `dir="rtl"`, `lang="ar"`, self-contained CSS (no external assets, works inside GitLab artifact browsing), with LTR-enforced `pre/code` blocks.
2. Playwright's own HTML report also exists at `playwright-report/index.html` (English UI) — keep it as an artifact; the Arabic report is the team-facing summary.

## Steps
1. Ensure `playwright.config.ts` reporters include `['html', { open: 'never' }]` and (for GitLab MR widget) `['junit', { outputFile: 'junit/junit.xml' }]`.
2. To produce the Arabic HTML summary, generate a script `scripts/generate-report.ts` that reads Playwright's JSON output (add a `['json', { outputFile: 'results.json' }]` reporter) and fills the template placeholders (`{{TOTAL}} {{PASSED}} {{FAILED}} {{SKIPPED}} {{DATE}} {{COMMIT_SHA}} {{ENVIRONMENT}}`).
   - Set `{{COMMIT_SHA}}` from `process.env.CI_COMMIT_SHA` in CI (a local-GitLab variable that exists by default).
   - Test titles may be Arabic (they render fine in RTL rows); error messages stay English inside LTR `<pre>` blocks.
3. In `.gitlab-ci.yml` artifacts, expose both:
   ```yaml
   artifacts:
     when: always
     paths: [playwright-report/, reports/summary.html]
   ```
4. Verify: run the suite, open `reports/summary.html` in a browser — Arabic must render RTL with no broken glyphs; code blocks must remain LTR.

## Hard rules
- The template ships with the repo; do not generate a new template per report — extend the shared one only via MR.
- No external CDNs/fonts — local GitLab artifacts are viewed offline.

## Failure handling
- `results.json` missing → the json reporter was not added to `playwright.config.ts`; fix the config, not the script.
- Arabic renders as boxes (□): the artifact viewer's encoding — the template already declares `<meta charset="UTF-8">`; confirm the file itself is saved as UTF-8.
