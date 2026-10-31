from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models import Product, ProductVariant, User
from app.schemas import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductDetailResponse,
    ProductVariantCreate,
    ProductVariantUpdate,
    ProductVariantResponse
)
from app.security import require_admin, require_staff_or_admin

router = APIRouter(prefix="/api/products", tags=["Product Management"])


def serialize_variant(v: ProductVariant) -> dict:
    return {
        "id": v.id,
        "product_id": v.product_id,
        "code": v.code,
        "name": v.name,
        "additional_price": float(v.additional_price or 0.0),
        "total_price": v.total_price,
        "is_active": v.is_active,
        "created_at": v.created_at
    }


def serialize_product(p: Product, include_variants: bool = False) -> dict:
    data = {
        "id": p.id,
        "code": p.code,
        "name": p.name,
        "category": p.category,
        "sales_price": float(p.sales_price or 0.0),
        "cost_price": float(p.cost_price or 0.0),
        "description": p.description,
        "is_active": p.is_active,
        "variants_count": len(p.variants) if p.variants else 0,
        "created_at": p.created_at,
        "updated_at": p.updated_at
    }
    if include_variants:
        data["variants"] = [serialize_variant(v) for v in (p.variants or [])]
    return data


@router.get("", response_model=List[ProductResponse])
def get_all_products(
    search: Optional[str] = None,
    category: Optional[str] = None,
    active_only: Optional[bool] = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):
    """
    List all products with optional filtering by search query and category.
    Accessible by Admin and Staff.
    """
    require_staff_or_admin(current_user)
    query = db.query(Product)
    if active_only:
        query = query.filter(Product.is_active == True)
    if category and isinstance(category, str) and category != "All":
        query = query.filter(Product.category.ilike(f"%{category}%"))
    if search and isinstance(search, str) and search.strip():
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Product.name.ilike(search_fmt),
                Product.code.ilike(search_fmt),
                Product.description.ilike(search_fmt)
            )
        )
    products = query.order_by(Product.id.asc()).all()
    return [serialize_product(p) for p in products]


@router.get("/{product_id}", response_model=ProductDetailResponse)
def get_product_details(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):
    """
    View complete product details including all configured variants and calculated additional pricing.
    Accessible by Admin and Staff.
    """
    require_staff_or_admin(current_user)
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} was not found."
        )
    return serialize_product(product, include_variants=True)


@router.post("", response_model=ProductDetailResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """
    Create a new product with optional initial variants.
    Restricted to Administrators.
    """
    require_admin(admin)
    code_clean = payload.code.strip().upper()
    existing = db.query(Product).filter(Product.code == code_clean).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Product code '{code_clean}' already exists. Please choose a unique SKU."
        )

    product = Product(
        code=code_clean,
        name=payload.name.strip(),
        category=payload.category.strip(),
        sales_price=payload.sales_price,
        cost_price=payload.cost_price,
        description=payload.description.strip() if payload.description else None,
        is_active=payload.is_active
    )
    db.add(product)
    db.flush()  # Generates product.id

    # Create initial variants if provided
    if payload.initial_variants:
        for v in payload.initial_variants:
            variant = ProductVariant(
                product_id=product.id,
                code=v.code.strip().upper(),
                name=v.name.strip(),
                additional_price=v.additional_price,
                is_active=v.is_active
            )
            db.add(variant)
    else:
        # Default standard single variant
        default_var = ProductVariant(
            product_id=product.id,
            code=f"{code_clean}-STD",
            name="Standard License",
            additional_price=0.00,
            is_active=True
        )
        db.add(default_var)

    db.commit()
    db.refresh(product)
    return serialize_product(product, include_variants=True)


@router.put("/{product_id}", response_model=ProductDetailResponse)
def update_product(
    product_id: int,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """
    Edit product metadata and pricing.
    Restricted to Administrators.
    """
    require_admin(admin)
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} was not found."
        )

    if payload.code is not None:
        code_clean = payload.code.strip().upper()
        if code_clean != product.code:
            existing = db.query(Product).filter(Product.code == code_clean, Product.id != product_id).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Product code '{code_clean}' is already assigned to another product."
                )
            product.code = code_clean

    if payload.name is not None:
        product.name = payload.name.strip()
    if payload.category is not None:
        product.category = payload.category.strip()
    if payload.sales_price is not None:
        product.sales_price = payload.sales_price
    if payload.cost_price is not None:
        product.cost_price = payload.cost_price
    if payload.description is not None:
        product.description = payload.description.strip()
    if payload.is_active is not None:
        product.is_active = payload.is_active

    db.commit()
    db.refresh(product)
    return serialize_product(product, include_variants=True)


@router.delete("/{product_id}")
def delete_or_deactivate_product(
    product_id: int,
    hard_delete: bool = False,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """
    Delete or deactivate a product. If plans are associated, deactivates instead of hard delete.
    Restricted to Administrators.
    """
    require_admin(admin)
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} was not found."
        )

    if hard_delete and len(product.plans) == 0:
        db.delete(product)
        db.commit()
        return {"message": f"Product '{product.name}' was permanently deleted.", "id": product_id}
    else:
        product.is_active = False
        db.commit()
        return {"message": f"Product '{product.name}' has been deactivated.", "id": product_id, "is_active": False}


# ==============================================================================
# Variant Management Endpoints
# ==============================================================================
@router.post("/{product_id}/variants", response_model=ProductVariantResponse, status_code=status.HTTP_201_CREATED)
def add_product_variant(
    product_id: int,
    payload: ProductVariantCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """
    Add a new variant to a product and configure additional pricing.
    Restricted to Administrators.
    """
    require_admin(admin)
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} was not found."
        )

    code_clean = payload.code.strip().upper()
    existing_var = db.query(ProductVariant).filter(
        ProductVariant.product_id == product_id,
        ProductVariant.code == code_clean
    ).first()
    if existing_var:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Variant with code '{code_clean}' already exists for this product."
        )

    variant = ProductVariant(
        product_id=product_id,
        code=code_clean,
        name=payload.name.strip(),
        additional_price=payload.additional_price,
        is_active=payload.is_active
    )
    db.add(variant)
    db.commit()
    db.refresh(variant)
    return serialize_variant(variant)


@router.put("/{product_id}/variants/{variant_id}", response_model=ProductVariantResponse)
def update_product_variant(
    product_id: int,
    variant_id: int,
    payload: ProductVariantUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """
    Update a product variant and recalculate additional pricing.
    Restricted to Administrators.
    """
    require_admin(admin)
    variant = db.query(ProductVariant).filter(
        ProductVariant.id == variant_id,
        ProductVariant.product_id == product_id
    ).first()
    if not variant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Variant not found for this product."
        )

    if payload.code is not None:
        variant.code = payload.code.strip().upper()
    if payload.name is not None:
        variant.name = payload.name.strip()
    if payload.additional_price is not None:
        variant.additional_price = payload.additional_price
    if payload.is_active is not None:
        variant.is_active = payload.is_active

    db.commit()
    db.refresh(variant)
    return serialize_variant(variant)


@router.delete("/{product_id}/variants/{variant_id}")
def delete_product_variant(
    product_id: int,
    variant_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """
    Delete a product variant.
    Restricted to Administrators.
    """
    require_admin(admin)
    variant = db.query(ProductVariant).filter(
        ProductVariant.id == variant_id,
        ProductVariant.product_id == product_id
    ).first()
    if not variant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Variant not found for this product."
        )

    db.delete(variant)
    db.commit()
    return {"message": f"Variant '{variant.name}' deleted successfully.", "variant_id": variant_id}
