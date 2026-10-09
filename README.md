# Student ERP

React + TypeScript (frontend) · FastAPI (backend) · PostgreSQL · Docker

## Run (Phase 1)
1. `copy .env.example .env` (Windows) or `cp .env.example .env`, then set a real password and SECRET_KEY
   (generate one: `python -c "import secrets; print(secrets.token_urlsafe(48))"`)
2. `docker compose up -d --build`
3. Create tables:
   `docker compose exec backend alembic revision --autogenerate -m "initial schema"`
   `docker compose exec backend alembic upgrade head`
4. Demo users: `docker compose exec backend python -m app.scripts.seed`
5. API docs: http://localhost:8000/docs  (click Authorize and log in)

Demo logins (demo only): admin@erp.local / Admin@123, faculty@erp.local / Faculty@123, student@erp.local / Student@123

## pgAdmin
Host `localhost`, Port `5433`, DB `student_erp`, user `erp_user`, password from `.env`.
