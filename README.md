# Subscription Management System - Milestone 1

Milestone 1 delivers the foundational authentication, database connectivity, and security architecture for the Subscription Management System.

---

## 1. Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons
- **Backend:** FastAPI (Python 3.13)
- **Database:** PostgreSQL (with `subscription_management` database)
- **ORM:** SQLAlchemy 2.0
- **Authentication:** JWT (JSON Web Tokens via PyJWT)
- **Password Hashing:** Argon2 (`argon2-cffi`)
- **API Communication:** Axios with request & response interceptors
- **Routing:** React Router v6

---

## 2. Milestone 1 Scope & Features

- **User Registration (`/register`):**
  - Name, Email, Role Selection (`customer` or `staff`), Password, Confirm Password
  - Interactive role selector allowing new signups to register as either **Customer** or **Staff**.
  - Strict validation:
    - Name is required.
    - Email must be valid format and unique in PostgreSQL.
    - Password must contain > 8 characters (at least 9).
    - Password must contain at least 1 uppercase letter (`A-Z`).
    - Password must contain at least 1 lowercase letter (`a-z`).
    - Password must contain at least 1 special character (`!@#$%^&*`, etc.).
    - Confirm password must match password.
  - Argon2 cryptographic password hashing (never stored plain-text).
  - Minimal white interface with olive-green accents and black primary buttons.

- **Predefined Administrator Account:**
  - The Admin does not need to register. An administrator account is automatically seeded into PostgreSQL on startup:
    - **Email:** `admin@subscription.com`
    - **Password:** `AdminPassword123!`
    - **Role:** `admin`

- **User Login (`/login`):**
  - Email and Password credentials authentication against PostgreSQL.
  - Quick auto-fill button for the predefined Admin credentials.
  - Generates signed JWT access token.
  - Securely stores token and user session in client storage.
  - Redirects authenticated users to `/blank`.
- **Protected Blank Page (`/blank`):**
  - Protected route requiring valid JWT token validated via `/api/auth/me`.
  - Unauthenticated, expired, or invalid tokens are blocked and redirected to `/login`.
  - Completely blank white page (no dashboard, text, buttons, or navigation).

---

## 3. Database Schema

- **Database Name:** `subscription_management`
- **Table:** `users`

| Column | Type | Constraints / Defaults |
|---|---|---|
| `id` | `SERIAL PRIMARY KEY` | Primary Key, Auto-increment |
| `name` | `VARCHAR(100)` | Not Null |
| `email` | `VARCHAR(255)` | Unique, Not Null, Indexed |
| `password` | `TEXT` | Argon2 hashed string (`$argon2id$...`) |
| `role` | `VARCHAR(20)` | Not Null, Default: `'customer'` |
| `created_at` | `TIMESTAMP` | Not Null, Default: UTC timestamp |

---

## 4. Project Structure

```text
subscription_ms/
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   └── auth.py        # /register, /login, /me endpoints
│   │   ├── __init__.py
│   │   ├── config.py          # Environment settings via Pydantic
│   │   ├── database.py        # SQLAlchemy engine & session factory
│   │   ├── main.py            # FastAPI app initialization & CORS
│   │   ├── models.py          # PostgreSQL SQLAlchemy User model
│   │   ├── schemas.py         # Pydantic request/response validation
│   │   └── security.py        # Argon2 hashing & JWT verification
│   ├── tests/
│   │   └── test_auth.py       # Automated integration test suite
│   ├── requirements.txt
│   ├── .env.example
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx  # Route protection via backend JWT check
│   │   ├── pages/
│   │   │   ├── Blank.jsx           # Clean blank protected page
│   │   │   ├── Login.jsx           # Professional SaaS login interface
│   │   │   └── Register.jsx        # Professional registration interface
│   │   ├── api.js                  # Axios client with JWT interceptor
│   │   ├── App.jsx                 # React Router definition
│   │   ├── index.css               # Tailwind CSS styles
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── .env.example
│   └── .env
├── .gitignore
└── README.md
```

---

## 5. Getting Started & Execution

### Prerequisites

- Python 3.10+
- Node.js 18+ and npm
- PostgreSQL 14+ running locally

### 1. Backend Setup

1. Open a terminal and navigate to `backend/`:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # Windows PowerShell
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # Linux/macOS
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   Copy `.env.example` to `.env` and verify database credentials:
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/subscription_management
   JWT_SECRET_KEY=your_secure_random_jwt_secret_key_here
   JWT_ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=60
   FRONTEND_URL=http://localhost:5173
   ```

5. Start the FastAPI backend server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   The backend API will be available at `http://localhost:8000`.  
   Interactive API docs (Swagger UI) are available at `http://localhost:8000/docs`.

---

### 2. Frontend Setup

1. Open a new terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   The frontend application will be available at `http://localhost:5173`.

---

## 6. Running Tests

Run the comprehensive automated test suite (15 integration tests verifying all 10 Milestone criteria):

```bash
# In backend/ with virtualenv activated
pytest tests/ -v
```

The test suite validates:
1. PostgreSQL connection & table initialization
2. User registration and database record persistence
3. Argon2 password hashing (`$argon2id$...` prefix, never plain-text)
4. Duplicate email rejection (HTTP 400)
5. Strict password complexity rules (length > 8, uppercase, lowercase, special characters)
6. Password & confirm password mismatch checks
7. Successful login generating a signed JWT token
8. Invalid credentials rejection (HTTP 401)
9. Protected `/api/auth/me` with valid JWT
10. Rejection of missing, invalid, or expired tokens (HTTP 401)

