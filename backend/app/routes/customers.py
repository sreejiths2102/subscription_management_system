from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models import Customer, User
from app.security import require_staff_or_admin, require_admin

router = APIRouter(prefix="/api/customers", tags=["Customer Management"])


def serialize_customer(c: Customer) -> dict:
    return {
        "id": c.code,
        "db_id": c.id,
        "name": c.name,
        "contactPerson": c.contact_person or "Primary Contact",
        "email": c.email,
        "phone": c.phone or "N/A",
        "plan": c.tier or "Standard Tier",
        "mrr": "$450.00",
        "status": "Active" if c.is_active else "Inactive",
        "is_active": c.is_active,
        "created_at": c.created_at
    }


@router.get("")
def get_all_customers(
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):
    query = db.query(Customer)
    if search and search.strip():
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Customer.name.ilike(search_fmt),
                Customer.code.ilike(search_fmt),
                Customer.email.ilike(search_fmt)
            )
        )
    customers = query.order_by(Customer.id.asc()).all()
    return [serialize_customer(c) for c in customers]


@router.post("", status_code=status.HTTP_201_CREATED)
def create_customer(
    payload: dict,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    code = f"CUST-{3000 + db.query(Customer).count() + 1}"
    customer = Customer(
        code=code,
        name=payload.get("name", "New Customer").strip(),
        contact_person=payload.get("contact_person", "").strip(),
        email=payload.get("email", "").strip().lower(),
        phone=payload.get("phone", "").strip(),
        tier=payload.get("tier", "Enterprise Tier"),
        is_active=True
    )
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return serialize_customer(customer)
