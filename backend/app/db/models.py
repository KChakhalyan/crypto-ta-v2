# backend/app/db/models.py
from enum import Enum as PyEnum
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

from sqlalchemy import (
    Column, Integer, String, Float, DateTime, UniqueConstraint, JSON, Enum as SAEnum, Text
)
from sqlalchemy.sql import func
from app.db.database import Base

class AnalysisStatus(str, PyEnum):
    pending = "pending"
    success = "success"
    failed = "failed"

class FavoritePair(Base):
    __tablename__ = "favorites"
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, nullable=False, unique=True)
    __table_args__ = (UniqueConstraint("symbol", name="uq_favorites_symbol"),)

class Analysis(Base):
    __tablename__ = "analysis"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, nullable=False)
    interval = Column(String, nullable=False)
    signal = Column(String, nullable=False)
    status = Column(SAEnum(AnalysisStatus, name="analysisstatus"), nullable=False, default=AnalysisStatus.pending)
    target_price = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    risk = Column(JSON, nullable=True)
    ta = Column(JSON, nullable=True)
    derivs = Column(JSON, nullable=True)
    onchain = Column(JSON, nullable=True)
    notes = Column(Text, nullable=True)
