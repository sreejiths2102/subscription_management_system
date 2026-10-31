# Brightloop Software — Subscription Management System

A production-ready Enterprise Subscription Management System built with **FastAPI**, **React 18 (Vite)**, **PostgreSQL (SQLAlchemy 2.0)**, **Argon2**, and **Tailwind CSS**. Designed with an elegant, minimal SaaS aesthetic featuring white backgrounds, muted olive green accents, light sage badges, and crisp black buttons.

---

## 1. System Overview & User Roles

The system supports three distinct user roles with strict Role-Based Access Control (RBAC):

```
                                  ┌─────────────────────────────┐
                                  │   Authentication Gateway    │
                                  │   (/login, /register,       │
                                  │    /forgot-password)        │
                                  └──────────────┬──────────────┘
                                                 │
                     ┌───────────────────────────┼───────────────────────────┐
                     ▼                           ▼                           ▼
        ┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────┐
        │      ADMIN PORTAL       │ │      STAFF PORTAL       │ │     CUSTOMER PORTAL     │
        │        (/admin)         │ │        (/staff)         │ │       (/customer)       │
        │  • 13 Management Modules│ │  • Customer Management  │ │  • Personal Dashboard   │
        │  • Full Platform CRUD   │ │  • Quotations & Orders  │ │  • Active Subscriptions │
        │  • Financial Analytics  │ │  • Invoicing & Billing  │ │  • Invoices & Receipts  │
        │  • Global Settings      │ │  • View-only Products   │ │  • Account Settings     │
        └─────────────────────────┘ └─────────────────────────┘ └─────────────────────────┘
```

| Role | Predefined Credentials / Registration | Portal Route | Primary Capabilities |
|---|---|---|---|
| **Admin** | `admin@subscription.com` / `AdminPassword123!` (Pre-seeded) | `/admin` | Complete control over platform, users, products, plans, taxes, discounts, financial analytics, and system settings. |
| **Staff** | Registered via `/register` or created by Admin | `/staff` | Operational management of customers, quotations, subscriptions, invoices, and payments (products/plans read-only). |
| **Customer** | Registered via `/register` | `/customer` | Self-serve dashboard, active subscriptions, invoice payment status, transaction history, and profile management. |

---

## 2. Technology Stack

- **Frontend:**
  - React 18 with Vite
  - Tailwind CSS (Minimal SaaS design tokens)
  - Lucide React Icons
  - React Router v6
  - Axios with JWT Interceptors
- **Backend:**
  - FastAPI (Python 3.13)
  - SQLAlchemy 2.0 (PostgreSQL ORM)
  - Psycopg2 / Psycopg driver with automatic `@` character URI sanitizer
  - Argon2 password hashing (`argon2-cffi`)
  - PyJWT for stateless bearer token verification
- **Database:**
  - PostgreSQL 14+ (`subscription_db` / `subscription_management`)
  - Auto-seeding for predefined Administrator account on startup

---

## 3. Global Design System (Tokens & Theme)

All pages adhere to the uniform SaaS visual design guidelines:

| Element | Token / Value | Usage |
|---|---|---|
| **Primary Background** | `#FFFFFF` | Page canvas, modals, form inputs, and white card containers |
| **Primary Buttons & Text** | `#000000` | Primary action buttons, dark headings, high-contrast typography |
| **Accent Green** | `#788A5B` | Active state indicators, icons, subtle focus rings, success badges |
| **Light Sage** | `#F2F4ED` | Badge fills, card highlights, table header backgrounds, active navigation |
| **Border Gray** | `#E8E8E8` | Thin 1px borders, separators, input field boundaries |
| **Typography** | Inter / System Sans | Clean, legible sans-serif hierarchy with generous whitespace |
| **Radius** | `12px` to `16px` (`rounded-xl` / `rounded-2xl`) | Cards, inputs, buttons, and dialog containers |

---

## 4. Key Functional Modules

### A. Authentication & Password Recovery
- **User Registration (`/register`)**: Role selection (`customer` or `staff`), real-time password criteria validation (>8 characters, uppercase, lowercase, special character), Argon2 hashing.
- **User Sign-In (`/login`)**: Role-based redirection (`admin` $\rightarrow$ `/admin`, `staff` $\rightarrow$ `/staff`, `customer` $\rightarrow$ `/customer`), quick demo credential buttons.
- **Forgot Password (`/forgot-password`)**: Validates registered email, generates a signed 30-minute JWT reset token, and dispatches the reset link.
- **Reset Password (`/reset-password`)**: Token verification, password complexity checking, and Argon2 password update.

### B. Admin Dashboard & Panel (`/admin`)
- **6 KPI Summary Cards**: Total Customers, Active Subscriptions, MRR ($42,850), Total Revenue Collected ($384,120), Outstanding Payments, Overdue Invoices.
- **Visual Analytics**: Scalable SVG Monthly Recurring Revenue (MRR) trajectory line chart, Subscription status doughnut chart (Active, Paused, Closed, Draft), and Payment breakdown.
- **Recent Activity Tables**: Recent Subscriptions ledger and Recent Payments transaction feed.
- **Alerts & Reminders**: Real-time notifications for upcoming renewals and overdue accounts.

### C. Management Modules Suite (`frontend/src/components/modules/`)
1. **User Management (`UserManagementPanel.jsx`)**: Filter users by role (`Admin`, `Staff`, `Customer`) and status (`Active`, `Inactive`); details dialog, edit user, deactivation, and Staff invitation for Admin.
2. **Customer Management (`CustomerManagementPanel.jsx`)**: Accounts directory, billing emails, active tiers, and contact profiles.
3. **Product Management (`ProductManagementPanel.jsx`)**: Product catalog, sales/cost price tracking, product variant dialogs (Admin full CRUD; Staff view-only).
4. **Subscription Plans (`PlanManagementPanel.jsx`)**: Billing intervals (Monthly, Quarterly, Annual), pricing rules, and plan availability toggles.
5. **Quotation Management (`QuotationManagementPanel.jsx`)**: Quotation creation, status tracking, convert-to-subscription actions, and quotation templates.
6. **Subscription Management (`SubscriptionManagementPanel.jsx`)**: Full subscription lifecycle controls (Active, Paused, Renew, Close), billing schedules, and customer view isolation.
7. **Invoice Management (`InvoiceManagementPanel.jsx`)**: Invoice generator, PDF preview/download, status lifecycle (`Draft`, `Confirmed`, `Paid`, `Overdue`, `Cancelled`), and email dispatch.
8. **Tax Management (`TaxManagementPanel.jsx`)**: Regional sales tax and VAT rate configurations, compound tax calculations, and status toggles.
9. **Discount Management (`DiscountManagementPanel.jsx`)**: Percentage and fixed-rate promotional codes, minimum spend thresholds, usage counters, and validity periods.
10. **Payment Management (`PaymentManagementPanel.jsx`)**: Cleared payment ledger, transaction references, Record Payment modal (Admin/Staff), and Accounts Receivable / Overdue Invoices tracking.
11. **Reports & Analytics (`ReportsPanel.jsx`)**: Category reports (Revenue, Subscription, Payment, Outstanding, Overdue), SVG trend charts, date range filtering, and CSV/PDF export triggers.
12. **Settings (`SettingsPanel.jsx`)**: Profile details, change password, notification switches, and Enterprise Business Settings (Legal entity name, currency, payment terms, and invoice prefix sequencing).

---

## 5. Project Directory Structure

```text
subscription_ms/
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   └── auth.py             # Auth endpoints (/register, /login, /me, /forgot-password, /reset-password)
│   │   ├── __init__.py
│   │   ├── config.py               # Pydantic environment configurations
│   │   ├── database.py             # SQLAlchemy session factory & URI password sanitizer
│   │   ├── main.py                 # FastAPI application, CORS & admin seeding
│   │   ├── models.py               # PostgreSQL SQLAlchemy User model
│   │   ├── schemas.py              # Pydantic request/response schemas
│   │   └── security.py             # Argon2 password hashing & JWT token services
│   ├── tests/
│   │   └── test_auth.py            # Automated test suite (Pytest + TestClient)
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   └── AdminPanel.jsx
│   │   │   ├── customer/
│   │   │   │   ├── CustomerDashboard.jsx
│   │   │   │   └── CustomerPanel.jsx
│   │   │   ├── staff/
│   │   │   │   ├── StaffDashboard.jsx
│   │   │   │   └── StaffPanel.jsx
│   │   │   ├── modules/            # 12 Core business modules
│   │   │   │   ├── CardLayout.jsx
│   │   │   │   ├── CustomerManagementPanel.jsx
│   │   │   │   ├── DiscountManagementPanel.jsx
│   │   │   │   ├── InvoiceManagementPanel.jsx
│   │   │   │   ├── PaymentManagementPanel.jsx
│   │   │   │   ├── PlanManagementPanel.jsx
│   │   │   │   ├── ProductManagementPanel.jsx
│   │   │   │   ├── QuotationManagementPanel.jsx
│   │   │   │   ├── ReportsPanel.jsx
│   │   │   │   ├── SettingsPanel.jsx
│   │   │   │   ├── SubscriptionManagementPanel.jsx
│   │   │   │   ├── TaxManagementPanel.jsx
│   │   │   │   └── UserManagementPanel.jsx
│   │   │   └── ProtectedRoute.jsx  # Client-side JWT auth route wrapper
│   │   ├── pages/
│   │   │   ├── Blank.jsx
│   │   │   ├── ForgotPassword.jsx  # Password reset link request
│   │   │   ├── Login.jsx           # Role-based sign in
│   │   │   ├── Register.jsx        # Registration with role selection
│   │   │   └── ResetPassword.jsx   # New password submission with token
│   │   ├── api.js                  # Axios instance with request/response interceptors
│   │   ├── App.jsx                 # Client-side router definition
│   │   ├── index.css               # Tailwind CSS directives
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## 6. Installation & Setup Guide

### Prerequisites
- **Python 3.10+** (tested on Python 3.13)
- **Node.js 18+** & **npm**
- **PostgreSQL 14+**

### 1. Backend Configuration

1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # Windows PowerShell:
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # macOS / Linux:
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Verify your `backend/.env` file:
   ```env
   # Database Configuration (supports '@' in password via automatic URL sanitizing)
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/subscription_db

   # JWT Settings
   JWT_SECRET_KEY=e839f280a96f131154c15354508492023d8c47b59e38e8aa4b3f81e3a24128f0
   JWT_ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=60

   # Frontend Origin
   FRONTEND_URL=http://localhost:5173

   # Predefined Admin Credentials
   ADMIN_EMAIL=admin@subscription.com
   ADMIN_PASSWORD=AdminPassword123!
   ADMIN_NAME=System Administrator
   ```

5. Launch the FastAPI server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   - API Server: `http://localhost:8000`
   - Interactive OpenAPI Documentation: `http://localhost:8000/docs`

---

### 2. Frontend Configuration

1. In a separate terminal, navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure `frontend/.env` is configured:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   - Application URL: `http://localhost:5173`

---

## 7. Automated Testing & Verification

### Running Backend Tests
Execute the automated test suite covering authentication, Argon2 hashing, validation rules, JWT verification, and password reset workflows:

```bash
# In backend/ with active virtualenv:
$env:PYTHONPATH="backend"
pytest tests/ -v
```

### Running Frontend Production Build
Verify zero bundle errors, proper JSX syntax, and asset generation:

```bash
cd frontend
npm run build
```

---

## 8. License & Standards

- **Security Standard:** Argon2id password hashing, HTTP Bearer JWT tokens, automatic URI sanitization for database credentials.
- **Design Standard:** Minimal SaaS White & Olive Green design system.
