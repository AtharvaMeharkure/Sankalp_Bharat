# CarbonLens - Detailed Phase Delegation & Branching Tasks

> View `implementation-pan.md` for specific Cross-Branch Contracts tying these roles together.

## Team Git Strategy

Every member must create and push code directly to their own dedicated feature branches.

1. `feature/Sameera-Auth-OCR-Engine`
2. `feature/Sahiti-Database-Calculations`
3. `feature/Jiya-MasterData-Aggregations`
4. `feature/Atharva-Frontend-IngestionUI`
5. `feature/Sparsh-Dashboard-Analytics`
6. `feature/Harsh-SupplierPortal-Styling`

---

## 4-Phase Granular Task Allocation

### 1. Sameera (Backend Infrastructure, Files & Auth)
**Phase 1:** Build the Express server core (`index.ts`). Implement `POST /api/auth/login`. Implement the `multer` middleware strategy handling file uploads (PDFs, Images, Excel). Integrate Tesseract.js / PDF-Parse.
**Phase 2:** Build `authenticateToken` express middleware. Construct Issue Tracking APIs (`POST /api/issues`).
**Phase 3:** Build `restrictToRole(['ADMIN'])` access control middleware covering secure controllers.
**Phase 4:** Execute comprehensive API testing logic via Postman evaluating injection defenses and error codes.

### 2. Sahiti (Database Architecture & Validation Engines)
**Phase 1:** Build the `schema.prisma`. Write the `EmissionEngine.calculate()` service translating factors to CO2e independently of OCR processing.
**Phase 2:** Write a webhook/worker checking CO2e outputs. Automatically invoke Prisma `Issue` generation if extreme deviations exist.
**Phase 3:** Generate compound database indexes `{ orgId, timestamp }` ensuring performant aggregation reads.
**Phase 4:** Develop an `AuditLogging` engine abstracting Prisma middlewares enforcing that user actions mutate the Audit trails.

### 3. Jiya (Master Data, Scenarios & Analytic APIs)
**Phase 1:** Write the `seed.ts` script using heavy array mapping generating 1,000 randomized Scope 3 validation records.
**Phase 2:** Create secluded Routing Controllers securely mapping external unauthenticated URLs referencing the specific Supplier identity databases.
**Phase 3:** Write heavily optimized SQL groupings returning exact `{ scope1, scope2, scope3, trends }` payload mappings to frontend engineers.
**Phase 4:** Provide `/api/scenarios/simulate` endpoint evaluating parameter manipulations, and structure standard JSON-to-CSV exporting utilities.

### 4. Atharva (Frontend Global State, Routing & Upload UI)
**Phase 1:** Configure React Router and Zustand. Construct Drag-and-Drop Image/PDF/CSV UI `<input type="file" />` dispatching HTTP `FormData`.
**Phase 2:** Build the explicit Manual Entry complex forms rendering logic based heavily upon selected dropdown emission formats.
**Phase 3:** Enforce blanket `<Suspense>` / Skeleton UI blocks intercepting pending API query state resolution paths.
**Phase 4:** Map global internal table modules tracking specific Supplier onboarding transmission statuses.

### 5. Sparsh (Frontend Dashboard Analytics & Complex Data Grids)
**Phase 1:** Utilize components to build highly-paginated advanced Data Grids hooking straight to massive payload GET requests.
**Phase 2:** Construct the advanced Governance grids embedding Approve/Flag actions communicating correctly with Issue schemas.
**Phase 3:** Hook `Recharts` representations accurately interpreting the specific mathematical DTO schemas broadcast by Jiya without manual data mangling.
**Phase 4:** Build the UI managing the Scenario configuration tools dispatching parameter values.

### 6. Harsh (Frontend Global Systems, External Ports & Styling)
**Phase 1:** Configure global React Hook Form architecture enforcing standard schema limitations mapping onto the Setting configurations.
**Phase 2:** Extrapolate disconnected supplier paths isolating navigation components strictly from the protected Admin dashboards schemas.
**Phase 3:** Institute global application Toaster alert states tied to generalized Axios interception patterns capturing diverse failed HTTP status broadcasts.
**Phase 4:** Compile the generalized demonstration aesthetic rules processing shadow layers, CSS typography consistency, and PDF layout containers.