from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.schema import UserRegister, UserLogin
from app.services.user_service import register_user, login_user

router = APIRouter(prefix="/user", tags=["User"])


@router.post("/register")
def register(data: UserRegister, db: Session = Depends(get_db)):
    user, error = register_user(db, data)

    if error:
        return {"message": error}

    return {"message": "Registered successfully!"}


@router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    user, error = login_user(db, data)

    if error:
        return {
            "message": error,
            "user_id": None
        }

    return {
        "message": "Login successful!",
        "user_id": str(user.id)  # UUID → string for JSON
    }