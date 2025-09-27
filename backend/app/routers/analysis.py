from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from datetime import datetime

from app.db.database import get_db
from app.db import models
from app.schemas.analysis import AnalysisCreate, AnalysisDB, AnalysisStatus

from app.services.binance_service import get_klines, get_last_price
from app.services.analyzer import run_analysis

router = APIRouter(prefix="/api/analysis", tags=["analysis"])


@router.post("/", response_model=AnalysisDB)
async def create_analysis(payload: AnalysisCreate, db: AsyncSession = Depends(get_db)):
    """
    Запускаем анализ пары и сохраняем результат.
    """
    try:
        klines = await get_klines(payload.symbol, payload.interval, limit=50)
        last_price = await get_last_price(payload.symbol)
        analysis_result = await run_analysis(payload.symbol, payload.interval, payload.deposit, payload.riskPct)

        print(f"analysis_result in router: {analysis_result}")

        if not klines:
            raise HTTPException(status_code=404, detail="Нет данных с Binance")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {e}")
    else:
        last_candle = klines[-1]
        open_price = float(last_candle[1])
        close_price = float(last_candle[4])

        signal = analysis_result.get("signal", "HOLD")
        target_price = analysis_result.get("target_price", float(last_price['price']))

        new_analysis = models.Analysis(
            symbol=payload.symbol,
            interval=payload.interval,
            signal=signal,
            target_price=target_price,
            status=AnalysisStatus.pending,
            created_at=datetime.utcnow(),
            risk=analysis_result.get("risk", {}),
            ta=analysis_result.get("ta", {}),
            derivs=analysis_result.get("derivs", {}),
            onchain=analysis_result.get("onchain", {}),
            notes=analysis_result.get("notes", None),
        )

    db.add(new_analysis)
    await db.commit()
    await db.refresh(new_analysis)

    return new_analysis


@router.get("/", response_model=List[AnalysisDB])
async def get_all_analyses(db: AsyncSession = Depends(get_db)):
    """Список всех анализов"""
    result = await db.execute(select(models.Analysis))
    return result.scalars().all()


@router.get("/latest", response_model=AnalysisDB)
async def get_latest_analysis(pair_id: str, db: AsyncSession = Depends(get_db)):
    """
    Получить последний анализ для конкретной пары.
    """
    result = await db.execute(
        select(models.Analysis)
        .where(models.Analysis.symbol == pair_id)
        .order_by(models.Analysis.created_at.desc())
        .limit(1)
    )
    analysis = result.scalar_one_or_none()
    if not analysis:
        raise HTTPException(status_code=404, detail="Анализ для данной пары не найден")
    return analysis


@router.get("/{analysis_id}", response_model=AnalysisDB)
async def get_analysis(analysis_id: int, db: AsyncSession = Depends(get_db)):
    """Получить конкретный анализ"""
    result = await db.execute(
        select(models.Analysis).where(models.Analysis.id == analysis_id)
    )
    analysis = result.scalar_one_or_none()
    if not analysis:
        raise HTTPException(status_code=404, detail="Анализ не найден")
    return analysis


@router.put("/{analysis_id}", response_model=AnalysisDB)
async def update_analysis_status(
    analysis_id: int,
    status: AnalysisStatus,
    db: AsyncSession = Depends(get_db),
):
    """
    Обновить статус анализа (pending → success/failed).
    """
    result = await db.execute(
        select(models.Analysis).where(models.Analysis.id == analysis_id)
    )
    analysis = result.scalar_one_or_none()
    if not analysis:
        raise HTTPException(status_code=404, detail="Анализ не найден")

    analysis.status = status
    await db.commit()
    await db.refresh(analysis)

    return analysis


@router.delete("/{analysis_id}", response_model=dict)
async def delete_analysis(analysis_id: int, db: AsyncSession = Depends(get_db)):
    """Удалить анализ"""
    result = await db.execute(
        select(models.Analysis).where(models.Analysis.id == analysis_id)
    )
    analysis = result.scalar_one_or_none()
    if not analysis:
        raise HTTPException(status_code=404, detail="Анализ не найден")

    await db.delete(analysis)
    await db.commit()
    return {"message": f"Анализ {analysis_id} успешно удалён"}
