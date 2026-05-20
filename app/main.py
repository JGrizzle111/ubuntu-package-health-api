from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import health, packages, system

app = FastAPI(
    title="Ubuntu Package Health API",
    description="API for inspecting Ubuntu package status, dependencies, and upgrades",
    version="0.1.0",
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(packages.router)
app.include_router(system.router)