# AI Instructions
## Digital Intelligent Platform for ESG Performance and GHG Monitoring

**Version:** 1.0  
**Status:** Draft  
**Last Updated:** 2026-04-17

---

## 1. Purpose

This file provides instructions for AI-assisted development in this project.  
The goal is to ensure that AI changes remain accurate, consistent, and aligned with the product scope.

---

## 2. Core Rules for AI

### 2.1 Follow the Documents
Before generating or modifying code, always follow:
- `README.md`
- `PRD.md`
- `ARCHITECTURE.md`
- `TASKS.md`
- `DECISIONS.md` if present
- `TEST_PLAN.md`

### 2.2 Do Not Invent Requirements
- Do not add features that are not in the PRD or approved backlog
- Do not change business rules without explicit instruction
- Do not assume reporting standards, calculations, or workflows unless specified

### 2.3 Keep the Solution Feasible
- Prefer simple, reliable architecture
- Avoid overengineering
- Build the MVP first
- Use modular design so future expansion is easy

### 2.4 Preserve Data Integrity
- Always protect auditability
- Never remove traceability fields
- Keep historical records when calculations change
- Ensure reports can be traced back to source data

---

## 3. Implementation Behavior

### 3.1 When Creating Code
- Start with the smallest useful unit
- Prefer clear and maintainable code
- Separate business logic, data access, and UI
- Add validation for user input
- Include logging where it helps traceability

### 3.2 When Modifying Code
- Do not break existing workflows
- Keep changes localized
- Update tests if behavior changes
- Update docs if structure or logic changes

### 3.3 When Unsure
- Ask for clarification
- Do not guess on critical business rules
- Do not silently choose values for emissions logic, scopes, or approvals

---

## 4. Project-Specific AI Constraints

The AI must always respect these constraints:

- ESG and GHG calculations must be traceable
- Scope 1, Scope 2, and selected Scope 3 should be handled separately
- Emission factors must be versioned
- Report outputs must match approved data only
- Supplier submissions must remain auditable
- Workflow states must be explicit
- Governance and approval logic must remain visible
- Scenario analysis should be simple in MVP

---

## 5. Preferred Development Order

AI should implement the project in this order:

1. Project structure and setup
2. Authentication and roles
3. Master data entities
4. Activity capture
5. Validation and audit logging
6. Emissions calculation engine
7. Dashboards and reporting
8. Supplier workflows
9. Governance and approvals
10. Scenario analysis
11. Testing and hardening

---

## 6. Output Expectations

When AI generates code or documentation:
- Keep output consistent with the existing architecture
- Use clear file names
- Avoid duplicate files or duplicated logic
- Include tests where appropriate
- Mention assumptions explicitly
- Prefer practical implementation over theoretical completeness

---

## 7. Prohibited Behavior

AI should not:
- Rewrite the entire project without instruction
- Add unnecessary microservices
- Ignore audit or reporting requirements
- Create hidden business rules
- Remove validation silently
- Change scope without approval

---

## 8. Definition of Good AI Output

Good AI output for this project is:
- Correct
- Feasible
- Traceable
- Testable
- Maintainable
- Aligned with the PRD and architecture

---