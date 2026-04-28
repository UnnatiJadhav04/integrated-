from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.schema import KeywordBulkCreate, KeywordResponse
from app.services.keyword_service import create_keywords_bulk

router = APIRouter(prefix="/keywords", tags=["Keywords"])


@router.post("/bulk-add", response_model=KeywordResponse)
def add_keywords(data: KeywordBulkCreate, db: Session = Depends(get_db)):
    success, message = create_keywords_bulk(db, data)

    if not success:
        return {
            "status": "error",
            "message": message
        }

    return {
        "status": "success",
        "message": message
    }