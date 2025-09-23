from sqlalchemy import Column, Integer, String, Float, DateTime, UniqueConstraint, Enum
from datetime import datetime, timezone
from app.db.database import Base
from sqlalchemy import Enum


class AnalysisStatus(str,Enum):
    pending = "pending"
    success = "success"
    failed = "failed"


class FavoritePair(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, nullable=False, unique=True)

    __table_args__ = (
        UniqueConstraint("symbol", name="uq_favorites_symbol"),
    )

class Analysis(Base):
    __tablename__ = "analysis"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True)
    interval = Column(String)
    signal = Column(String)
    target_price = Column(Float)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    status = Column(
        Enum("pending", "success", "failed", name="analysisstatus"),
        default="pending",
        nullable=False
    )

    __table_args__ = (
        UniqueConstraint("symbol", "interval", "created_at", name="uq_analysis_entry"),
    )
