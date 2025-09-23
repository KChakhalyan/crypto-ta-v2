from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Analysis
from app.schemas.analysis import AnalysisResponse

router = APIRouter(prefix="/api/analysis", tags=["analysis"])


@router.get("/", response_model=list[AnalysisResponse])
def get_analyses(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
):
    """
    Получить список всех анализов (с пагинацией и сортировкой по времени).
    """
    return (
        db.query(Analysis)
        .order_by(Analysis.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
