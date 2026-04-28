from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.schema import (
    EmailAccountResponse,
    AddEmailsRequest,
    UpdatePassKeyRequest,
    GenericResponse
)
from app.services.email_account_service import (
    get_user_email_accounts,
    add_email_accounts,
    update_pass_keys
)

router = APIRouter(prefix="/email-accounts", tags=["Email Accounts"])


# -------- API 1 --------
@router.get("/{user_id}", response_model=List[EmailAccountResponse])
def get_email_accounts(user_id, db: Session = Depends(get_db)):
    records = get_user_email_accounts(db, user_id)

    if not records:
        return []

    return records


# -------- API 2 --------
@router.post("/add", response_model=GenericResponse)
def add_emails(data: AddEmailsRequest, db: Session = Depends(get_db)):
    success, message = add_email_accounts(db, data.user_id, data.emails)

    if not success:
        return {"status": "error", "message": message}

    return {"status": "success", "message": message}


# -------- API 3 --------
@router.post("/update-passkey", response_model=GenericResponse)
def update_passkey(data: UpdatePassKeyRequest, db: Session = Depends(get_db)):
    success, message = update_pass_keys(db, data.user_id, data.emails)

    if not success:
        return {"status": "error", "message": message}

    return {"status": "success", "message": message}