from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models import Subscription, Customer, Plan, User
from app.security import require_staff_or_admin, require_admin

router = APIRouter(prefix="/api/subscriptions", tags=["Subscription Management"])


def serialize_sub(s: Subscription) -> dict:
    return {
        "id": s.code,
        "db_id": s.id,
        "customer": s.customer_name,
        "plan": s.plan_name,
        "rate": s.rate,
        "amount": float(s.amount),
        "interval": s.billing_interval,
        "startDate": s.start_date,
        "expiryDate": s.expiry_date,
        "nextBillingDate": s.next_billing_date,
        "nextRenewal": s.next_billing_date,
        "status": s.status,
        "history": [
            {"date": s.start_date, "action": "Subscription provisioned in PostgreSQL", "operator": "Billing Engine"}
        ]
    }


@router.get("")
def get_all_subscriptions(
    search: Optional[str] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):
    query = db.query(Subscription)
    if status_filter and status_filter != "All":
        query = query.filter(Subscription.status == status_filter)
    if search and search.strip():
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Subscription.customer_name.ilike(search_fmt),
                Subscription.code.ilike(search_fmt),
                Subscription.plan_name.ilike(search_fmt)
            )
        )
    subs = query.order_by(Subscription.id.asc()).all()
    return [serialize_sub(s) for s in subs]


@router.post("", status_code=status.HTTP_201_CREATED)
def create_subscription(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):
    code = f"SUB-{2000 + db.query(Subscription).count() + 1}"
    sub = Subscription(
        code=code,
        customer_id=payload.get("customer_id", 1),
        customer_name=payload.get("customer", "Acme Technologies Inc."),
        plan_id=payload.get("plan_id", 1),
        plan_name=payload.get("plan", "Enterprise Yearly Suite"),
        billing_interval=payload.get("interval", "Monthly").lower(),
        rate=payload.get("rate", "$149.00 / mo"),
        amount=149.00,
        start_date="Oct 31, 2026",
        expiry_date="Oct 31, 2027",
        next_billing_date="Nov 30, 2026",
        status="Active"
    )
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return serialize_sub(sub)


@router.put("/{sub_id}/action")
def update_subscription_status(
    sub_id: str,
    action: str = Query(..., description="pause, resume, renew, close"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):
    sub = db.query(Subscription).filter((Subscription.code == sub_id) | (Subscription.id == int(sub_id) if sub_id.isdigit() else False)).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")

    if action == "pause":
        sub.status = "Paused"
        sub.next_billing_date = "Paused"
    elif action == "resume":
        sub.status = "Active"
        sub.next_billing_date = "Nov 30, 2026"
    elif action == "renew":
        sub.status = "Active"
        sub.expiry_date = "Nov 30, 2027"
    elif action == "close":
        sub.status = "Closed"

    db.commit()
    db.refresh(sub)
    return serialize_sub(sub)
