from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models import User
from app.security import require_staff_or_admin

router = APIRouter(prefix="/api/users", tags=["User Management"])


def serialize_user(u: User) -> dict:
    return {
        "id": f"USR-{100 + u.id}",
        "db_id": u.id,
        "name": u.name,
        "email": u.email,
        "role": u.role,
        "status": "Active",
        "created_at": u.created_at
    }


@router.get("")
def get_all_users(
    search: Optional[str] = None,
    role_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):
    query = db.query(User)
    if role_filter and role_filter != "All":
        query = query.filter(User.role == role_filter.lower())
    if search and search.strip():
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            or_(
                User.name.ilike(search_fmt),
                User.email.ilike(search_fmt)
            )
        )
    users = query.order_by(User.id.asc()).all()
    return [serialize_user(u) for u in users]

