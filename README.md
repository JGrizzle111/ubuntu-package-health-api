# Ubuntu Package Health Monorepo

A full-stack monorepo for checking Ubuntu package health:

- Backend API: FastAPI service that wraps apt and apt-cache commands
- Frontend dashboard: React + TypeScript app for package lookup and upgrade visibility

This repository is useful for Linux tooling, backend systems work, Dand DevOps demos.

## Monorepo Layout

```txt
ubuntu-package-health-api/
├── app/                          # FastAPI backend
│   ├── main.py
│   ├── routes/
│   ├── schemas/
│   └── services/
├── tests/                        # Backend tests
├── dashboard/                    # React + Vite frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── Dockerfile                    # Backend container image
├── requirements.txt
└── README.md
```

## What It Does

The backend exposes Ubuntu package data through REST endpoints:

- Check package install status
- Compare installed vs candidate versions
- Detect whether a package is upgradable
- List package dependencies
- List all upgradable packages on the system

The dashboard consumes those endpoints and provides a UI to:

- Search package details
- View package dependency results
- View current system upgrade candidates

## Prerequisites

- Linux machine (Ubuntu recommended for native apt behavior)
- Python 3.10+
- Node.js 20+ and npm
- Optional: Docker or Podman for running backend in Ubuntu container

## Quick Start (Run Full Stack Locally)

From the repository root:

1. Start the backend

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
fastapi dev app/main.py
```

Backend URLs:

- API: http://127.0.0.1:8000
- OpenAPI docs: http://127.0.0.1:8000/docs

2. Start the dashboard in a second terminal

```bash
cd dashboard
npm install
npm run dev
```

Dashboard URL:

- UI: http://127.0.0.1:5173

The frontend currently calls the backend at http://127.0.0.1:8000.

## Backend Usage

### Endpoints

- GET /health
- GET /packages/{package_name}
- GET /packages/{package_name}/dependencies
- GET /system/upgradable

### Curl Examples

```bash
curl http://127.0.0.1:8000/health
```

```bash
curl http://127.0.0.1:8000/packages/nginx
```

```bash
curl http://127.0.0.1:8000/packages/nginx/dependencies
```

```bash
curl http://127.0.0.1:8000/system/upgradable
```

### Example Responses

```json
{
  "name": "nginx",
  "installed_version": "1.24.0-2ubuntu7",
  "candidate_version": "1.24.0-2ubuntu7.1",
  "is_installed": true,
  "is_upgradable": true
}
```

```json
{
  "packages": [
    {
      "name": "curl",
      "current_version": "8.5.0-2ubuntu10.6",
      "new_version": "8.5.0-2ubuntu10.7",
      "architecture": "amd64"
    }
  ]
}
```

## Frontend Usage

From the dashboard folder:

```bash
cd dashboard
npm install
npm run dev
```

Other frontend scripts:

```bash
npm run build
npm run preview
npm run lint
```

## Running Tests

From the repo root:

```bash
source .venv/bin/activate
python -m pytest
```

## Containerized Backend (Recommended on Non-Ubuntu Hosts)

If your host OS is Fedora, Arch, or another distro where apt tools differ, use the container.

### Docker

```bash
docker build -t ubuntu-package-health-api .
docker run --rm -p 8000:8000 ubuntu-package-health-api
```

### Podman

```bash
podman build -t ubuntu-package-health-api .
podman run --rm -p 8000:8000 ubuntu-package-health-api
```

Then run the dashboard normally from dashboard/ and point it at http://127.0.0.1:8000.

## Example Use Cases

### 1. Pre-upgrade server check

Goal: quickly inspect pending package updates before a maintenance window.

Steps:

1. Start API and dashboard.
2. Open the dashboard and load upgradable packages.
3. Review current_version vs new_version to estimate update impact.
4. Export or copy results into your maintenance checklist.

### 2. Dependency triage for a broken package

Goal: inspect dependencies when a package install or runtime fails.

Steps:

1. Query GET /packages/{name} to verify install and candidate versions.
2. Query GET /packages/{name}/dependencies to inspect required packages.
3. Validate missing or outdated dependencies on target hosts.

### 3. Developer environment consistency check

Goal: compare package versions across dev machines.

Steps:

1. Run the API on each machine.
2. Query common packages (for example: git, curl, openssl, python3).
3. Compare responses to detect drift.

### 4. Dashboard-backed operations view

Goal: provide teammates a simple UI over apt status without shell access.

Steps:

1. Deploy API on a controlled Ubuntu host.
2. Serve dashboard internally.
3. Let users inspect package state via browser rather than CLI.

## Configuration Notes

- CORS currently allows http://localhost:5173 and http://127.0.0.1:5173.
- Frontend API base URL is set in dashboard/src/api/packageHealthApi.ts.
- If backend host/port changes, update that file to match your environment.

## Security Notes

- Backend command execution uses subprocess with argument lists, not shell=True.
- Package input is validated before being passed to apt tools.
- Keep this service internal unless you add auth, rate limiting, and network controls.

## Troubleshooting

- apt-cache or apt list command errors on non-Ubuntu host: run backend in Docker/Podman.
- Dashboard cannot reach API: confirm backend is running on port 8000 and CORS origin matches 5173.
- Import or dependency errors in frontend: run npm install inside dashboard/.
- Python module errors: activate .venv and reinstall requirements.txt.

## License

This project is intended for learning and portfolio use.