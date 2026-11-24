---
name: gitlab-ci-setup
description: Creates or fixes the .gitlab-ci.yml for this Playwright + TypeScript framework running inside Docker (node image with cached Playwright browsers) on a local GitLab instance. Use when the user wants CI enabled on their local GitLab.
---

# GitLab CI Setup (Docker Runner, Local GitLab)

## Output language (mandatory)
- All prose for the user MUST be in Arabic (RTL). Keep YAML, code, identifiers, paths, CLI commands and technical terms in English.

## Prerequisites to confirm first (ask in Arabic if unknown)
1. Runner executor: **docker** (expected) or shell. This skill targets Docker.
2. GitLab version (affects MR test-report widget availability).
3. Runner has internet OR a local Docker registry mirror for `node:*` images (offline GitLab instances often block Docker Hub).

## The .gitlab-ci.yml (starting point)
```yaml
stages: [verify, test]

default:
  image: node:20-bookworm
  tags: [docker]

variables:
  PLAYWRIGHT_BROWSERS_PATH: "$CI_PROJECT_DIR/.pw-browsers"
  npm_config_cache: "$CI_PROJECT_DIR/.npm-cache"

cache:
  key:
    files: [package-lock.json]
  paths: [.npm-cache, .pw-browsers]

install:
  stage: verify
  script:
    - npm ci
    - npx playwright install --with-deps chromium
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH

typecheck:
  stage: verify
  needs: [install]
  script:
    - npm run typecheck

tests:
  stage: test
  needs: [install]
  script:
    - npm test
  artifacts:
    when: always
    expire_in: 1 week
    paths: [playwright-report/, test-results/]
    reports:
      junit: junit/junit.xml
```

## Wire it up
1. Write `.gitlab-ci.yml` at the repo root.
2. Add the `junit` reporter so GitLab renders unit test results in the MR page: in `playwright.config.ts` set
   ```typescript
   reporter: [ ['html', { open: 'never' }], ['list'], ['junit', { outputFile: 'junit/junit.xml' }] ]
   ```
3. If the runner is offline: switch `image:` to the internal registry mirror (e.g. `registry.local.example/oci/node:20-bookworm`) and pre-bake Playwright browsers into a custom image in the registry — say this in the Arabic summary.
4. Verify locally before pushing: `docker run --rm -v "$PWD":/w -w /w node:20-bookworm bash -lc "npm ci && npm run typecheck && npm test"` (adjust if no internet).

## Failure handling
- Job stuck "pending": no runner with tag `docker` — tell the user in Arabic to register/tag a runner in their local GitLab admin area.
- Playwright browser download fails: offline runner — propose the pre-baked image and the internal registry.
- Do not invent GitLab features beyond the running version; if unsure, deliver the conservative static-artifacts variant (HTML report as artifact) instead of MR widgets.
