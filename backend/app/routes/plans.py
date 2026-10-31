from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models import Plan, Product, ProductVariant, User
from app.schemas import (
    PlanCreate,
    PlanUpdate,
    PlanResponse,
    PlanDetailResponse
)
from app.security import require_admin, require_staff_or_admin

router = APIRouter(prefix="/api/plans", tags=["Plan Management"])


def serialize_plan(p: Plan, include_details: bool = False) -> dict:
    data = {
        "id": p.id,
        "code": p.code,
        "name": p.name,
        "description": p.description,
        "product_id": p.product_id,
        "product_name": p.product.name if p.product else "Unknown Product",
        "variant_id": p.variant_id,
        "variant_name": p.variant.name if p.variant else None,
        "billing_interval": p.billing_interval,
        "price": float(p.price or 0.0),
        "min_quantity": p.min_quantity,
        "available_from": p.available_from,
        "available_to": p.available_to,
        "allow_pause": p.allow_pause,
        "allow_renewal": p.allow_renewal,
        "allow_closure": p.allow_closure,
        "trial_days": p.trial_days,
        "is_active": p.is_active,
        "created_at": p.created_at,
        "updated_at": p.updated_at
    }
    if include_details:
        if p.product:
            data["product"] = {
                "id": p.product.id,
                "code": p.product.code,
                "name": p.product.name,
                "category": p.product.category,
                "sales_price": float(p.product.sales_price or 0.0),
                "cost_price": float(p.product.cost_price or 0.0),
                "description": p.product.description,
                "is_active": p.product.is_active,
                "variants_count": len(p.product.variants) if p.product.variants else 0,
                "created_at": p.product.created_at,
                "updated_at": p.product.updated_at
            }
        if p.variant:
            data["variant"] = {
                "id": p.variant.id,
                "product_id": p.variant.product_id,
                "code": p.variant.code,
                "name": p.variant.name,
                "additional_price": float(p.variant.additional_price or 0.0),
                "total_price": p.variant.total_price,
                "is_active": p.variant.is_active,
                "created_at": p.variant.created_at
            }
    return data


@router.get("", response_model=List[PlanResponse])
def get_all_plans(
    search: Optional[str] = None,
    interval: Optional[str] = None,
    product_id: Optional[int] = None,
    active_only: Optional[bool] = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):
    """
    List all subscription plans with optional filtering.
    Accessible by Admin and Staff.
    """
    require_staff_or_admin(current_user)
    query = db.query(Plan).join(Product, Plan.product_id == Product.id)

    if active_only:
        query = query.filter(Plan.is_active == True)
    if interval and isinstance(interval, str) and interval != "All":
        query = query.filter(Plan.billing_interval.ilike(f"%{interval}%"))
    if product_id:
        query = query.filter(Plan.product_id == product_id)
    if search and isinstance(search, str) and search.strip():
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Plan.name.ilike(search_fmt),
                Plan.code.ilike(search_fmt),
                Product.name.ilike(search_fmt)
            )
        )

    plans = query.order_by(Plan.id.asc()).all()
    return [serialize_plan(p) for p in plans]


@router.get("/{plan_id}", response_model=PlanDetailResponse)
def get_plan_details(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):
    """
    View complete subscription plan details including associated product and variant.
    Accessible by Admin and Staff.
    """
    require_staff_or_admin(current_user)
    plan = db.query(Plan).filter(Plan.id == plan_id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subscription plan with ID {plan_id} was not found."
        )
    return serialize_plan(plan, include_details=True)


@router.post("", response_model=PlanDetailResponse, status_code=status.HTTP_201_CREATED)
def create_plan(
    payload: PlanCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """
    Create a new subscription plan with product association, interval, availability, and lifecycle permissions.
    Restricted to Administrators.
    """
    require_admin(admin)
    code_clean = payload.code.strip().upper()
    existing = db.query(Plan).filter(Plan.code == code_clean).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Plan code '{code_clean}' already exists."
        )

    # Verify associated product exists
    product = db.query(Product).filter(Product.id == payload.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Associated product with ID {payload.product_id} was not found."
        )

    # Verify variant if provided
    if payload.variant_id:
        variant = db.query(ProductVariant).filter(
            ProductVariant.id == payload.variant_id,
            ProductVariant.product_id == payload.product_id
        ).first()
        if not variant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Associated variant with ID {payload.variant_id} does not belong to product '{product.name}'."
            )

    plan = Plan(
        code=code_clean,
        name=payload.name.strip(),
        description=payload.description.strip() if payload.description else None,
        product_id=payload.product_id,
        variant_id=payload.variant_id,
        billing_interval=payload.billing_interval.strip().lower(),
        price=payload.price,
        min_quantity=payload.min_quantity,
        available_from=payload.available_from,
        available_to=payload.available_to,
        allow_pause=payload.allow_pause,
        allow_renewal=payload.allow_renewal,
        allow_closure=payload.allow_closure,
        trial_days=payload.trial_days,
        is_active=payload.is_active
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return serialize_plan(plan, include_details=True)


@router.put("/{plan_id}", response_model=PlanDetailResponse)
def update_plan(
    plan_id: int,
    payload: PlanUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """
    Edit plan configuration, interval, pricing, availability dates, and permissions.
    Restricted to Administrators.
    """
    require_admin(admin)
    plan = db.query(Plan).filter(Plan.id == plan_id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subscription plan with ID {plan_id} was not found."
        )

    if payload.code is not None:
        code_clean = payload.code.strip().upper()
        if code_clean != plan.code:
            existing = db.query(Plan).filter(Plan.code == code_clean, Plan.id != plan_id).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Plan code '{code_clean}' is already assigned to another plan."
                )
            plan.code = code_clean

    if payload.name is not None:
        plan.name = payload.name.strip()
    if payload.description is not None:
        plan.description = payload.description.strip()
    if payload.product_id is not None:
        product = db.query(Product).filter(Product.id == payload.product_id).first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Associated product with ID {payload.product_id} was not found."
            )
        plan.product_id = payload.product_id
    if payload.variant_id is not None:
        plan.variant_id = payload.variant_id
    if payload.billing_interval is not None:
        plan.billing_interval = payload.billing_interval.strip().lower()
    if payload.price is not None:
        plan.price = payload.price
    if payload.min_quantity is not None:
        plan.min_quantity = payload.min_quantity
    if payload.available_from is not None:
        plan.available_from = payload.available_from
    if payload.available_to is not None:
        plan.available_to = payload.available_to
    if payload.allow_pause is not None:
        plan.allow_pause = payload.allow_pause
    if payload.allow_renewal is not None:
        plan.allow_renewal = payload.allow_renewal
    if payload.allow_closure is not None:
        plan.allow_closure = payload.allow_closure
    if payload.trial_days is not None:
        plan.trial_days = payload.trial_days
    if payload.is_active is not None:
        plan.is_active = payload.is_active

    db.commit()
    db.refresh(plan)
    return serialize_plan(plan, include_details=True)


@router.delete("/{plan_id}")
def delete_or_deactivate_plan(
    plan_id: int,
    hard_delete: bool = False,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """
    Deactivate or delete a subscription plan.
    Restricted to Administrators.
    """
    require_admin(admin)
    plan = db.query(Plan).filter(Plan.id == plan_id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subscription plan with ID {plan_id} was not found."
        )

    if hard_delete:
        db.delete(plan)
        db.commit()
        return {"message": f"Plan '{plan.name}' was permanently deleted.", "id": plan_id}
    else:
        plan.is_active = False
        db.commit()
        return {"message": f"Plan '{plan.name}' has been deactivated.", "id": plan_id, "is_active": False}
