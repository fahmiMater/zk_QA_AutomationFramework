# ADR-004

## Title

Environment Management Strategy

## Status

Approved

## Date

2026-06-22

## Context

The QA Automation Platform is designed to support:

- Multiple systems
    
- Multiple environments
    
- Multiple business domains
    
- Multiple execution pipelines
    

The platform must allow the same automated tests to execute against different environments without requiring code changes.

Supported environments include:

- Development (DEV)
    
- Quality Assurance (QA)
    
- Staging (STAGING)
    
- Production (PROD)
    

Environment-specific configuration must be separated from automation code.

---

## Decision

The platform will use a centralized Environment Management Strategy.

Environment configuration files will be stored under:

```text
environments/
├── dev/
├── qa/
├── staging/
└── prod/
```

Each environment will maintain its own configuration and supporting data.

Example:

```text
environments/
└── qa/
    ├── config.json
    ├── users.json
    └── README.md
```

Automation code must never contain environment-specific values.

---

## Configuration Ownership

Environment-specific information includes:

- Base URLs
    
- Credentials
    
- Timeouts
    
- Retry configuration
    
- Company identifiers
    
- Branch identifiers
    
- Other deployment-specific settings
    

These values must be loaded dynamically at runtime.

---

## Runtime Selection

Environment selection will be controlled through execution parameters.

Examples:

```bash
npm run test -- --env=dev

npm run test -- --env=qa

npm run test -- --env=staging

npm run test -- --env=prod
```

The framework must determine the active environment during execution and load the corresponding configuration.

---

## Environment Manager Responsibility

A dedicated EnvironmentManager component will be responsible for:

- Loading environment configuration
    
- Validating configuration structure
    
- Providing configuration access
    
- Preventing invalid environment selection
    

The EnvironmentManager will be the single source of truth for environment configuration.

---

## Execution Context Responsibility

ExecutionContext will store runtime information such as:

- Current environment
    
- Current company
    
- Current branch
    
- Current language
    
- Current user
    

This information will be available across the framework during execution.

---

## Security Rules

Credentials must never be hardcoded in:

- Tests
    
- Pages
    
- Components
    
- Flows
    

Credentials must be loaded from environment configuration sources.

Sensitive information must not be committed to source control.

---

## Rationale

This strategy provides:

- Environment independence
    
- Improved maintainability
    
- Easier CI/CD integration
    
- Reduced duplication
    
- Better scalability
    
- Centralized configuration management
    

The same automation code can execute against multiple environments without modification.

---

## Consequences

### Positive

- Single codebase for all environments.
    
- Simplified deployment pipelines.
    
- Easier onboarding of new environments.
    
- Centralized configuration management.
    

### Negative

- Additional configuration management overhead.
    
- Validation logic required for environment files.
    

---

## Alternatives Considered

### Hardcoded Configuration

Rejected because:

- Difficult to maintain.
    
- Environment switching requires code changes.
    
- High risk of execution mistakes.
    

### Environment Variables Only

Rejected because:

- Difficult to manage large ERP configurations.
    
- Poor visibility for non-technical team members.
    
- Less suitable for complex enterprise environments.
    

---

## Future Enhancements

Future versions may support:

- Secret Vault Integration
    
- Azure Key Vault
    
- HashiCorp Vault
    
- GitLab Protected Variables
    
- Multi-Company Execution
    
- Multi-Tenant Execution
    

without changing the framework architecture.