from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models import TaxRule, User
from app.security import require_admin, require_staff_or_admin

router = APIRouter(prefix="/api/taxes", tags=["Tax Rules Management"])


def serialize_tax(t: TaxRule) -> dict:
    return {
        "id": t.code,
        "db_id": t.id,
        "name": t.name,
        "rate": f"{float(t.rate):.1f}%" if float(t.rate) == int(float(t.rate)) else f"{float(t.rate):.2f}%",
        "raw_rate": float(t.rate),
        "type": t.category or "Sales Tax",
        "description": f"Standard tax rule applied to {t.category or 'eligible transactions'}.",
        "status": "Active" if t.is_active else "Inactive",
        "is_active": t.is_active
    }


@router.get("")
def get_all_taxes(
    search: Optional[str] = None,
    active_only: Optional[bool] = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):
    query = db.query(TaxRule)
    if active_only:
        query = query.filter(TaxRule.is_active == True)
    if search and search.strip():
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            or_(
                TaxRule.name.ilike(search_fmt),
                TaxRule.code.ilike(search_fmt),
                TaxRule.category.ilike(search_fmt)
            )
        )
    taxes = query.order_by(TaxRule.id.asc()).all()
    return [serialize_tax(t) for t in taxes]


@router.post("", status_code=status.HTTP_201_CREATED)
def create_tax(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    code = payload.get("id") or payload.get("code")
    if not code:
        count = db.query(TaxRule).count()
        code = f"TAX-00{count + 1}"
    
    rate_val = float(str(payload.get("rate", "0")).replace("%", "").strip() or 0.0)

    tax = TaxRule(
        code=code.strip().upper(),
        name=payload.get("name", "New Tax Rule").strip(),
        rate=rate_val,
        category=payload.get("type") or payload.get("category") or "Sales Tax",
        is_active=payload.get("status", "Active") == "Active" or payload.get("is_active", True)
    )
    db.add(tax)
    db.commit()
    db.refresh(tax)
    return serialize_tax(tax)


@router.put("/{tax_id}")
def update_tax(
    tax_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    tax = db.query(TaxRule).filter(TaxRule.id == tax_id).first()
    if not tax:
        raise HTTPException(status_code=404, detail="Tax rule not found.")

    if "name" in payload and payload["name"]:
        tax.name = payload["name"].strip()
    if "rate" in payload:
        tax.rate = float(str(payload["rate"]).replace("%", "").strip() or 0.0)
    if "type" in payload:
        tax.category = payload["type"].strip()
    if "category" in payload:
        tax.category = payload["category"].strip()
    if "status" in payload:
        tax.is_active = (payload["status"] == "Active")
    if "is_active" in payload:
        tax.is_active = bool(payload["is_active"])

    db.commit()
    db.refresh(tax)
    return serialize_tax(tax)


@router.delete("/{tax_id}")
def delete_tax(
    tax_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    tax = db.query(TaxRule).filter(TaxRule.id == tax_id).first()
    if not tax:
        raise HTTPException(status_code=404, detail="Tax rule not found.")
    
    tax.is_active = False
    db.commit()
    return {"message": f"Tax rule {tax.code} deactivated successfully."}
