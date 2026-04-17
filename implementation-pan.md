# CarbonLens Implementation Plan

> [!WARNING]
> **STRICT DEVELOPMENT POLICY**
> * NO hardcoded data or mock dataset arrays are permitted anywhere in the frontend clients or backend business logic.
> * ALL data must be loaded dynamically from the database, environment configurations, or API mutations. 

---

## Cross-Branch Integration Contracts

To ensure independent branches successfully fuse together, the team must strictly obey these architectural boundaries. **Do not deviate from these data shapes:**

1. **Sameera (OCR API) -> Sahiti (Calculations)**:
   * Sameera's OCR document parsers will **not** write to the database directly. Her module must output an intermediate structured JSON array exclusively: `[ { activityType: string, value: number, unit: string } ]`.
   * Sahiti will expose an internal service method `EmissionEngine.processBatch()`. Sameera will pass her JSON arrays directly to Sahiti's service.
2. **Atharva (Auth UI) -> Sameera (Auth API)**:
   * Sameera will return exactly `{ token: string, user: { id: string, orgId: string, role: string } }` upon login.
   * Atharva will persist this in global state and attach it as a `Bearer {token}` header to every single Axios request. Jiya and Sahiti will depend entirely on this header to extract the `orgId` via middleware.
3. **Jiya (Analytics API) -> Sparsh (Dashboard UI)**:
   * Jiya's APIs (`GET /api/metrics`) will execute database summations on the server. She will return exactly: `{ scope1: number, scope2: number, scope3: number, trends: [{ month: string, emissions: number }] }`.
   * Sparsh will NOT manipulate arrays on the frontend. He will strictly plug Jiya's DTO response directly into the Recharts components.
4. **Harsh (Supplier UI) -> Jiya (Supplier API)**:
   * Harsh will send a POST request with exactly: `{ tokenHash: string, metrics: [...], evidence: [files] }`. 
   * Jiya will manage decoding the tokenHash to authenticate the specific supplier identity before validating.

---

## 4-Phase Granular Task Allocation

### Phase 1: Core Engine, Multi-Format Ingestion & Scope 3 Evaluation

* **Sameera**: Build the Express server core (`index.ts`). Implement `POST /api/auth/login`. Implement the `multer` middleware strategy handling file uploads (PDFs, Images, Excel). Integrate Tesseract.js / PDF-Parse to extract text strings from documents and map them to the shared JSON array contract.
* **Sahiti**: Build the `schema.prisma` mapping Organizations to Records. Write the `EmissionEngine.calculate()` service taking defined activity units, querying DB dynamic Emission Factors, and executing math translations to CO2e.
* **Jiya**: Build the `seed.ts` script using a heavy looping logic injecting 1,000 randomized Scope 3 validation records spanning the last 6 months. Expose System CRUD APIs (`/api/organizations`, `/api/facilities`).
* **Atharva**: Configure React Router and Zustand. Build the Login screen hooking into Sameera's API. Construct the central "Upload Data" UI dropping `<input type="file" />` payloads formatted as HTTP FormData structures sending to Sameera's routes.
* **Sparsh**: Establish the Tailwind/MUI base CSS library. Build a high-performance Data Grid Component (e.g. `react-table`) hooked to a standard GET endpoint ready to render Sahiti's massive 1000-record dataset.
* **Harsh**: Build nested Form layouts (using `react-hook-form` & Zod validation) for the internal 'Settings' screen, formatting payloads specifically for Jiya's Master Data APIs.

### Phase 2: Auth, Governance & Supplier Flow

* **Sameera**: Build `authenticateToken` express middleware extracting the JWT. Construct Issue Tracking APIs (`POST /api/issues`) capturing `recordId` and `issueDescription`.
* **Sahiti**: Write a webhook/worker that automatically checks the CO2e calculations emitted by the Engine. If a single emission value exceeds limits (e.g. >50k kg), automatically invoke Prisma to create an `Issue` flagging the record.
* **Jiya**: Create a secluded Routing Controller strictly for external Suppliers `/api/supplier/submit`. Generate automated unique hashes allowing unauthenticated external URLs to map securely to internal supplier database IDs.
* **Atharva**: Build out a dynamic "Manual Entry Form" containing varying nested inputs depending on user selection (e.g. showing "Liters" for Fuel, but "kWh" for Electricity).
* **Sparsh**: Construct the advanced Governance Review Data Grid supporting nested rows. Embed direct "Approve / Flag" action buttons triggering Sameera's Issue tracking APIs.
* **Harsh**: Build the specific, isolated UI pathway for the Public Supplier Submission portals ensuring the interface is sanitized of internal navigational sidebars.

### Phase 3: Dashboard & Analytics

* **Sameera**: Build `restrictToRole(['ADMIN'])` access control middleware. Plug this into all sensitive API controllers forcing 403 Forbidden errors if bypassed.
* **Sahiti**: Generate compound indexes in Prisma for the Reporting tables `{ orgId, timestamp }` heavily decreasing lookup strain over Jiya's aggregations.
* **Jiya**: Write heavily optimized grouping queries (SQL `GROUP BY`) returning the exact dashboard DTO interfaces mandated in the contract above.
* **Atharva**: Sweep the React code replacing all blank screens pending API data with explicit global `<Suspense>` loading spinners or skeleton placeholder divs.
* **Sparsh**: Embed `Recharts` Line graphs and Donut elements, mapping data variables tightly to Jiya's aggregate JSON response structures without intercepting math on the client.
* **Harsh**: Institute global application Toaster alerts via an Axios response interceptor—triggering automated red visual popups whenever the backend responds with >= 400 errors.

### Phase 4: Scenarios, Reporting & Polish

* **Sameera**: Execute comprehensive API testing logic via Postman ensuring that injection attacks, mass assignments, and unauthorized token manipulation rejects effectively.
* **Sahiti**: Develop an `AuditLogging` engine abstracting Prisma middlewares enforcing that every database mutation logs the `req.user.id` altering data to an untouchable audit table.
* **Jiya**: Provide `/api/scenarios/simulate` endpoint evaluating dynamic reduction percentages altering baseline targets. Execute a backend JSON-to-CSV translation mapping exporting historical records.
* **Atharva**: Map internal "Supplier Management" status boards allowing organizational users to resend email token invitations handled by Jiya's endpoints.
* **Sparsh**: Complete the graphical Interface controlling the what-if Scenario configurations featuring draggable visual sliders adjusting payload constraints.
* **Harsh**: Complete PDF viewing containers processing Jiya's report payloads. Enforce a final typographical and styling CSS review standardizing the demonstration environment.

---

## Long-Term Project Tasks (Post-MVP Technical Roadmap)

To evolve the MVP into an enterprise-scale architecture over the next 12 months, teams must plan for these overarching transitions:

1. **Decoupled OCR Microservice & Event Queuing (Sameera & Sahiti)**
   - *Problem*: Heavy multi-page PDF processing locks up the core Express event-loop, blocking other users.
   - *Task*: Segment OCR document parsing into a decoupled Node/Python worker connected via **Redis / RabbitMQ**. The frontend will upload a file and immediately receive HTTP 202 Accepted, utilizing WebSockets to visually ping users when parsing completes.
2. **AI-Driven Automated Factor Mapping (Sahiti & Sparsh)**
   - *Problem*: Assigning supplier text descriptions to exact emission factor types implies manual user tagging.
   - *Task*: Deploy an NLP machine learning model extracting textual descriptions (e.g., "Logistics - 50 barrels") and calculating probability matrices against the backend parameter tables, automatically predicting the correct internal ID mappings. 
3. **Multi-Tenant RLS & Data Sovereignty Sharding (Sahiti)**
   - *Problem*: SQLite relies entirely on code-level `WHERE orgId = 'x'` queries, allowing potential leakage gaps.
   - *Task*: Migrate data to PostgreSQL and initiate intrinsic Row-Level Security (RLS) enforcing that raw database instances physically isolate queries per organization identifier.
4. **Bi-directional ERP Automated Feed Pipelines (Jiya & Sameera)**
   - *Problem*: Companies are relying on physical CSV exports from SAP and Oracle being re-uploaded to CarbonLens.
   - *Task*: Expose Webhook Listeners and construct strict scheduled Polling adapters extracting payload dimensions from upstream ERP gateways nightly.
5. **Micro-Frontend Modularization (Atharva & Harsh)**
   - *Problem*: Security perimeters exist concurrently in monolithic frontend deployments.
   - *Task*: Implement *Webpack Module Federation*. Separate the unauthenticated Web External Supplier entry zones heavily disconnected from deeply scrutinized Admin/Management analytics instances, enforcing isolation on disparate CDN servers.
