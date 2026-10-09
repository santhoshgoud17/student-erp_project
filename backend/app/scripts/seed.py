"""Creates DEMO users only. Change/remove these before any real deployment."""
from sqlalchemy import select

from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.user import Role, Student, User

DEMO = [
    ("admin@erp.local", "Admin@123", Role.admin),
    ("faculty@erp.local", "Faculty@123", Role.faculty),
    ("student@erp.local", "Student@123", Role.student),
]


def main():
    with SessionLocal() as db:
        for email, pw, role in DEMO:
            if db.scalar(select(User).where(User.email == email)):
                continue
            user = User(email=email, password_hash=hash_password(pw), role=role)
            if role == Role.student:
                user.student = Student(
                    roll_number="2026CS001", first_name="Demo", last_name="Student",
                    department="Computer Science", semester=5,
                )
            db.add(user)
        db.commit()
    print("Seed complete.")


if __name__ == "__main__":
    main()
