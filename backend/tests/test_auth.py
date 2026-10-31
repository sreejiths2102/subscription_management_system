import pytest
from datetime import timedelta
from fastapi.testclient import TestClient
from sqlalchemy import text
from app.main import app
from app.database import engine, SessionLocal, Base
from app.models import User
from app.security import create_access_token

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    # Clean up test users
    with SessionLocal() as db:
        db.query(User).filter(User.email.like("%test%@example.com")).delete(synchronize_session=False)
        db.commit()


def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "Subscription Management System" in data["service"]


def test_registration_success_and_db_record():
    payload = {
        "name": "Alex Johnson",
        "email": "alex.test@example.com",
        "password": "Password123!",
        "confirm_password": "Password123!"
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "alex.test@example.com"
    assert data["name"] == "Alex Johnson"
    assert data["role"] == "customer"
    assert "id" in data
    assert "created_at" in data
    assert "password" not in data

    # Verify directly in PostgreSQL
    with SessionLocal() as db:
        user = db.query(User).filter(User.email == "alex.test@example.com").first()
        assert user is not None
        assert user.name == "Alex Johnson"
        assert user.role == "customer"
        # Password must be hashed with Argon2 ($argon2id$...)
        assert user.password != "Password123!"
        assert user.password.startswith("$argon2id$")


def test_registration_with_staff_role():
    payload = {
        "name": "Sarah Staff",
        "email": "sarah.test@example.com",
        "password": "Password123!",
        "confirm_password": "Password123!",
        "role": "staff"
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["role"] == "staff"

    with SessionLocal() as db:
        user = db.query(User).filter(User.email == "sarah.test@example.com").first()
        assert user is not None
        assert user.role == "staff"


def test_admin_predefined_login():
    response = client.post("/api/auth/login", json={
        "email": "admin@subscription.com",
        "password": "AdminPassword123!"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["role"] == "admin"
    assert data["user"]["email"] == "admin@subscription.com"
    assert "access_token" in data


def test_registration_duplicate_email():
    payload = {
        "name": "Duplicate User",
        "email": "alex.test@example.com",
        "password": "Password123!",
        "confirm_password": "Password123!"
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"].lower()


@pytest.mark.parametrize("invalid_pwd, expected_err", [
    ("Pass1!", "more than 8 characters"),
    ("password123!", "uppercase letter"),
    ("PASSWORD123!", "lowercase letter"),
    ("Password123", "special character"),
])
def test_registration_password_complexity(invalid_pwd, expected_err):
    payload = {
        "name": "Complexity Tester",
        "email": f"tester_{invalid_pwd[:4]}@example.com",
        "password": invalid_pwd,
        "confirm_password": invalid_pwd
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 422
    assert expected_err.lower() in str(response.json()).lower()


def test_registration_confirm_password_mismatch():
    payload = {
        "name": "Mismatch Tester",
        "email": "mismatch.test@example.com",
        "password": "Password123!",
        "confirm_password": "Password999!"
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 422
    assert "match" in str(response.json()).lower()


def test_login_success():
    payload = {
        "email": "alex.test@example.com",
        "password": "Password123!"
    }
    response = client.post("/api/auth/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "alex.test@example.com"
    assert data["user"]["role"] == "customer"


def test_login_invalid_password():
    payload = {
        "email": "alex.test@example.com",
        "password": "WrongPassword123!"
    }
    response = client.post("/api/auth/login", json=payload)
    assert response.status_code == 401
    assert "invalid email or password" in response.json()["detail"].lower()


def test_login_nonexistent_email():
    payload = {
        "email": "nonexistent.test@example.com",
        "password": "Password123!"
    }
    response = client.post("/api/auth/login", json=payload)
    assert response.status_code == 401
    assert "invalid email or password" in response.json()["detail"].lower()


def test_auth_me_valid_jwt():
    # Login first
    login_res = client.post("/api/auth/login", json={
        "email": "alex.test@example.com",
        "password": "Password123!"
    })
    token = login_res.json()["access_token"]

    # Call /api/auth/me
    response = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    user_info = response.json()
    assert user_info["email"] == "alex.test@example.com"
    assert user_info["name"] == "Alex Johnson"
    assert user_info["role"] == "customer"


def test_auth_me_missing_token():
    response = client.get("/api/auth/me")
    assert response.status_code == 401


def test_auth_me_invalid_token():
    response = client.get("/api/auth/me", headers={"Authorization": "Bearer invalid.fake.token"})
    assert response.status_code == 401


def test_auth_me_expired_token():
    expired_token = create_access_token(
        data={"sub": "alex.test@example.com"},
        expires_delta=timedelta(seconds=-10)
    )
    response = client.get("/api/auth/me", headers={"Authorization": f"Bearer {expired_token}"})
    assert response.status_code == 401
    assert "expired" in response.json()["detail"].lower()

