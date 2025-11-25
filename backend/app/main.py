# app/main.py
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from app.database import engine, Base
import app.models  # ensures models are registered

# Routers
from app.routers.project_routes import router as project_router
from app.routers.auth_routes import router as auth_router

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Document Authoring API",
    version="1.0.0",
    description="API for generating, refining and exporting AI-assisted documents."
)

# --------- IMPORTANT: FIX CORS FOR FRONTEND ---------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",

        # ⭐ Your Vercel frontend domain
        "https://ai-doc-authoring-43yf9eego-sahejpreets-projects.vercel.app",

        # ⭐ Custom domain if you added one in Vercel
        "https://ai-doc-authoring.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------- OPENAPI (JWT support) ---------
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )

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

# --------- ROUTES ---------
@app.get("/")
def root():
    return {"status": "backend running", "service": "AI Doc Authoring"}

app.include_router(auth_router)
app.include_router(project_router)

