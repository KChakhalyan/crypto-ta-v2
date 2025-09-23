from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from app.db.database import get_db
from app.db import models
from app.schemas.analysis import AnalysisCreate, AnalysisResponse, AnalysisStatus
from app.services.analyzer import run_analysis

router = APIRouter(prefix="/api/analyze", tags=["analyze"])


@router.post("/", response_model=AnalysisResponse)
def analyze(data: AnalysisCreate, db: Session = Depends(get_db)):
    result = run_analysis(data.symbol, data.interval)

    analysis = models.Analysis(
        symbol=data.symbol,
        interval=data.interval,
        signal=result["signal"],
        target_price=result["target_price"],
        status=AnalysisStatus.success,
        created_at=datetime.now(timezone.utc),
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    return analysis
