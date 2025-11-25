from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.auth_utils import hash_password, verify_password, create_jwt
from app.schemas.user import UserCreate, Token

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=Token)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(user_data.password)
    user = User(email=user_data.email, hashed_password=hashed)
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_jwt({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login", response_model=Token)
def login(user_data: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()

    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_jwt({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}
