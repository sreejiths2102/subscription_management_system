from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models import Discount, User
from app.security import require_admin, require_staff_or_admin

router = APIRouter(prefix="/api/discounts", tags=["Discount Management"])


def serialize_discount(d: Discount) -> dict:
    val_str = f"{float(d.value):.0f}%" if d.discount_type == "percentage" else f"${float(d.value):,.2f}"
    return {
        "id": d.code,
        "db_id": d.id,
        "name": d.name,
        "type": "Percentage" if d.discount_type == "percentage" else "Fixed Amount",
        "value": val_str,
        "raw_value": float(d.value),
        "discount_type": d.discount_type,
        "startDate": "Jan 01, 2026",
        "endDate": d.valid_until or "Dec 31, 2026",
        "valid_until": d.valid_until or "Dec 31, 2026",
        "usageCount": 24,
        "status": "Active" if d.is_active else "Inactive",
        "minPurchase": "$50.00",
        "minQuantity": 1,
        "products": "All Products",
        "subscriptions": "All Subscriptions",
        "maxUsage": 500,
        "is_active": d.is_active
    }


@router.get("")
def get_all_discounts(
    search: Optional[str] = None,
    active_only: Optional[bool] = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):
    query = db.query(Discount)
    if active_only:
        query = query.filter(Discount.is_active == True)
    if search and search.strip():
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Discount.name.ilike(search_fmt),
                Discount.code.ilike(search_fmt),
                Discount.discount_type.ilike(search_fmt)
            )
        )
    discounts = query.order_by(Discount.id.asc()).all()
    return [serialize_discount(d) for d in discounts]


@router.post("", status_code=status.HTTP_201_CREATED)
def create_discount(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    code = payload.get("id") or payload.get("code") or payload.get("name")
    if not code:
        count = db.query(Discount).count()
        code = f"DISC-00{count + 1}"
    
    val_num = float(str(payload.get("value", "0")).replace("%", "").replace("$", "").strip() or 0.0)
    dtype = "percentage" if "percent" in str(payload.get("type", "")).lower() or "%" in str(payload.get("value", "")) else "fixed"

    discount = Discount(
        code=code.strip().upper(),
        name=payload.get("name", code).strip(),
        discount_type=dtype,
        value=val_num,
        valid_until=payload.get("endDate") or payload.get("valid_until") or "Dec 31, 2026",
        is_active=payload.get("status", "Active") == "Active" or payload.get("is_active", True)
    )
    db.add(discount)
    db.commit()
    db.refresh(discount)
    return serialize_discount(discount)


@router.put("/{discount_id}")
def update_discount(
    discount_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    discount = db.query(Discount).filter(Discount.id == discount_id).first()
    if not discount:
        raise HTTPException(status_code=404, detail="Discount not found.")

    if "name" in payload and payload["name"]:
        discount.name = payload["name"].strip()
    if "value" in payload:
        discount.value = float(str(payload["value"]).replace("%", "").replace("$", "").strip() or 0.0)
    if "type" in payload:
        discount.discount_type = "percentage" if "percent" in payload["type"].lower() else "fixed"
    if "endDate" in payload:
        discount.valid_until = payload["endDate"].strip()
    if "valid_until" in payload:
        discount.valid_until = payload["valid_until"].strip()
    if "status" in payload:
        discount.is_active = (payload["status"] == "Active")
    if "is_active" in payload:
        discount.is_active = bool(payload["is_active"])

    db.commit()
    db.refresh(discount)
    return serialize_discount(discount)


@router.delete("/{discount_id}")
def delete_discount(
    discount_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    discount = db.query(Discount).filter(Discount.id == discount_id).first()
    if not discount:
        raise HTTPException(status_code=404, detail="Discount not found.")
    
    discount.is_active = False
    db.commit()
    return {"message": f"Discount {discount.code} deactivated successfully."}

