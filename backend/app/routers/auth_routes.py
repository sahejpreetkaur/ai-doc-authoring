# app/routers/auth_routes.py
from fastapi import APIRouter, HTTPException, Depends, Body
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import User
from app.auth_utils import hash_password, verify_password, create_jwt

router = APIRouter(prefix="/auth", tags=["Auth"])

# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class AuthIn(BaseModel):
    email: str
    password: str

@router.post("/register")
def register(payload: AuthIn, db: Session = Depends(get_db)):
    email = payload.email
    password = payload.password

    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    user = User(email=email, password_hash=hash_password(password))
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "User created successfully", "user_id": user.id}

@router.post("/login")
def login(payload: AuthIn, db: Session = Depends(get_db)):
    email = payload.email
    password = payload.password

    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_jwt({"user_id": user.id})
    return {"access_token": token, "token_type": "bearer"}
