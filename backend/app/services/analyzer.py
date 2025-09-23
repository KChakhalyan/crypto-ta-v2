import requests
import numpy as np
from typing import Dict


BINANCE_API = "https://api.binance.com/api/v3/klines"


def fetch_binance_data(symbol: str, interval: str, limit: int = 100):
    url = f"{BINANCE_API}?symbol={symbol}&interval={interval}&limit={limit}"
    r = requests.get(url, timeout=10)
    r.raise_for_status()
    data = r.json()
    return [
        {
            "time": int(c[0] / 1000),
            "open": float(c[1]),
            "high": float(c[2]),
            "low": float(c[3]),
            "close": float(c[4]),
        }
        for c in data
    ]


def run_analysis(symbol: str, interval: str) -> Dict[str, str | float | None]:
    candles = fetch_binance_data(symbol, interval, limit=100)
    closes = np.array([c["close"] for c in candles])

    if len(closes) < 50:
        return {"signal": "HOLD", "target_price": float(closes[-1]) if len(closes) else None}

    sma_short = float(closes[-10:].mean())
    sma_long = float(closes[-50:].mean())

    if sma_short > sma_long:
        signal = "BUY"
    elif sma_short < sma_long:
        signal = "SELL"
    else:
        signal = "HOLD"

    last_close = float(closes[-1])
    target_price = round(last_close * (1.01 if signal == "BUY" else 0.99), 2)

    return {
        "signal": signal,
        "target_price": float(target_price),  # ✅ теперь Python float
    }
