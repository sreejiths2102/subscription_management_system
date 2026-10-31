from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models import Quotation, QuotationTemplate, Subscription, Customer, User
from app.security import require_staff_or_admin, require_admin

router = APIRouter(prefix="/api/quotations", tags=["Quotation Management"])


def serialize_quote(q: Quotation) -> dict:
    return {
        "id": q.code,
        "db_id": q.id,
        "customer": q.customer_name,
        "contact": q.contact_person or "Customer Contact",
        "plan": q.plan_name,
        "amount": f"${float(q.amount):,.2f}",
        "raw_amount": float(q.amount),
        "dueDate": q.expiry_date,
        "status": q.status
    }


def serialize_template(t: QuotationTemplate) -> dict:
    return {
        "id": t.code,
        "db_id": t.id,
        "name": t.name,
        "discount": t.discount,
        "validity": t.validity,
        "description": t.description or "Configured quotation proposal template."
    }


@router.get("")
def get_all_quotations(
    search: Optional[str] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):
    query = db.query(Quotation)
    if status_filter and status_filter != "All":
        query = query.filter(Quotation.status == status_filter)
    if search and search.strip():
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Quotation.customer_name.ilike(search_fmt),
                Quotation.code.ilike(search_fmt),
                Quotation.plan_name.ilike(search_fmt)
            )
        )
    quotes = query.order_by(Quotation.id.desc()).all()
    return [serialize_quote(q) for q in quotes]


@router.get("/templates")
def get_quotation_templates(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):
    templates = db.query(QuotationTemplate).filter(QuotationTemplate.is_active == True).order_by(QuotationTemplate.id.asc()).all()
    return [serialize_template(t) for t in templates]


@router.post("/templates", status_code=status.HTTP_201_CREATED)
def create_quotation_template(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    count = db.query(QuotationTemplate).count()
    code = payload.get("id") or f"TPL-0{count + 1}"
    tpl = QuotationTemplate(
        code=code.strip().upper(),
        name=payload.get("name", "New Commercial Template").strip(),
        discount=payload.get("discount", "10% Off List").strip(),
        validity=payload.get("validity", "30 Days").strip(),
        description=payload.get("description", "Standard commercial template.").strip(),
        is_active=True
    )
    db.add(tpl)
    db.commit()
    db.refresh(tpl)
    return serialize_template(tpl)


@router.post("", status_code=status.HTTP_201_CREATED)
def create_quotation(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):
    code = f"QT-2026-0{40 + db.query(Quotation).count() + 1}"
    amount = float(payload.get("amount", 18400.00))
    quote = Quotation(
        code=code,
        customer_id=payload.get("customer_id", 1),
        customer_name=payload.get("customer", "Quantum Dynamics"),
        contact_person=payload.get("contact", "Marcus Vance"),
        plan_name=payload.get("plan", "Enterprise Suite (50 Seats)"),
        amount=amount,
        expiry_date=payload.get("dueDate", "15-Nov-2026"),
        status="Pending Review"
    )
    db.add(quote)
    db.commit()
    db.refresh(quote)
    return serialize_quote(quote)


@router.post("/{quote_id}/convert")
def convert_quotation(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):
    quote = db.query(Quotation).filter(Quotation.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Quotation not found.")

    quote.status = "Accepted"

    # Create associated subscription in PostgreSQL
    count = db.query(Subscription).count()
    sub_code = f"SUB-2026-0{50 + count + 1}"
    sub = Subscription(
        code=sub_code,
        customer_id=quote.customer_id,
        customer_name=quote.customer_name,
        plan_name=quote.plan_name,
        billing_interval="yearly",
        rate=f"${float(quote.amount):,.2f} / yr",
        amount=quote.amount,
        start_date="01-Nov-2026",
        expiry_date="31-Oct-2027",
        next_billing_date="01-Nov-2027",
        status="Active"
    )
    db.add(sub)
    db.commit()
    db.refresh(quote)
    db.refresh(sub)

    return {
        "message": f"Quotation {quote.code} converted to subscription {sub.code}",
        "quotation": serialize_quote(quote),
        "subscription_code": sub.code
    }
