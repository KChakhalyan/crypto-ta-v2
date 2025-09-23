from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Analysis

router = APIRouter()

@router.get("/api/analysis")
def get_analysis(db: Session = Depends(get_db)):
    return db.query(Analysis).all()
