from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models import User
from app.security import hash_password
from app.routes import auth


def seed_admin_user():
    """Seeds the predefined administrator account if it does not already exist."""
    with SessionLocal() as db:
        admin_email = settings.ADMIN_EMAIL.strip().lower()
        existing_admin = db.query(User).filter(User.email == admin_email).first()
        if not existing_admin:
            admin_user = User(
                name=settings.ADMIN_NAME,
                email=admin_email,
                password=hash_password(settings.ADMIN_PASSWORD),
                role="admin"
            )
            db.add(admin_user)
            db.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure all tables are created in PostgreSQL on application startup
    Base.metadata.create_all(bind=engine)
    seed_admin_user()
    yield


app = FastAPI(
    title="Subscription Management System API",
    version="1.0.0",
    description="Milestone 1 - Authentication & User Management Service",
    lifespan=lifespan
)

# CORS configuration
origins = [
    settings.FRONTEND_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route modules
app.include_router(auth.router)


@app.get("/", tags=["Health Check"])
def health_check():
    """
    Backend service health check endpoint.
    """
    return {
        "status": "healthy",
        "service": "Subscription Management System API",
        "milestone": "1.0.0"
    }

