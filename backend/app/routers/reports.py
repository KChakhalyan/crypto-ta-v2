from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List
from datetime import datetime, timezone

from app.db.database import get_db
from app.db.models import Analysis
from app.schemas.analysis import AnalysisDB

router = APIRouter(prefix="/api", tags=["reports"])

@router.get("/reports", response_model=List[AnalysisDB])
async def get_reports(limit: int | None = None, db: AsyncSession = Depends(get_db)):
    query = select(Analysis).order_by(desc(Analysis.id))
    if limit:
        query = query.limit(limit)

    result = await db.execute(query)
    reports = result.scalars().all()

    response: List[AnalysisDB] = []
    for report in reports:
        created_at = report.created_at or datetime.now(timezone.utc)
        dto = AnalysisDB.model_validate(report, from_attributes=True)
        response.append(dto.model_copy(update={"created_at": created_at}))

    return response
