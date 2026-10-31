from datetime import datetime, timezone
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models import (
    User, Product, ProductVariant, Plan, Customer,
    Subscription, Invoice, Payment, Quotation, StaffTask,
    TaxRule, Discount, QuotationTemplate
)
from app.security import hash_password
from app.routes import (
    auth, products, plans, dashboard, customers,
    subscriptions, invoices, payments, quotations, users, tasks, reports,
    taxes, discounts
)


def seed_admin_user(db):
    """Seeds predefined users if they do not already exist."""
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

    # Seed staff user if missing
    staff_user = db.query(User).filter(User.email == "staff@subscription.com").first()
    if not staff_user:
        staff = User(
            name="Sarah Jenkins",
            email="staff@subscription.com",
            password=hash_password("StaffPassword123!"),
            role="staff"
        )
        db.add(staff)

    # Seed customer user if missing
    cust_user = db.query(User).filter(User.email == "customer@example.com").first()
    if not cust_user:
        cust = User(
            name="Alex Johnson",
            email="customer@example.com",
            password=hash_password("CustomerPassword123!"),
            role="customer"
        )
        db.add(cust)

    db.commit()


def seed_all_modules(db):
    """Seeds realistic database records across all modules so no UI ever relies on hardcoded data."""
    # 1. Products & Variants
    if db.query(Product).count() == 0:
        p1 = Product(
            code="PRD-001",
            name="Brightloop Core Platform",
            category="Software Suite",
            sales_price=149.00,
            cost_price=28.00,
            description="Central cloud management dashboard and client subscription runtime engine.",
            is_active=True
        )
        p2 = Product(
            code="PRD-002",
            name="Analytics Intelligence Engine",
            category="Add-on Module",
            sales_price=49.00,
            cost_price=12.00,
            description="Real-time cohort retention curves, churn predictors, and visual data models.",
            is_active=True
        )
        p3 = Product(
            code="PRD-003",
            name="Enterprise Dedicated Server Instance",
            category="Infrastructure",
            sales_price=499.00,
            cost_price=180.00,
            description="Isolated high-throughput PostgreSQL + worker instance with guaranteed SLA.",
            is_active=True
        )
        p4 = Product(
            code="PRD-004",
            name="White-Label Branding Suite",
            category="Customization",
            sales_price=99.00,
            cost_price=5.00,
            description="Custom domain mapping, branded emails, logos, and custom colorways.",
            is_active=True
        )
        db.add_all([p1, p2, p3, p4])
        db.flush()

        v1 = ProductVariant(product_id=p1.id, code="VAR-01", name="Standard Single Seat", additional_price=0.00, is_active=True)
        v2 = ProductVariant(product_id=p1.id, code="VAR-02", name="Multi-Seat Team (5 Seats)", additional_price=150.00, is_active=True)
        v3 = ProductVariant(product_id=p1.id, code="VAR-03", name="Unlimited Enterprise Org", additional_price=850.00, is_active=True)
        v4 = ProductVariant(product_id=p2.id, code="VAR-04", name="Standard Reporting Pack", additional_price=0.00, is_active=True)
        v5 = ProductVariant(product_id=p2.id, code="VAR-05", name="Advanced ML Forecasts", additional_price=75.00, is_active=True)
        v6 = ProductVariant(product_id=p3.id, code="VAR-06", name="Standard VM (4 vCPU)", additional_price=0.00, is_active=True)
        v7 = ProductVariant(product_id=p3.id, code="VAR-07", name="High Memory VM (16 vCPU)", additional_price=400.00, is_active=True)
        v8 = ProductVariant(product_id=p4.id, code="VAR-08", name="Custom Domain & CSS Mapping", additional_price=0.00, is_active=True)
        db.add_all([v1, v2, v3, v4, v5, v6, v7, v8])
        db.flush()

        plans_data = [
            Plan(code="PLN-001", name="Starter Cloud Monthly", description="Ideal for startups.", product_id=p1.id, variant_id=v1.id, billing_interval="monthly", price=49.00, min_quantity=1, trial_days=14, is_active=True),
            Plan(code="PLN-002", name="Professional Team Monthly", description="Scaling businesses.", product_id=p1.id, variant_id=v2.id, billing_interval="monthly", price=149.00, min_quantity=1, trial_days=14, is_active=True),
            Plan(code="PLN-003", name="Professional Team Annual", description="Annual commitment.", product_id=p1.id, variant_id=v2.id, billing_interval="yearly", price=1490.00, min_quantity=1, trial_days=14, is_active=True),
            Plan(code="PLN-004", name="Enterprise Dedicated Suite", description="Dedicated infrastructure.", product_id=p3.id, variant_id=v7.id, billing_interval="yearly", price=3600.00, min_quantity=1, trial_days=30, is_active=True),
            Plan(code="PLN-005", name="Analytics Add-on Monthly", description="Predictive analytics.", product_id=p2.id, variant_id=v4.id, billing_interval="monthly", price=49.00, min_quantity=1, trial_days=7, is_active=True)
        ]
        db.add_all(plans_data)
        db.commit()

    # 2. Customers
    if db.query(Customer).count() == 0:
        customers_data = [
            Customer(code="CUST-3041", name="ABC Ltd", contact_person="David Miller", email="finance@abcltd.com", phone="+1-555-0192", tier="Enterprise Annual", is_active=True),
            Customer(code="CUST-3040", name="XYZ Ltd", contact_person="Elena Rostova", email="billing@xyzltd.com", phone="+1-555-0183", tier="Pro Monthly", is_active=True),
            Customer(code="CUST-3039", name="PQR Ltd", contact_person="Liam Gallagher", email="ops@pqrltd.com", phone="+1-555-0174", tier="Standard Monthly", is_active=True),
            Customer(code="CUST-3038", name="Nexus Cloud Systems", contact_person="Alex Vance", email="billing@nexuscloud.io", phone="+1-555-0165", tier="Pro Tier", is_active=True),
            Customer(code="CUST-3037", name="Acme Technologies Inc.", contact_person="Sarah Connor", email="contact@acme.com", phone="+1-555-0156", tier="Enterprise Tier", is_active=True),
            Customer(code="CUST-3036", name="Horizon AI Labs", contact_person="Chen Wei", email="ops@horizonlabs.ai", phone="+1-555-0147", tier="Enterprise Tier", is_active=True),
            Customer(code="CUST-3035", name="BlueSky Digital LLC", contact_person="Marcus Vance", email="accounts@blueskydigital.com", phone="+1-555-0138", tier="Starter Tier", is_active=True)
        ]
        db.add_all(customers_data)
        db.commit()

    # 3. Staff Tasks
    if db.query(StaffTask).count() == 0:
        tasks_data = [
            StaffTask(task="Follow up invoice", customer_name="ABC Ltd", due_date="01-Nov", status="Pending", priority="High", task_type="Invoice"),
            StaffTask(task="Review quotation", customer_name="XYZ Ltd", due_date="02-Nov", status="Pending", priority="Medium", task_type="Quotation"),
            StaffTask(task="Subscription renewal", customer_name="PQR Ltd", due_date="03-Nov", status="Upcoming", priority="High", task_type="Renewal"),
            StaffTask(task="Verify bank transfer payment", customer_name="Nexus Cloud Systems", due_date="04-Nov", status="Pending", priority="Normal", task_type="Payment"),
            StaffTask(task="Account contact verification", customer_name="Horizon AI Labs", due_date="05-Nov", status="Upcoming", priority="Low", task_type="Customer")
        ]
        db.add_all(tasks_data)
        db.commit()

    # 4. Quotations
    if db.query(Quotation).count() == 0:
        cust1 = db.query(Customer).filter(Customer.code == "CUST-3040").first()
        cust2 = db.query(Customer).filter(Customer.code == "CUST-3041").first()
        cust3 = db.query(Customer).filter(Customer.code == "CUST-3037").first()

        quotes_data = [
            Quotation(code="QT-2026-042", customer_id=cust1.id if cust1 else 1, customer_name="XYZ Ltd", contact_person="Elena Rostova", plan_name="Enterprise Suite (50 Seats)", amount=18400.00, expiry_date="02-Nov-2026", status="Pending Review"),
            Quotation(code="QT-2026-041", customer_id=cust2.id if cust2 else 1, customer_name="ABC Ltd", contact_person="David Miller", plan_name="Pro Annual Custom Tier", amount=8900.00, expiry_date="05-Nov-2026", status="Pending"),
            Quotation(code="QT-2026-040", customer_id=cust3.id if cust3 else 1, customer_name="Global Fintech Ltd", contact_person="Marcus Vance", plan_name="Custom Infrastructure Tier", amount=32000.00, expiry_date="10-Nov-2026", status="Approved"),
            Quotation(code="QT-2026-039", customer_id=cust1.id if cust1 else 1, customer_name="Summit Health Corp", contact_person="Clara Oswald", plan_name="Team Healthcare Plan", amount=12500.00, expiry_date="01-Nov-2026", status="Expiring Soon")
        ]
        db.add_all(quotes_data)
        db.commit()

    # 5. Subscriptions
    if db.query(Subscription).count() == 0:
        c_abc = db.query(Customer).filter(Customer.name.like("%ABC%")).first() or db.query(Customer).first()
        c_xyz = db.query(Customer).filter(Customer.name.like("%XYZ%")).first() or db.query(Customer).first()
        c_pqr = db.query(Customer).filter(Customer.name.like("%PQR%")).first() or db.query(Customer).first()
        c_acme = db.query(Customer).filter(Customer.name.like("%Acme%")).first() or db.query(Customer).first()
        c_nexus = db.query(Customer).filter(Customer.name.like("%Nexus%")).first() or db.query(Customer).first()

        subs_data = [
            Subscription(code="SUB-2041", customer_id=c_abc.id, customer_name=c_abc.name, plan_id=1, plan_name="Enterprise Yearly Suite", billing_interval="yearly", rate="$3,600.00 / yr", amount=3600.00, start_date="Oct 30, 2026", expiry_date="Oct 30, 2027", next_billing_date="Oct 30, 2027", status="Active"),
            Subscription(code="SUB-2040", customer_id=c_xyz.id, customer_name=c_xyz.name, plan_id=2, plan_name="Professional Team Monthly", billing_interval="monthly", rate="$149.00 / mo", amount=149.00, start_date="Oct 29, 2026", expiry_date="Nov 29, 2026", next_billing_date="Nov 29, 2026", status="Active"),
            Subscription(code="SUB-2039", customer_id=c_pqr.id, customer_name=c_pqr.name, plan_id=1, plan_name="Standard Monthly", billing_interval="monthly", rate="$89.00 / mo", amount=89.00, start_date="Aug 10, 2026", expiry_date="Nov 03, 2026", next_billing_date="Nov 03, 2026", status="Upcoming Renewal"),
            Subscription(code="SUB-2038", customer_id=c_nexus.id, customer_name=c_nexus.name, plan_id=3, plan_name="Enterprise Dedicated Server", billing_interval="yearly", rate="$3,600.00 / yr", amount=3600.00, start_date="Sep 15, 2026", expiry_date="Sep 15, 2027", next_billing_date="Sep 15, 2027", status="Active"),
            Subscription(code="SUB-2037", customer_id=c_acme.id, customer_name=c_acme.name, plan_id=2, plan_name="Standard Monthly (Paused)", billing_interval="monthly", rate="$89.00 / mo", amount=89.00, start_date="Jul 01, 2026", expiry_date="Nov 01, 2026", next_billing_date="Paused", status="Paused")
        ]
        db.add_all(subs_data)
        db.commit()

    # 6. Invoices
    if db.query(Invoice).count() == 0:
        c1 = db.query(Customer).filter(Customer.name.like("%ABC%")).first() or db.query(Customer).first()
        c2 = db.query(Customer).filter(Customer.name.like("%BlueSky%")).first() or db.query(Customer).first()
        c3 = db.query(Customer).filter(Customer.name.like("%Nexus%")).first() or db.query(Customer).first()
        c4 = db.query(Customer).filter(Customer.name.like("%Acme%")).first() or db.query(Customer).first()

        invoices_data = [
            Invoice(code="INV-2026-092", customer_id=c1.id, customer_name=c1.name, subscription_id=1, issue_date="18-Oct-2026", due_date="01-Nov-2026", subtotal=2227.27, tax_amount=222.73, discount_amount=0.00, total_amount=2450.00, paid_amount=0.00, status="Pending"),
            Invoice(code="INV-2026-091", customer_id=c2.id, customer_name=c2.name, subscription_id=2, issue_date="01-Oct-2026", due_date="15-Oct-2026", subtotal=1654.55, tax_amount=165.45, discount_amount=0.00, total_amount=1820.00, paid_amount=0.00, status="Overdue"),
            Invoice(code="INV-2026-090", customer_id=c3.id, customer_name=c3.name, subscription_id=3, issue_date="20-Oct-2026", due_date="04-Nov-2026", subtotal=409.09, tax_amount=40.91, discount_amount=0.00, total_amount=450.00, paid_amount=0.00, status="Pending"),
            Invoice(code="INV-2026-089", customer_id=c4.id, customer_name=c4.name, subscription_id=4, issue_date="15-Oct-2026", due_date="30-Oct-2026", subtotal=3272.73, tax_amount=327.27, discount_amount=0.00, total_amount=3600.00, paid_amount=3600.00, status="Paid"),
            Invoice(code="INV-2026-088", customer_id=c3.id, customer_name=c3.name, subscription_id=3, issue_date="14-Oct-2026", due_date="28-Oct-2026", subtotal=809.09, tax_amount=80.91, discount_amount=0.00, total_amount=890.00, paid_amount=890.00, status="Paid")
        ]
        db.add_all(invoices_data)
        db.commit()

    # 7. Payments
    if db.query(Payment).count() == 0:
        c1 = db.query(Customer).filter(Customer.name.like("%ABC%")).first() or db.query(Customer).first()
        c4 = db.query(Customer).filter(Customer.name.like("%Acme%")).first() or db.query(Customer).first()
        c3 = db.query(Customer).filter(Customer.name.like("%Nexus%")).first() or db.query(Customer).first()

        payments_data = [
            Payment(code="PAY-8822", customer_id=c1.id, customer_name=c1.name, invoice_code="INV-2026-092", amount=2450.00, payment_date="31-Oct-2026", payment_method="Bank Transfer (ACH)", status="Pending"),
            Payment(code="PAY-8821", customer_id=c4.id, customer_name=c4.name, invoice_code="INV-2026-089", amount=3600.00, payment_date="30-Oct-2026", payment_method="Stripe ACH Transfer", status="Cleared"),
            Payment(code="PAY-8820", customer_id=c3.id, customer_name=c3.name, invoice_code="INV-2026-088", amount=450.00, payment_date="29-Oct-2026", payment_method="Credit Card (Visa ···· 4242)", status="Cleared"),
            Payment(code="PAY-8819", customer_id=c3.id, customer_name=c3.name, invoice_code="INV-2026-087", amount=890.00, payment_date="28-Oct-2026", payment_method="Credit Card (Mastercard ···· 8812)", status="Cleared"),
            Payment(code="PAY-8818", customer_id=c4.id, customer_name=c4.name, invoice_code="INV-2026-086", amount=1200.00, payment_date="27-Oct-2026", payment_method="Direct Wire Settlement", status="Cleared")
        ]
        db.add_all(payments_data)
        db.commit()

    # 8. Tax Rules
    if db.query(TaxRule).count() == 0:
        taxes_data = [
            TaxRule(code="TAX-001", name="United Kingdom Standard VAT", rate=20.00, category="Value Added Tax (VAT)", is_active=True),
            TaxRule(code="TAX-002", name="India Integrated GST (IGST)", rate=18.00, category="Goods & Services Tax (GST)", is_active=True),
            TaxRule(code="TAX-003", name="California State Sales Tax", rate=8.75, category="Sales Tax", is_active=True),
            TaxRule(code="TAX-004", name="European Union Cross-Border B2B", rate=0.00, category="Reverse Charge", is_active=True),
            TaxRule(code="TAX-005", name="Legacy Regional Surcharge", rate=2.50, category="Excise Surcharge", is_active=False)
        ]
        db.add_all(taxes_data)
        db.commit()

    # 9. Discounts
    if db.query(Discount).count() == 0:
        discounts_data = [
            Discount(code="WELCOME20", name="WELCOME20", discount_type="percentage", value=20.00, valid_until="31-Dec-2026", is_active=True),
            Discount(code="STARTUP50", name="STARTUP50", discount_type="percentage", value=50.00, valid_until="31-Mar-2027", is_active=True),
            Discount(code="FLAT50OFF", name="FLAT50OFF", discount_type="fixed", value=50.00, valid_until="15-Oct-2026", is_active=False),
            Discount(code="BLACKFRIDAY26", name="BLACKFRIDAY26", discount_type="percentage", value=25.00, valid_until="30-Nov-2026", is_active=True)
        ]
        db.add_all(discounts_data)
        db.commit()

    # 10. Quotation Templates
    if db.query(QuotationTemplate).count() == 0:
        templates_data = [
            QuotationTemplate(code="TPL-01", name="Standard SMB Annual Proposal", discount="15% Off List", validity="30 Days", description="Standard SMB proposal tier with 30-day decision SLA.", is_active=True),
            QuotationTemplate(code="TPL-02", name="Enterprise Multi-Year Commitment", discount="25% Off List", validity="45 Days", description="Enterprise tier contract with multi-year commitment terms.", is_active=True),
            QuotationTemplate(code="TPL-03", name="Startup Accelerator Grant Package", discount="50% First Year", validity="14 Days", description="High-growth startup program grant tier.", is_active=True)
        ]
        db.add_all(templates_data)
        db.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure all tables are created in PostgreSQL on application startup
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_admin_user(db)
        seed_all_modules(db)
    yield


app = FastAPI(
    title="Subscription Management System API",
    version="2.0.0",
    description="Full Backend Service for Subscriptions, Products, Plans, Customers, and Dashboards",
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
app.include_router(products.router)
app.include_router(plans.router)
app.include_router(dashboard.router)
app.include_router(customers.router)
app.include_router(subscriptions.router)
app.include_router(invoices.router)
app.include_router(payments.router)
app.include_router(quotations.router)
app.include_router(users.router)
app.include_router(tasks.router)
app.include_router(reports.router)
app.include_router(taxes.router)
app.include_router(discounts.router)


@app.get("/", tags=["Health Check"])
def health_check():
    """
    Backend service health check endpoint.
    """
    return {
        "status": "healthy",
        "service": "Subscription Management System API",
        "milestone": "2.0.0"
    }
