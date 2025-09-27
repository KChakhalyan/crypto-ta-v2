# backend/app/schemas/analysis.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any
from enum import Enum


class AnalysisStatus(str, Enum):
    pending = "pending"
    success = "success"
    failed = "failed"


class AnalysisBase(BaseModel):
    symbol: str
    interval: str
    signal: str
    target_price: Optional[float]
    status: str
    created_at: datetime

    risk: Optional[Dict[str, Any]] = None
    ta: Optional[Dict[str, Any]] = None
    derivs: Optional[Dict[str, Any]] = None
    onchain: Optional[Dict[str, Any]] = None
    notes: Optional[str] = None


class AnalysisCreate(BaseModel):
    symbol: str
    interval: str
    deposit: float
    riskPct: float


class AnalysisDB(BaseModel):
    """
    Главная схема, которую возвращаем клиенту
    """

    id: int
    symbol: str
    interval: str
    signal: str
    target_price: Optional[float]
    status: str
    created_at: Optional[datetime]

    risk: Optional[Dict[str, Any]] = None
    ta: Optional[Dict[str, Any]] = None
    derivs: Optional[Dict[str, Any]] = None
    onchain: Optional[Dict[str, Any]] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True  # ✅ конвертация SQLAlchemy → Pydantic


# 🔹 Если нужно краткое отображение (например, в списках)
class AnalysisOut(BaseModel):
    id: int
    symbol: str
    interval: str
    signal: str
    target_price: Optional[float]
    created_at: datetime
    status: str

    class Config:
        from_attributes = True

