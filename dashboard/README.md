# Ubuntu Package Health Dashboard

Frontend app for the Ubuntu Package Health monorepo.

This dashboard is built with React, TypeScript, and Vite, and it consumes the FastAPI backend endpoints to display:

- API health status
- Package install and upgrade information
- Package dependencies
- System-wide upgradable packages

## Location In Monorepo

This project lives in [dashboard](dashboard) under the repository root.

For full-stack instructions, see the root guide at [README.md](../README.md).

## Prerequisites

- Node.js 20+
- npm
- Backend API running on http://127.0.0.1:8000

## Local Development

From this folder:

```bash
npm install
npm run dev
```

Default local URL:

- http://127.0.0.1:5173

## Available Scripts

```bash
npm run dev      # Start Vite dev server
npm run build    # Type-check and build production bundle
npm run preview  # Preview built app locally
npm run lint     # Run ESLint
```

## Backend Connection

The frontend calls the backend using a fixed base URL in [src/api/packageHealthApi.ts](src/api/packageHealthApi.ts).

Current value:

- http://127.0.0.1:8000

If your backend runs elsewhere, update the API base URL in [src/api/packageHealthApi.ts](src/api/packageHealthApi.ts).

## Expected Backend Endpoints

- GET /health
- GET /packages/{package_name}
- GET /packages/{package_name}/dependencies
- GET /system/upgradable

## Example Workflow

1. Start backend from repo root with FastAPI.
2. Start this dashboard with npm run dev.
3. Open the dashboard in browser.
4. Search for a package such as nginx.
5. Review install state, candidate version, dependencies, and pending upgrades.

## Troubleshooting

- Blank data or request failures: verify backend is reachable at http://127.0.0.1:8000.
- CORS errors: confirm backend allows origin http://127.0.0.1:5173 or http://localhost:5173.
- Frontend dependency errors: remove node_modules and reinstall with npm install.
- Build issues: run npm run lint and npm run build to surface TypeScript/ESLint details.

## Tech Stack

- React
- TypeScript
- Vite
- ESLint
