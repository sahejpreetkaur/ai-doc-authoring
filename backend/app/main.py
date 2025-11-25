# app/main.py
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv()
from fastapi.middleware.cors import CORSMiddleware


from app.database import engine, Base
import app.models  # ensures models are registered

# Routers
from app.routers.project_routes import router as project_router
from app.routers.auth_routes import router as auth_router

# Create DB tables (safe to call repeatedly)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Document Authoring API",
    version="1.0.0",
    description="API for generating, refining and exporting AI-assisted documents."
)

# Allow frontend dev server to call the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )

    # simple http bearer for protected endpoints
    openapi_schema["components"]["securitySchemes"] = {
        "HTTPBearer": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

# include routers
app.include_router(auth_router)      # /auth/*
app.include_router(project_router)   # /projects/*

@app.get("/")
def root():
    return {"status": "ok"}
