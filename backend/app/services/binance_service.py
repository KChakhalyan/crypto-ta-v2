# backend/app/services/binance_service.py
import httpx
from app.core.config import settings

BINANCE_SPOT_BASE_URL = "https://api.binance.com/api/v3"
BINANCE_FUTURES_BASE_URL = "https://fapi.binance.com/fapi/v1"


async def get_klines(symbol: str, interval: str, limit: int = 100):
    """
    Получаем свечи (OHLCV) с Binance.
    symbol: "BTCUSDT"
    interval: "1h", "15m", "1d"
    """
    url = f"{BINANCE_SPOT_BASE_URL}/klines"
    params = {"symbol": symbol.upper(), "interval": interval, "limit": limit}

    async with httpx.AsyncClient() as client:
        resp = await client.get(url, params=params)
        resp.raise_for_status()
        data = resp.json()

    # data = [[open_time, open, high, low, close, volume, ...], ...]
    return data


async def get_last_price(symbol: str):
    """Получить последнюю цену по символу"""
    url = f"{BINANCE_SPOT_BASE_URL}/ticker/price"
    params = {"symbol": symbol.upper()}

    async with httpx.AsyncClient() as client:
        resp = await client.get(url, params=params)
        resp.raise_for_status()
        return resp.json()  # {"symbol": "BTCUSDT", "price": "27000.00"}


async def get_funding_info(symbol: str):
    """
    Получить информацию о ставке финансирования и открытом интересе для фьючерсов USDT-M.
    """
    funding_rate_url = f"{BINANCE_FUTURES_BASE_URL}/fundingRate"
    open_interest_url = f"{BINANCE_FUTURES_BASE_URL}/openInterest"

    params = {"symbol": symbol.upper()}

    async with httpx.AsyncClient() as client:
        funding_resp = await client.get(funding_rate_url, params=params)
        funding_resp.raise_for_status()
        funding_data = funding_resp.json()

        oi_resp = await client.get(open_interest_url, params=params)
        oi_resp.raise_for_status()
        oi_data = oi_resp.json()

    funding_rate = float(funding_data[-1]["fundingRate"]) if funding_data else None
    open_interest = float(oi_data["openInterest"]) if oi_data else None

    return {"funding_rate": funding_rate, "open_interest": open_interest}
