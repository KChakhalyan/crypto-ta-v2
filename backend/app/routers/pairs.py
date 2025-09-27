from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
import ccxt

from app.db.database import get_db
from app.db.models import FavoritePair

router = APIRouter(prefix="/api", tags=["pairs"])

class FavoriteCreate(BaseModel):
    symbol: str

@router.get("/pairs")
async def get_pairs(quote: str | None = Query(default=None), limit: int | None = None):
    exchange = ccxt.binance()
    markets = exchange.load_markets()
    if quote:
        symbols = [s for s, m in markets.items() if m.get("active") and s.endswith("/" + quote)]
    else:
        symbols = [s for s, m in markets.items() if m.get("active")]
    if limit:
        symbols = symbols[:limit]
    return [{"symbol": s} for s in symbols]

@router.get("/pairs/favorites")
async def list_favorites(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(FavoritePair))
    favs = result.scalars().all()
    return [{"id": f.id, "symbol": f.symbol} for f in favs]

@router.post("/pairs/favorites", status_code=201)
async def add_favorite(payload: FavoriteCreate, db: AsyncSession = Depends(get_db)):
    symbol = payload.symbol.strip().upper()
    result = await db.execute(select(FavoritePair).filter(FavoritePair.symbol == symbol))
    exists = result.scalar_one_or_none()
    if exists:
        raise HTTPException(status_code=400, detail="Already in favorites")
    fav = FavoritePair(symbol=symbol)
    db.add(fav)
    await db.commit()
    await db.refresh(fav)
    return {"id": fav.id, "symbol": fav.symbol}

@router.delete("/pairs/favorites/{symbol}")
async def delete_favorite(symbol: str, db: AsyncSession = Depends(get_db)):
    symbol = symbol.strip().upper()
    result = await db.execute(select(FavoritePair).filter(FavoritePair.symbol == symbol))
    fav = result.scalar_one_or_none()
    if not fav:
        raise HTTPException(status_code=404, detail="Not in favorites")
    await db.delete(fav)
    await db.commit()
    return {"detail": "Deleted"}
