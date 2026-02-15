# Incident Tracker Mini App

Full-stack web app for creating, browsing, and managing production incidents.

## Project structure

- **`/frontend`** — React (Vite) UI: list, detail, create incident
- **`/backend`** — Java Spring Boot REST API (JPA, MySQL/H2)

## How to run this project

**Requirements:** Node.js (for frontend), Java 17+ and Maven (for backend). Optional: MySQL (or use H2 for backend without a database).

### Option A: Run both frontend and backend (full app)

1. **Start the backend** (Terminal 1):
   - **With MySQL:** Create DB `incident_tracker` in MySQL Workbench, set `spring.datasource.password` in `backend/src/main/resources/application.properties`, then:
     ```bash
     cd backend
     mvn spring-boot:run
     ```
   - **Without MySQL:** Use H2 in-memory:
     ```bash
     cd backend
     mvn spring-boot:run -Dspring-boot.run.profiles=h2
     ```
   - Wait until you see `Started IncidentTrackerApplication`. API runs at **http://localhost:8080**.

2. **Start the frontend** (Terminal 2):
   - Create `frontend/.env` with: `VITE_API_BASE_URL=http://localhost:8080`
   - Then:
     ```bash
     cd frontend
     npm install
     npm run dev
     ```
   - Open the URL shown in the terminal (e.g. **http://localhost:5173**).

### Option B: Run frontend only (uses in-memory mock data)

```bash
cd frontend
npm install
npm run dev
```

Open the URL shown (e.g. http://localhost:5173). No backend needed; the app uses mock data. To use the real API later, add `frontend/.env` with `VITE_API_BASE_URL=http://localhost:8080` and restart the dev server.

### Option C: Run backend only

```bash
cd backend
mvn spring-boot:run
```

Use H2 (no MySQL): `mvn spring-boot:run -Dspring-boot.run.profiles=h2`. API: **http://localhost:8080**.

---

## How to post this project on GitHub

1. **Create a new repository on GitHub**
   - Go to [github.com](https://github.com) and sign in.
   - Click **New** (or **+** → **New repository**).
   - Name it (e.g. `IncidentTracker`), choose **Public**, do **not** add a README or .gitignore (this project already has them).
   - Click **Create repository**.

2. **Initialize Git in the project folder** (if not already):
   ```bash
   cd /path/to/IncidentTracker
   git init
   ```

3. **Add the remote and push:**
   ```bash
   git add .
   git commit -m "Initial commit: Incident Tracker full-stack app"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your GitHub username and the repo name you created.

4. **If you use SSH instead of HTTPS:**
   ```bash
   git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

**Note:** The project’s `.gitignore` already excludes `node_modules`, `backend/target`, and `frontend/.env` so secrets and build artifacts are not pushed. After cloning, others should create `frontend/.env` locally and run `npm install` and `mvn spring-boot:run` as in “How to run” above.

---

## Run the full stack (frontend + backend) — detailed

Use two terminals.

**Terminal 1 — Backend**

1. **MySQL:** Create the database (e.g. in MySQL Workbench):
   ```sql
   CREATE DATABASE incident_tracker;
   ```
2. Set your MySQL password in `backend/src/main/resources/application.properties` (`spring.datasource.password=...`).
3. Start the API:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   Wait until you see something like `Started IncidentTrackerApplication`. API: **http://localhost:8080**.

**Without MySQL:** Use H2 (in-memory, no DB setup):
   ```bash
   cd backend
   mvn spring-boot:run -Dspring-boot.run.profiles=h2
   ```

**Terminal 2 — Frontend**

1. Point the frontend at the backend by creating **`frontend/.env`**:
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   ```
2. Install and start:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. Open **http://localhost:5173** in your browser.

The app will use the backend API; the first backend run seeds ~200 incidents if the table is empty.

---

## Setup and run (backend only)

**Requirements:** Java 17+, Maven. For MySQL: MySQL Server (e.g. MySQL Workbench).

1. **Create the database** (MySQL):
   ```sql
   CREATE DATABASE incident_tracker;
   ```
2. **Configure** (if needed) in `backend/src/main/resources/application.properties`:
   - `spring.datasource.username` and `spring.datasource.password` for your MySQL user.
3. **Run the backend:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   (Or add the Maven Wrapper: `mvn wrapper:wrapper`, then use `./mvnw spring-boot:run`.)
   API runs at **http://localhost:8080**. On first run, the app seeds ~200 incidents if the table is empty.

**Without MySQL:** Use H2 in-memory:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=h2
   ```

## Setup and run (frontend only)

1. From the repo root:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open the URL shown (e.g. `http://localhost:5173`).

**Optional:** To use the real backend instead of the in-memory mock, create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Leave `VITE_API_BASE_URL` unset (or omit `.env`) to run with the built-in mock data (~200 incidents).

## API overview (expected contract)

The frontend expects these endpoints:

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/incidents` | List incidents with query params: `page`, `limit`, `service`, `severity`, `status`, `search`, `sortBy`, `sortOrder`. Response: `{ data: Incident[], total: number }`. |
| `GET` | `/api/incidents/:id` | Single incident. |
| `POST` | `/api/incidents` | Create incident. Body: `{ title, service, severity, status, owner?, summary? }`. |
| `PATCH` | `/api/incidents/:id` | Update incident. Body: partial `{ severity?, status?, owner?, summary? }`. |

**Incident shape:** `id`, `title`, `service`, `severity` (SEV1–SEV4), `status` (OPEN | MITIGATED | RESOLVED), `owner?`, `summary?`, `createdAt`, `updatedAt`.

## Design decisions and tradeoffs

- **Frontend-first:** UI was built against the API contract and an in-memory mock so it can run and be tested without a backend. Setting `VITE_API_BASE_URL` switches to the real API.
- **URL-driven list state:** Pagination, filters, search, and sort are encoded in the URL (`useSearchParams`). Links are shareable and browser back/forward work as expected.
- **Debounced search:** Search input is debounced (~350 ms) before updating the URL and refetching to limit request volume.
- **React Query:** Server state (list and detail) is handled with TanStack Query for caching, loading/error states, and cache invalidation after create/update.
- **Forms:** React Hook Form + Zod for validation and clear error handling on create and edit.

## Improvements with more time
- E2E tests (e.g. Playwright) for list, filter, create, and edit flows.
- Stronger a11y: skip link, focus trap in modals if added, and automated a11y checks.
- Table: virtualized list for very large result sets.
- Export: CSV/JSON export of filtered incidents.
