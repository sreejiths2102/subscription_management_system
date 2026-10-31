from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models import Invoice, Customer, User
from app.security import require_staff_or_admin

router = APIRouter(prefix="/api/invoices", tags=["Invoice Management"])


def serialize_invoice(inv: Invoice) -> dict:
    return {
        "id": inv.code,
        "db_id": inv.id,
        "customer": inv.customer_name,
        "issueDate": inv.issue_date,
        "dueDate": inv.due_date,
        "amount": f"${float(inv.total_amount):,.2f}",
        "subtotal": float(inv.subtotal),
        "tax": float(inv.tax_amount),
        "discount": float(inv.discount_amount),
        "total": float(inv.total_amount),
        "paid": float(inv.paid_amount),
        "status": inv.status
    }


@router.get("")
def get_all_invoices(
    search: Optional[str] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):
    query = db.query(Invoice)
    if status_filter and status_filter != "All":
        query = query.filter(Invoice.status == status_filter)
    if search and search.strip():
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Invoice.customer_name.ilike(search_fmt),
                Invoice.code.ilike(search_fmt)
            )
        )
    invoices = query.order_by(Invoice.id.desc()).all()
    return [serialize_invoice(inv) for inv in invoices]


@router.post("", status_code=status.HTTP_201_CREATED)
def create_invoice(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):
    code = f"INV-2026-0{80 + db.query(Invoice).count() + 1}"
    amount = float(payload.get("amount", 450.00))
    inv = Invoice(
        code=code,
        customer_id=payload.get("customer_id", 1),
        customer_name=payload.get("customer", "Acme Technologies Inc."),
        issue_date="31-Oct-2026",
        due_date=payload.get("due_date", "15-Nov-2026"),
        subtotal=amount,
        tax_amount=amount * 0.1,
        discount_amount=0.00,
        total_amount=amount * 1.1,
        paid_amount=0.00,
        status="Pending"
    )
    db.add(inv)
    db.commit()
    db.refresh(inv)
    return serialize_invoice(inv)

