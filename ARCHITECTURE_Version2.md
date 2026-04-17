# Architecture Document
## Digital Intelligent Platform for ESG Performance and GHG Monitoring

**Version:** 1.0  
**Status:** Draft  
**Last Updated:** 2026-04-17

---

## 1. Purpose

This document defines the high-level architecture for a centralized ESG and GHG monitoring platform. The goal is to support accurate data capture, emissions calculation, auditability, reporting, governance, and scenario analysis.

---

## 2. Architecture Goals

- Provide a single source of truth for ESG and emissions data
- Support Scope 1, Scope 2, and selected Scope 3 emissions
- Ensure traceability from report output back to source data
- Enable role-based access and approval workflows
- Support scalable growth across business units and suppliers
- Produce assurance-ready reports with audit trails

---

## 3. High-Level System Overview

The platform is organized into the following layers:

1. **Presentation Layer**
   - Web dashboard
   - Supplier portal
   - Admin console
   - Executive reporting views

2. **Application Layer**
   - ESG data management
   - Emissions calculation engine
   - Supplier engagement workflows
   - Validation and approval engine
   - Reporting service
   - Scenario analysis service

3. **Data Layer**
   - Relational database for structured ESG data
   - File storage for evidence uploads and exported reports
   - Audit log store
   - Optional analytics warehouse for historical and aggregated data

4. **Integration Layer**
   - File Upload Parsers (Images OCR, PDFs, CSV, Excel)
   - ERP/finance integration
   - Utility or energy data feeds
   - Supplier data submissions
   - Authentication / SSO integration

5. **Collaboration Layer**
   - Individual Git branches dedicated out per-member (Sameera, Sahiti, Jiya, Atharva, Sparsh, Harsh).
   - Strict avoidance of hardcoded data—all UI/Backend interactions must be strictly derived from the relational schema and multi-format payloads.

---

## 4. Recommended Technology Stack

### Frontend
- React or Next.js
- TypeScript
- Tailwind CSS or Material UI
- Charting library such as Recharts or ECharts

### Backend
- Node.js with Express
- TypeScript
- REST APIs
- **Data Extractor Modules**: Tesseract.js (or equivalent OCR) / PDF-Parse for reading uploaded documents and images.

### Database
- PostgreSQL

### Background Processing
- Job queue or worker process for imports, calculations, and scheduled tasks

### Storage
- Object storage for evidence documents and exported files

### Infrastructure
- Docker
- Cloud deployment on AWS, Azure, or GCP

---

## 5. Core Modules

### 5.1 Identity and Access Management
Responsibilities:
- Authenticate users
- Enforce role-based access control
- Manage permissions by organization, business unit, and workflow role

Roles:
- Admin
- Sustainability Manager
- Data Contributor
- Approver
- Auditor
- Executive Viewer
- Supplier User

---

### 5.2 Organization and Master Data Module
Responsibilities:
- Manage organizations, business units, facilities, and suppliers
- Define reporting periods
- Maintain metadata such as regions, sectors, and categories

Core entities:
- Organization
- BusinessUnit
- Site/Facility
- Supplier
- ReportingPeriod

---

### 5.3 ESG Activity Data Module
Responsibilities:
- Capture raw activity data
- Support manual entry and file import
- Store evidence and source references
- Track ownership and status

Examples of activity data:
- Fuel consumption
- Purchased electricity
- Travel
- Waste
- Purchased goods and services
- Supplier activity submissions

---

### 5.4 Emissions Calculation Engine
Responsibilities:
- Apply emission factors to activity data
- Calculate Scope 1, 2, and selected Scope 3 emissions
- Store calculation traces and versioned results
- Recalculate when factors or source data change

Key functions:
- Calculation by scope
- Calculation by category
- Factor versioning
- Unit conversion
- Baseline comparison

---

### 5.5 Scope 3 Supplier Engagement Module
Responsibilities:
- Prioritize suppliers by materiality
- Send data requests
- Track supplier response status
- Score supplier data quality
- Support review and validation of submissions

Supplier workflow:
1. Identify priority suppliers
2. Send request
3. Receive submission
4. Validate submission
5. Accept or reject
6. Follow up if incomplete

---

### 5.6 Validation and Workflow Module
Responsibilities:
- Validate required fields
- Enforce numeric and logical checks
- Flag anomalies
- Support approvals and escalations
- Track workflow states

Workflow states:
- Draft
- Submitted
- Under Review
- Approved
- Rejected
- Reopened

---

### 5.7 Reporting and Dashboard Module
Responsibilities:
- Show emissions trends
- Display data completeness
- Provide supplier status views
- Generate management and board reports
- Export PDF and Excel outputs

Dashboard views:
- Total emissions by scope
- Emissions by facility/business unit
- Scope 3 materiality summary
- Data quality and completeness
- Reporting status
- Target progress

---

### 5.8 Governance and Audit Module
Responsibilities:
- Store immutable audit logs
- Track record history
- Log approvals and changes
- Maintain evidence linkage
- Support assurance and compliance review

Audit events:
- User login
- Data creation
- Data update
- Calculation run
- Approval action
- Report generation
- Factor change

---

### 5.9 Scenario Analysis Module
Responsibilities:
- Compare baseline and target pathways
- Model carbon pricing assumptions
- Simulate reduction plans
- Display impact on emissions and costs

MVP scenario capabilities:
- Rule-based projections
- Simple what-if analysis
- Carbon cost estimation
- Target tracking

---

## 6. Data Architecture

### 6.1 Primary Database
Use PostgreSQL for structured storage of:
- users
- roles
- organizations
- activity records
- emission factors
- emission results
- supplier records
- workflows
- reports
- audit logs

### 6.2 Object Storage
Store:
- evidence files
- uploaded spreadsheets
- generated PDFs
- report exports

### 6.3 Analytics Layer
Optional warehouse or materialized views for:
- trend analysis
- historical reporting
- aggregated KPI dashboards

---

## 7. Core Data Model

### Main Entities
- User
- Role
- Organization
- BusinessUnit
- Facility
- Supplier
- ReportingPeriod
- ActivityRecord
- EmissionFactor
- EmissionCalculation
- Scope3Category
- SupplierRequest
- SupplierSubmission
- Approval
- AuditLog
- Report
- Scenario

### Relationships
- An Organization has many Business Units
- A Business Unit has many Facilities
- A Facility has many Activity Records
- Activity Records map to Emission Factors
- Emission Calculations generate Emission Results
- Suppliers submit data for Scope 3 categories
- Reports compile calculated results and audit evidence

---

## 8. API Architecture

Recommended REST API groups:
- `/auth`
- `/users`
- `/organizations`
- `/business-units`
- `/facilities`
- `/suppliers`
- `/activities`
- `/emissions`
- `/factors`
- `/reports`
- `/audit`
- `/workflows`
- `/scenarios`

API principles:
- Versioned endpoints
- Consistent request and response formats
- Pagination and filtering
- Role-based authorization
- Traceable identifiers for calculations and reports

---

## 9. Workflow Flows

### 9.1 Data Collection Flow
1. User creates or imports activity data
2. System validates inputs
3. Data is stored with metadata and evidence
4. Approval is requested if required
5. Approved data is sent to calculation engine

### 9.2 Calculation Flow
1. Select activity records for a reporting period
2. Retrieve matching emission factors
3. Convert units if needed
4. Calculate emissions
5. Store result and calculation trace
6. Refresh dashboards and reports

### 9.3 Supplier Engagement Flow
1. Identify high-impact suppliers
2. Send data requests
3. Collect submissions
4. Validate completeness
5. Escalate missing submissions
6. Include approved supplier data in Scope 3 reporting

### 9.4 Report Generation Flow
1. Select reporting period
2. Gather validated data and calculations
3. Compile charts, tables, and summary metrics
4. Attach audit trail references
5. Export report in required format

---

## 10. Security Architecture

### Security Controls
- Authentication via SSO or secure login
- Role-based authorization
- Least-privilege access
- Encrypted data in transit and at rest
- Secure file upload validation
- Audit logging for all sensitive actions

### Data Protection
- Mask or restrict sensitive supplier data where required
- Separate permissions for editing and approving data
- Protect report generation and export access

---

## 11. Scalability Considerations

The platform should scale through:
- Modular services
- Background jobs for heavy calculations and imports
- Caching for dashboards
- Partitioning or archiving for historical data
- Asynchronous processing for report generation

---

## 12. Reliability and Traceability

- Preserve all source data versions
- Store calculation history
- Keep report snapshots immutable after publication
- Log every user action affecting ESG data
- Support restoration of deleted or corrected records

---

## 13. Non-Functional Requirements

- High accuracy
- Strong auditability
- Fast reporting response
- Secure access control
- Modular design for future growth
- Easy maintainability
-
