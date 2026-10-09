from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import require_roles
from app.db.session import get_db
from app.models.user import Role, Student, User

router = APIRouter(prefix="/api", tags=["students"])


@router.get("/students/me/dashboard")
def student_dashboard(user: User = Depends(require_roles(Role.student))):
    """Phase 3 placeholder: profile is real, statistics are SAMPLE data.
    Later phases replace these values with calculations from attendance, marks and fee tables."""
    s = user.student
    if not s:
        raise HTTPException(404, "Student profile not found")
    return {
        "profile": {
            "name": f"{s.first_name} {s.last_name}",
            "roll_number": s.roll_number,
            "department": s.department,
            "semester": s.semester,
        },
        "stats": {  # sample values
            "attendance_percent": 87.5,
            "cgpa": 8.65,
            "courses": 6,
            "pending_assignments": 3,
            "fee_status": "Paid",
            "upcoming_exams": 2,
        },
        "today_schedule": [
            {"time": "09:00-10:00", "subject": "Python", "room": "C-201"},
            {"time": "10:00-11:00", "subject": "DBMS", "room": "C-202"},
            {"time": "11:15-12:15", "subject": "DSA", "room": "C-203"},
        ],
    }


@router.get("/admin/students")
def list_students(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    _: User = Depends(require_roles(Role.admin)),
    db: Session = Depends(get_db),
):
    total = db.scalar(select(func.count(Student.id))) or 0
    rows = db.scalars(
        select(Student).order_by(Student.roll_number).offset((page - 1) * page_size).limit(page_size)
    ).all()
    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "items": [
            {
                "id": r.id,
                "roll_number": r.roll_number,
                "name": f"{r.first_name} {r.last_name}",
                "department": r.department,
                "semester": r.semester,
            }
            for r in rows
        ],
    }
