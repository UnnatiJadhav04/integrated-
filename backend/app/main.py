from fastapi import FastAPI
import logging

from app.db.session import engine
from app.models.models import Base
from app.routers import user, auth, email_account, keyword, alerts_config

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Inbox Guardian API")

# Create tables automatically
@app.on_event("startup")
def on_startup():
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Tables created successfully!")



@app.get("/")
def root():
    return {"message": "API is running"}

# Include routers
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(email_account.router)
app.include_router(keyword.router)
app.include_router(alerts_config.router)