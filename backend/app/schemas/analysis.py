from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum


class AnalysisStatus(str, Enum):
    pending = "pending"
    success = "success"
    failed = "failed"


class AnalysisCreate(BaseModel):
    symbol: str
    interval: str


class AnalysisResponse(BaseModel):
    id: int
    symbol: str
    interval: str
    signal: str
    target_price: Optional[float]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True  # ✅ для SQLAlchemy объектов

class AnalysisOut(BaseModel):
    id: int
    symbol: str
    interval: str
    signal: str
    target_price: float
    created_at: datetime
    status: str

    class Config:
        from_attributes = True  # ✅ для SQLAlchemy объектов