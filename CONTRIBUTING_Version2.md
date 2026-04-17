# Contributing Guidelines
## Digital Intelligent Platform for ESG Performance and GHG Monitoring

**Version:** 1.0  
**Status:** Draft  
**Last Updated:** 2026-04-17

---

## 1. Purpose

This document defines how contributors should work on this project to maintain quality, consistency, and traceability.

---

## 2. Contribution Principles

- Keep changes small and focused
- Follow the project scope and architecture
- Avoid unnecessary complexity
- Preserve auditability and traceability
- Write code and documentation that is easy to understand
- Add or update tests for any meaningful change

---

## 3. Working Rules

### Before Starting
- Read `README.md`
- Read `PRD.md`
- Read `ARCHITECTURE.md`
- Read `TASKS.md`
- Check `DECISIONS.md` if available

### During Development
- Use clear naming conventions
- Keep business logic separate from UI logic
- Reuse existing patterns when possible
- Do not change scope without approval
- Update documentation when behavior changes

### Before Submitting Changes
- Run tests
- Check formatting and linting
- Verify that calculations and workflows still behave correctly
- Ensure there are no broken imports or references

---

## 4. Code Style Guidelines

- Prefer readable, maintainable code over clever code
- Use consistent formatting
- Keep functions small and focused
- Avoid duplicate logic
- Add comments only where the logic is not obvious
- Use descriptive names for variables, functions, and files

---

## 5. Testing Expectations

Any change that affects behavior should include tests for:
- Core business logic
- Validation rules
- Workflow transitions
- API responses
- Calculation outputs

---

## 6. Documentation Expectations

Update documentation when:
- A feature is added
- A workflow changes
- A data model changes
- An API changes
- A calculation method changes
- A new decision is made

---

## 7. Pull Request Expectations

A good pull request should include:
- Clear summary of changes
- Reason for the change
- Relevant screenshots or examples if applicable
- Test results
- Notes about impacts to calculations, reports, or workflows

---

## 8. Branching and Commit Guidelines

### Branch Names
Use descriptive branch names such as:
- `feature/activity-import`
- `feature/emissions-engine`
- `fix/report-export`
- `docs/update-prd`

### Commit Messages
Use clear commit messages such as:
- `Add activity import validation`
- `Implement Scope 1 calculation service`
- `Update dashboard summary cards`

---

## 9. Review Checklist

Before merging, confirm:
- Requirements are satisfied
- Tests pass
- Documentation is updated
- No unnecessary files are changed
- Audit logging is preserved
- Security and permissions are correct

---

## 10. Project-Specific Notes

This project focuses on ESG and GHG data integrity. Contributors should always consider:
- data accuracy
- traceability
- reporting confidence
- governance needs
- supplier data quality
- audit readiness

---