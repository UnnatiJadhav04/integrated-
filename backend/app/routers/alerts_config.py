from fastapi import APIRouter
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.schema import AlertRequest
from fastapi.responses import JSONResponse
from app.services.alerts_config_service import create_alert_config

# router = APIRouter()
router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.post("/config")
async def create_alert(data: AlertRequest, db: Session = Depends(get_db)):
    # Here you can add DB insertion logic if needed
    success, message = create_alert_config(db, data)
    if not success:
        return JSONResponse(
            content={
                "status": "error",
                "message": "user id does not exist!"
            }
        )
    return JSONResponse(
        content={
            "status": "success",
            "message": "preferences configured successfully!"
        }
    )