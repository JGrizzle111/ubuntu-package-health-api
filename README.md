# Ubuntu Package Health API

A FastAPI-based API for inspecting Ubuntu package metadata, installed versions, candidate versions, dependencies, and upgrade availability.

This project is designed as a Linux/Python portfolio project, especially for roles involving Ubuntu, backend development, systems programming, DevOps, or open-source engineering.

## Overview

The Ubuntu Package Health API wraps common Ubuntu package-management commands in a clean REST API.

It can check:

- Whether a package is installed
- The installed version of a package
- The candidate version available from APT
- Whether a package is upgradable
- A package's dependencies
- System-wide upgradable packages

The API is built with Python and FastAPI and is designed to run inside an Ubuntu-based container, even if the developer is using another Linux distribution such as Fedora.

## Why This Project Exists

Ubuntu package tools such as `apt`, `apt-cache`, and `dpkg` are useful from the command line, but they are not exposed as a structured API by default.

This project provides a simple API layer over those tools so package information can be accessed programmatically.

Example use cases:

- Developer tooling
- System health dashboards
- Package audit reports
- Ubuntu server monitoring
- DevOps automation
- Learning Linux package management

## Tech Stack

- Python
- FastAPI
- Pydantic
- pytest
- Docker or Podman
- Ubuntu
- APT package tools

## Features

- Health check endpoint
- Package metadata endpoint
- Package dependency endpoint
- System upgradable packages endpoint
- Input validation for package names
- Unit tests with pytest
- Mocked command-output tests
- Docker/Podman container support
- Automatic Swagger/OpenAPI documentation

## Project Structure

```txt
ubuntu-package-health-api/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── health.py
│   │   ├── packages.py
│   │   └── system.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── package_schema.py
│   └── services/
│       ├── __init__.py
│       ├── apt_service.py
│       └── validation.py
├── tests/
│   ├── test_apt_service.py
│   └── test_validation.py
├── Dockerfile
├── pytest.ini
├── requirements.txt
├── README.md
└── .gitignore
```

## API Endpoints

### Health Check

```txt
GET /health
```

Example response:

```json
{
  "status": "ok",
  "service": "ubuntu-package-health-api"
}
```

### Get Package Info

```txt
GET /packages/{package_name}
```

Example:

```txt
GET /packages/nginx
```

Example response:

```json
{
  "name": "nginx",
  "installed_version": "1.24.0-2ubuntu7",
  "candidate_version": "1.24.0-2ubuntu7.1",
  "is_installed": true,
  "is_upgradable": true
}
```

### Get Package Dependencies

```txt
GET /packages/{package_name}/dependencies
```

Example:

```txt
GET /packages/nginx/dependencies
```

Example response:

```json
{
  "name": "nginx",
  "dependencies": [
    "nginx-common",
    "nginx-core"
  ]
}
```

### Get Upgradable Packages

```txt
GET /system/upgradable
```

Example response:

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

## Running Locally

Create and activate a virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the development server:

```bash
fastapi dev app/main.py
```

Open the API docs:

```txt
http://127.0.0.1:8000/docs
```

## Important Note About Fedora, Arch, and Other Linux Distros

This project is designed around Ubuntu package tools.

If you run the app directly on Fedora, Arch, or another non-Ubuntu distribution, commands like these may not work:

```bash
apt-cache policy nginx
apt-cache depends nginx
apt list --upgradable
```

For accurate Ubuntu package behavior, run the app inside the provided Ubuntu container.

## Running with Podman

Build the image:

```bash
podman build --no-cache -t ubuntu-package-health-api .
```

Run the container:

```bash
podman run --rm -p 8000:8000 ubuntu-package-health-api
```

Open:

```txt
http://127.0.0.1:8000/docs
```

## Running with Docker

Build the image:

```bash
docker build --no-cache -t ubuntu-package-health-api .
```

Run the container:

```bash
docker run --rm -p 8000:8000 ubuntu-package-health-api
```

Open:

```txt
http://127.0.0.1:8000/docs
```

## Example Dockerfile

```dockerfile
FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    apt-utils \
    nginx \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["fastapi", "run", "app/main.py", "--host", "0.0.0.0", "--port", "8000"]
```

## Running Tests

Run:

```bash
python -m pytest
```

Expected output:

```txt
3 passed
```

## Testing Strategy

The project uses pytest to test important logic without relying on the actual system state.

For example, package policy parsing is tested by mocking command output instead of requiring a real installed package.

Example test idea:

```python
def test_get_package_policy_parses_versions(monkeypatch):
    fake_output = """
nginx:
  Installed: 1.24.0-2ubuntu7
  Candidate: 1.24.0-2ubuntu7.1
  Version table:
     1.24.0-2ubuntu7.1 500
"""

    def fake_run_command(command):
        return fake_output

    monkeypatch.setattr(
        "app.services.apt_service.run_command",
        fake_run_command
    )

    result = get_package_policy("nginx")

    assert result["name"] == "nginx"
    assert result["installed_version"] == "1.24.0-2ubuntu7"
    assert result["candidate_version"] == "1.24.0-2ubuntu7.1"
    assert result["is_installed"] is True
    assert result["is_upgradable"] is True
```

## Security Notes

This project runs system commands from Python, so it avoids unsafe shell execution.

Instead of using:

```python
subprocess.run("apt-cache policy nginx", shell=True)
```

It uses list-based commands:

```python
subprocess.run(["apt-cache", "policy", package_name])
```

The API also validates package names before passing them to system commands.

## Example Package Name Validation

Valid package names:

```txt
nginx
python3
libssl3
g++
curl
```

Invalid package names:

```txt
nginx && whoami
../secret
;rm -rf /
```

## Future Improvements

Planned improvements:

- Add reverse dependency lookup
- Add changelog lookup
- Add package search endpoint
- Add security update detection
- Add JSON system scan reports
- Add a CLI client
- Add GitHub Actions CI
- Add rate limiting
- Add structured logging
- Add support for Debian-based distributions beyond Ubuntu

## Possible Future Endpoints

```txt
GET /packages/{package_name}/reverse-dependencies
GET /packages/{package_name}/changelog
GET /packages/search?q=nginx
GET /system/report
GET /system/security-updates
```

## Resume Bullet

Built a Python/FastAPI Ubuntu Package Health API that inspects APT package metadata, installed versions, candidate versions, dependencies, and upgrade availability. Added package-name validation, pytest unit tests, mocked command-output testing, Dockerized Ubuntu runtime, and automatic OpenAPI documentation.

## What I Learned

This project demonstrates:

- Building REST APIs with FastAPI
- Running Linux system commands from Python
- Safely using `subprocess`
- Parsing command-line output
- Working with Ubuntu package tools
- Writing unit tests with pytest
- Mocking system command output
- Running Ubuntu tooling inside containers
- Debugging host OS versus container OS differences
- Creating portfolio-ready backend documentation

## License

This project is intended for learning and portfolio use.