---
name: tuleap-sync
description: Maps automated Playwright tests to Tuleap Test Management (TTM) — names suites after test-case ids, maintains a mapping CSV, and pushes JUnit results to a Tuleap campaign via its REST API. Use when the user asks to automate existing designed test cases, integrate with Tuleap/توليب, or report execution results back to a campaign.
---

# Tuleap Sync (Mapping + Results Push)

Write all user-facing prose in Arabic. Keep endpoints, field names, code and commands in English. Base every Tuleap mechanism on the verified documentation (docs.tuleap.com/user-guide/testmanagement.html); anything not covered there must be labeled غير مؤكد until confirmed against the user's Tuleap version.

## Verified Tuleap mechanisms (do not invent beyond these)
- Automated results flow: CI produces **JUnit XML** → `PATCH /api/testmanagement_campaigns/<campaignId>` with JSON `{"automated_tests_results": {"build_url": "...", "junit_contents": "<xml>"}}` — since Tuleap 11.15 the REST API processes JUnit directly (the `ttm` CLI is deprecated).
- Association rule: TTM **Test Definition ↔ JUnit testsuite, one-to-one**, matched by name. The Test Definitions tracker must contain a string/text field named **`automated_tests`**.
- Auth header: `X-Auth-AccessKey: <personal access token>` (format `tlp-k1-...`). Store it as a GitLab CI/CD protected+masked variable, never in the repo.
- Execution statuses TTM understands: `Not run`, `Passed`, `Failed`, `Blocked`.
- Requirements traceability: Test Definitions link to requirement/backlog artifacts; campaign results then feed TTM's traceability matrix (and its XLSX export).

## Steps
1. **Mapping file** `apps/<app>/data/test-case-mapping.csv` (semicolon-delimited):
   `aid;req_ids;operation;level;spec_file;test_title;testsuite_name;campaign_id;status`
   - `aid` = Tuleap test-case artifact id (e.g. `20068` from the team's TESTCASE export `aid;name;pre_con;test_steps;test_data;...`).
   - `testsuite_name` = `TC_<aid>` — this exact string is the JUnit `<testsuite name>` and the value stored in the Test Definition's `automated_tests` field; it is the join key on the Tuleap side.
   - `req_ids` = pipe-separated requirement ids from the matrix (e.g. `11253|11254`).
2. **Structure the JUnit output** so testsuite names match: one `<testsuite name="TC_20068">` per test case. In `playwright.config.ts` add `['junit', { outputFile: 'junit/junit.xml' }]` to the reporters; if one Playwright file holds several cases, split per-case suites via `test.describe` naming or separate files — verify the generated XML contains the exact `TC_<aid>` suite names before pushing.
3. **Status mapping**: Playwright `passed` → TTM `Passed`; `failed`/`timedOut` → `Failed`; `skipped`/`test.fixme`/`test.skip` → TTM `Blocked` (with reason in the notes) — never map skips to Passed.
4. **Push results** (script `scripts/push-tuleap-results.ts`, run from CI or locally):
   ```bash
   curl -X PATCH 'https://<tuleap-host>/api/testmanagement_campaigns/<campaignId>' \
     --header 'Content-Type: application/json' \
     --header "X-Auth-AccessKey: $TULEAP_TOKEN" \
     --data-binary "$(jq -n --rawfile j junit/junit.xml \
       '{automated_tests_results: {build_url: $ENV.CI_JOB_URL, junit_contents: $j}}')"
   ```
5. **Verify before claiming success**: HTTP 2xx from Tuleap, then re-read the campaign (GET) and confirm the expected `TC_*` executions changed status. Report in Arabic: campaign id, counts Passed/Failed/Blocked, unmatched suite names (a mismatch means the `automated_tests` field or `testsuite_name` drifted), and the mapping file path.
6. **Requirements loop-back**: ensure each Test Definition is linked to its requirement artifacts (`req_ids`); TTM then computes requirement coverage in its traceability matrix.

## Failure handling
- 401/403: token expired or user lacks "update Test Executions / read Test Definitions" permissions — ask (in Arabic) for a fresh `tlp-...` token with those permissions.
- Results appear but statuses don't change: suite-name mismatch — fix `testsuite_name`/`automated_tests`, not the API call.
- Campaign endpoint/field differs on the user's Tuleap version: state clearly what is غير مؤكد and ask for the version or a captured request; do not guess alternative endpoints.
