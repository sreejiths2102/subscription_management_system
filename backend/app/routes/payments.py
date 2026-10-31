from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models import Payment, Invoice, Customer, User
from app.security import require_staff_or_admin

router = APIRouter(prefix="/api/payments", tags=["Payment Management"])


def serialize_payment(p: Payment) -> dict:
    return {
        "id": p.code,
        "db_id": p.id,
        "customer": p.customer_name,
        "amount": f"${float(p.amount):,.2f}",
        "raw_amount": float(p.amount),
        "date": p.payment_date,
        "method": p.payment_method,
        "invoice": p.invoice_code or "INV-REF",
        "status": p.status
    }


@router.get("")
def get_all_payments(
    search: Optional[str] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):
    query = db.query(Payment)
    if status_filter and status_filter != "All":
        query = query.filter(Payment.status == status_filter)
    if search and search.strip():
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Payment.customer_name.ilike(search_fmt),
                Payment.code.ilike(search_fmt),
                Payment.payment_method.ilike(search_fmt)
            )
        )
    payments = query.order_by(Payment.id.desc()).all()
    return [serialize_payment(p) for p in payments]


@router.post("", status_code=status.HTTP_201_CREATED)
def record_payment(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):
    code = f"PAY-{8800 + db.query(Payment).count() + 1}"
    amount = float(payload.get("amount", 450.00))
    payment = Payment(
        code=code,
        customer_id=payload.get("customer_id", 1),
        customer_name=payload.get("customer", "Acme Technologies Inc."),
        invoice_code=payload.get("invoice_code", "INV-2026-089"),
        amount=amount,
        payment_date="31-Oct-2026",
        payment_method=payload.get("payment_method", "Stripe ACH Transfer"),
        status="Cleared"
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return serialize_payment(payment)
