# ZiroLogistics — WMS Frontend

Frontend web application for the ZiroLogistics Warehouse Management System (WMS).

**Project status:** Active development. This repository is a development and portfolio project, not a claim of a production-ready or fully featured WMS.

## Repositories

| Component | Repository |
|---|---|
| Frontend | [ZiroLogistics-Frontend](https://github.com/Youuzzi/ZiroLogistics-Frontend) |
| Backend API | [ZiroLogistics-Backend](https://github.com/Youuzzi/ZiroLogistics-Backend) |

## Current frontend scope

The routes currently registered in `src/App.jsx` are:

| Route | Purpose |
|---|---|
| `/login` | Authentication |
| `/dashboard` | Dashboard summary |
| `/warehouses` | Warehouse listing and creation |
| `/warehouses/:warehouseId/bins` | Bin listing and creation for a warehouse |
| `/items` | Item listing and creation |
| `/inbound` | Record inbound stock |
| `/outbound` | Record outbound stock |
| `/transfer` | Transfer stock between bins |
| `/ledger` | Inventory movement ledger |

The backend also exposes stock and low-stock query endpoints. A dedicated stock inventory page and route are not currently registered in this frontend.

### Implemented workflow areas

- JWT login and protected frontend routes.
- Warehouse and bin listing/creation.
- Item listing/creation.
- Inbound and outbound stock transactions.
- Bin-to-bin stock transfer.
- Inventory ledger viewing.
- Dashboard summary fetched from the backend.

**Known scope limitations from the current API/frontend audit:**

- Warehouse, bin, and item update/delete operations are not exposed by the audited backend API.
- The frontend does not currently provide a dedicated inventory stocks page or low-stock alerts page.
- Dashboard data is fetched when the page loads; it is not a real-time dashboard.
- The backend's `totalTransactionsToday` summary field currently returns a hard-coded value. Do not interpret it as a verified daily transaction count.
- Pagination exists as a component, but it is not consistently wired into every list page.
- A successful login and protected route do not by themselves prove that every backend workflow is authorized or operational.

Refer to the backend repository for the authoritative API scope and business rules.

## Technology stack

| Area | Technology |
|---|---|
| UI framework | React 19 |
| Build tooling | Vite 8 |
| Styling | Tailwind CSS 4 |
| Routing | React Router DOM 7 |
| HTTP client | Axios |
| Notifications | React Hot Toast |
| Icons | Lucide React |
| Language | JavaScript (ES modules) |

Dependency versions are maintained in [package.json](package.json).

## Project structure

```text
src/
├── api/
│   ├── axiosConfig.js
│   ├── WarehouseService.js
│   ├── BinService.js
│   ├── ItemService.js
│   ├── InboundService.js
│   ├── OutboundService.js
│   ├── TransferService.js
│   ├── InventoryService.js
│   └── DashboardService.js
├── components/
│   ├── ErrorBoundary.jsx
│   ├── MainLayout.jsx
│   ├── Pagination.jsx
│   ├── Sidebar.jsx
│   └── Topbar.jsx
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Warehouses.jsx
│   ├── Bins.jsx
│   ├── Items.jsx
│   ├── Inbound.jsx
│   ├── Outbound.jsx
│   ├── Transfer.jsx
│   └── Ledger.jsx
├── App.jsx
├── index.css
└── main.jsx
```

This is a representative overview of the current source layout; consult the repository for the complete file tree.

## Requirements

- Node.js version supported by the installed Vite 8 release.
- npm.
- The ZiroLogistics backend running and reachable from the browser.

For the backend's Java, Docker, database, and environment requirements, follow the [backend README](https://github.com/Youuzzi/ZiroLogistics-Backend#readme).

## Run the frontend locally

### 1. Clone and install

```bash
git clone https://github.com/Youuzzi/ZiroLogistics-Frontend.git
cd ZiroLogistics-Frontend
npm install
```

### 2. Configure the backend URL

Create a local `.env.local` file in the frontend project root:

```dotenv
VITE_API_BASE_URL=http://localhost:8081/api/v1.0
```

The frontend Axios instance reads `VITE_API_BASE_URL`. Do not commit local secrets or environment-specific credentials.

If the backend is hosted elsewhere, set this variable to the reachable API base URL. Restart the Vite development server after changing environment variables.

### 3. Start the development server

```bash
npm run dev
```

Vite normally serves the frontend at `http://localhost:5173`.

### 4. Start the backend

The backend repository documents the supported local and Docker Compose setup. Its Compose configuration currently exposes the API at `http://localhost:8081`.

For the Docker Compose backend setup, a JWT secret must be configured in the shell before starting Compose. Follow the backend README for the exact PowerShell commands and database configuration.

The backend's optional demo-account initializer requires the `demo` profile and `demo.account.enabled=true`; it is not automatically enabled by simply starting the frontend. Follow the backend documentation to configure an isolated local demo account. Never publish demo credentials.

## Available scripts

```bash
npm run dev      # Start Vite development server
npm run build    # Create a production build
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
```

These commands are documented from `package.json`; their successful execution must be verified in the target environment.

## UI/UX documentation

The frontend design and UX standards are maintained in:

- [Design System](DESIGN.md) — visual direction, tokens, layout, components, and accessibility target.
- [Frontend UI/UX Guidelines](docs/FRONTEND_UI_UX_GUIDELINES.md) — operational workflows and interaction behavior.
- [Design Decisions](docs/DESIGN_DECISIONS.md) — rationale and status of proposed design decisions.
- [UI/UX Validation Checklist](docs/UI_UX_VALIDATION_CHECKLIST.md) — validation steps for visual, responsive, accessibility, and workflow testing.

These documents are drafts pending review. WCAG 2.2 Level AA is a design and validation target, not a claim that the current application conforms.

## Security and demo notes

- Never commit passwords, JWT secrets, API keys, or real user credentials.
- Use synthetic or anonymized data in screenshots and demonstrations.
- Frontend route protection is not a security boundary; backend authorization remains authoritative.
- Do not treat a network failure during an inventory transaction as proof that the transaction was not committed.
- Keep demo accounts and demo databases isolated from production data.

## Maintainer

**Zirocraft Studio** · [@Youuzzi](https://github.com/Youuzzi)
