from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, Numeric, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


def get_utc_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(Text, nullable=False)
    role = Column(String(20), nullable=False, default="customer")
    created_at = Column(DateTime, nullable=False, default=get_utc_now)


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(200), nullable=False)
    category = Column(String(100), nullable=False, default="Software Suite")
    sales_price = Column(Numeric(10, 2), nullable=False, default=0.00)
    cost_price = Column(Numeric(10, 2), nullable=False, default=0.00)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, default=get_utc_now)
    updated_at = Column(DateTime, nullable=False, default=get_utc_now, onupdate=get_utc_now)

    # Relationships
    variants = relationship(
        "ProductVariant",
        back_populates="product",
        cascade="all, delete-orphan",
        order_by="ProductVariant.id"
    )
    plans = relationship(
        "Plan",
        back_populates="product",
        cascade="all, delete-orphan"
    )


class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    code = Column(String(50), nullable=False)
    name = Column(String(200), nullable=False)
    additional_price = Column(Numeric(10, 2), nullable=False, default=0.00)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, default=get_utc_now)

    # Relationships
    product = relationship("Product", back_populates="variants")
    plans = relationship("Plan", back_populates="variant")

    @property
    def total_price(self):
        base = float(self.product.sales_price) if self.product and self.product.sales_price else 0.00
        additional = float(self.additional_price) if self.additional_price else 0.00
        return round(base + additional, 2)


class Plan(Base):
    __tablename__ = "plans"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="RESTRICT"), nullable=False, index=True)
    variant_id = Column(Integer, ForeignKey("product_variants.id", ondelete="SET NULL"), nullable=True, index=True)
    billing_interval = Column(String(50), nullable=False, default="monthly")  # daily, weekly, monthly, quarterly, yearly
    price = Column(Numeric(10, 2), nullable=False, default=0.00)
    min_quantity = Column(Integer, nullable=False, default=1)
    available_from = Column(DateTime, nullable=False, default=get_utc_now)
    available_to = Column(DateTime, nullable=True)
    allow_pause = Column(Boolean, nullable=False, default=True)
    allow_renewal = Column(Boolean, nullable=False, default=True)
    allow_closure = Column(Boolean, nullable=False, default=True)
    trial_days = Column(Integer, nullable=False, default=0)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, default=get_utc_now)
    updated_at = Column(DateTime, nullable=False, default=get_utc_now, onupdate=get_utc_now)

    # Relationships
    product = relationship("Product", back_populates="plans")
    variant = relationship("ProductVariant", back_populates="plans")


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(200), nullable=False)
    contact_person = Column(String(100), nullable=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(50), nullable=True)
    tier = Column(String(50), default="Enterprise Tier")
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, default=get_utc_now)


class Quotation(Base):
    __tablename__ = "quotations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False, index=True)
    customer_name = Column(String(200), nullable=False)
    contact_person = Column(String(100), nullable=True)
    plan_name = Column(String(200), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False, default=0.00)
    expiry_date = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False, default="Pending Review")
    created_at = Column(DateTime, nullable=False, default=get_utc_now)


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False, index=True)
    customer_name = Column(String(200), nullable=False)
    plan_id = Column(Integer, ForeignKey("plans.id", ondelete="SET NULL"), nullable=True, index=True)
    plan_name = Column(String(200), nullable=False)
    billing_interval = Column(String(50), nullable=False, default="monthly")
    rate = Column(String(50), nullable=False, default="$149.00 / mo")
    amount = Column(Numeric(10, 2), nullable=False, default=149.00)
    start_date = Column(String(50), nullable=False)
    expiry_date = Column(String(50), nullable=False)
    next_billing_date = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False, default="Active")
    created_at = Column(DateTime, nullable=False, default=get_utc_now)


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False, index=True)
    customer_name = Column(String(200), nullable=False)
    subscription_id = Column(Integer, ForeignKey("subscriptions.id", ondelete="SET NULL"), nullable=True, index=True)
    issue_date = Column(String(50), nullable=False)
    due_date = Column(String(50), nullable=False)
    subtotal = Column(Numeric(10, 2), nullable=False, default=0.00)
    discount_amount = Column(Numeric(10, 2), nullable=False, default=0.00)
    tax_amount = Column(Numeric(10, 2), nullable=False, default=0.00)
    total_amount = Column(Numeric(10, 2), nullable=False, default=0.00)
    paid_amount = Column(Numeric(10, 2), nullable=False, default=0.00)
    status = Column(String(50), nullable=False, default="Pending")
    created_at = Column(DateTime, nullable=False, default=get_utc_now)


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    invoice_id = Column(Integer, ForeignKey("invoices.id", ondelete="SET NULL"), nullable=True, index=True)
    invoice_code = Column(String(50), nullable=True)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False, index=True)
    customer_name = Column(String(200), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False, default=0.00)
    payment_date = Column(String(50), nullable=False)
    payment_method = Column(String(100), nullable=False, default="Credit Card")
    status = Column(String(50), nullable=False, default="Cleared")
    created_at = Column(DateTime, nullable=False, default=get_utc_now)


class StaffTask(Base):
    __tablename__ = "staff_tasks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    task = Column(String(255), nullable=False)
    customer_name = Column(String(200), nullable=False)
    due_date = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False, default="Pending")
    priority = Column(String(20), nullable=False, default="Medium")
    task_type = Column(String(50), nullable=False, default="Invoice")
    created_at = Column(DateTime, nullable=False, default=get_utc_now)


class TaxRule(Base):
    __tablename__ = "tax_rules"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(200), nullable=False)
    rate = Column(Numeric(5, 2), nullable=False, default=0.00)
    category = Column(String(100), nullable=False, default="All Products")
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, default=get_utc_now)


class Discount(Base):
    __tablename__ = "discounts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(200), nullable=False)
    discount_type = Column(String(20), nullable=False, default="percentage")
    value = Column(Numeric(10, 2), nullable=False, default=0.00)
    valid_until = Column(String(100), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, default=get_utc_now)


class QuotationTemplate(Base):
    __tablename__ = "quotation_templates"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(200), nullable=False)
    discount = Column(String(100), nullable=False, default="0%")
    validity = Column(String(100), nullable=False, default="30 Days")
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, default=get_utc_now)

