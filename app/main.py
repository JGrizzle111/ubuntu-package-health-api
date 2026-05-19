from fastapi import FastAPI

from app.routes import health, packages, system

app = FastAPI(
    title="Ubuntu Package Health API",
    description="API for inspecting Ubuntu package status, dependencies, and upgrades",
    version="0.1.0",
)

app.include_router(health.router)
app.include_router(packages.router)
app.include_router(system.router)