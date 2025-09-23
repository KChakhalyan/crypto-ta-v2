from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
import ccxt

from app.db.database import get_db
from app.db.models import FavoritePair

router = APIRouter(prefix="/api", tags=["pairs"])

class FavoriteCreate(BaseModel):
    symbol: str

@router.get("/pairs")
def get_pairs(quote: str | None = Query(default=None), limit: int | None = None):
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
def list_favorites(db: Session = Depends(get_db)):
    favs = db.query(FavoritePair).all()
    return [{"id": f.id, "symbol": f.symbol} for f in favs]

@router.post("/pairs/favorites", status_code=201)
def add_favorite(payload: FavoriteCreate, db: Session = Depends(get_db)):
    symbol = payload.symbol.strip().upper()
    exists = db.query(FavoritePair).filter(FavoritePair.symbol == symbol).first()
    if exists:
        raise HTTPException(status_code=400, detail="Already in favorites")
    fav = FavoritePair(symbol=symbol)
    db.add(fav)
    db.commit()
    db.refresh(fav)
    return {"id": fav.id, "symbol": fav.symbol}

@router.delete("/pairs/favorites/{symbol}")
def delete_favorite(symbol: str, db: Session = Depends(get_db)):
    symbol = symbol.strip().upper()
    fav = db.query(FavoritePair).filter(FavoritePair.symbol == symbol).first()
    if not fav:
        raise HTTPException(status_code=404, detail="Not in favorites")
    db.delete(fav)
    db.commit()
    return {"detail": "Deleted"}
