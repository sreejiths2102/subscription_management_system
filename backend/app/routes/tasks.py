from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import StaffTask, User
from app.security import require_staff_or_admin

router = APIRouter(prefix="/api/tasks", tags=["Staff Task Management"])


def serialize_task(t: StaffTask) -> dict:
    return {
        "id": t.id,
        "task": t.task,
        "customer": t.customer_name,
        "dueDate": t.due_date,
        "status": t.status,
        "priority": t.priority,
        "type": t.task_type
    }


@router.get("")
def get_all_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):
    tasks = db.query(StaffTask).order_by(StaffTask.id.asc()).all()
    return [serialize_task(t) for t in tasks]


@router.put("/{task_id}/toggle")
def toggle_task_status(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin)
):
    task = db.query(StaffTask).filter(StaffTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.status = "Pending" if task.status == "Completed" else "Completed"
    db.commit()
    db.refresh(task)
    return serialize_task(task)

