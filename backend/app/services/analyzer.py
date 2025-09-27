import httpx
import numpy as np
from typing import Dict, Any
from app.services.binance_service import get_klines, get_last_price, get_funding_info


BINANCE_API = "https://api.binance.com/api/v3/klines"


async def fetch_binance_data(symbol: str, interval: str, limit: int = 100):
    url = f"{BINANCE_API}?symbol={symbol}&interval={interval}&limit={limit}"
    async with httpx.AsyncClient() as client:
        r = await client.get(url, timeout=10)
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

# Helper function for RSI calculation
def calculate_rsi(closes: np.ndarray, period: int = 14) -> float:
    if closes.size <= period:
        return 50.0

    diff = np.diff(closes)
    gains = np.where(diff > 0, diff, 0)
    losses = np.where(diff < 0, -diff, 0)

    gain_window = gains[:period]
    loss_window = losses[:period]

    avg_gain = gain_window.mean() if gain_window.size else 0.0
    avg_loss = loss_window.mean() if loss_window.size else 0.0

    if avg_loss == 0:
        return 100.0 if avg_gain > 0 else 50.0

    rs = avg_gain / avg_loss if avg_loss else 0.0
    rsi = 100 - (100 / (1 + rs))
    return float(rsi)

# Helper function for MACD calculation
def calculate_macd(closes: np.ndarray, fast_period: int = 12, slow_period: int = 26, signal_period: int = 9):
    ema_fast = _calculate_ema(closes, fast_period)
    ema_slow = _calculate_ema(closes, slow_period)
    macd_line = ema_fast - ema_slow
    signal_line = _calculate_ema(macd_line, signal_period)
    hist = macd_line - signal_line
    return {"line": macd_line[-1], "signal": signal_line[-1], "hist": hist[-1]}

def _calculate_ema(data: np.ndarray, period: int) -> np.ndarray:
    ema = np.zeros_like(data)
    ema[0] = data[0]
    alpha = 2 / (period + 1)
    for i in range(1, len(data)):
        ema[i] = data[i] * alpha + ema[i-1] * (1 - alpha)
    return ema

# Helper function for ATR calculation
def calculate_atr(highs: np.ndarray, lows: np.ndarray, closes: np.ndarray, period: int = 14) -> float:
    tr = np.maximum(highs - lows, np.abs(highs - np.roll(closes, 1)), np.abs(lows - np.roll(closes, 1)))
    atr = np.mean(tr[:period])
    return float(atr)

# Helper function for SMA calculation
def calculate_sma(closes: np.ndarray, period: int) -> float:
    return float(closes[-period:].mean())


async def run_analysis(symbol: str, interval: str, deposit: float, risk_pct_user: float) -> Dict[str, Any]:
    candles = await fetch_binance_data(symbol, interval, limit=200) # Increased limit for TA calculations
    closes = np.array([c["close"] for c in candles])
    highs = np.array([c["high"] for c in candles])
    lows = np.array([c["low"] for c in candles])

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

    # Calculate TA indicators
    rsi = calculate_rsi(closes)
    macd = calculate_macd(closes)
    atr = calculate_atr(highs, lows, closes)

    # Calculate MAs
    ma20 = calculate_sma(closes, 20)
    ma50 = calculate_sma(closes, 50)
    ma200 = calculate_sma(closes, 200)

    # Determine MA bias
    ma_bias = "NONE"
    if ma20 > ma50 and ma50 > ma200:
        ma_bias = "BULLISH"
    elif ma20 < ma50 and ma50 < ma200:
        ma_bias = "BEARISH"

    # Basic Risk Calculation
    entry = last_close
    stop_loss_percent = 0.01 # 1% stop loss
    take_profit_percent = 0.02 # 2% take profit

    if signal == "BUY":
        stop = round(entry * (1 - stop_loss_percent), 2)
        target1 = round(entry * (1 + take_profit_percent), 2)
        target2 = round(entry * (1 + take_profit_percent * 2), 2)
    else: # SELL
        stop = round(entry * (1 + stop_loss_percent), 2)
        target1 = round(entry * (1 - take_profit_percent), 2)
        target2 = round(entry * (1 - take_profit_percent * 2), 2)

    targets = [target1, target2]

    # Calculate R:R based on target1 and stop
    risk_amount = abs(entry - stop)
    reward_amount = abs(target1 - entry)
    rr = round(reward_amount / risk_amount, 2) if risk_amount > 0 else 0.0

    # Position size based on user's risk tolerance
    risk_per_trade = deposit * (risk_pct_user / 100)
    position_size = round(risk_per_trade / risk_amount, 4) if risk_amount > 0 else 0.0

    max_loss = round(risk_amount * position_size, 2)
    max_win = round(reward_amount * position_size, 2)

    confidence = 70 # Placeholder for now

    # Fetch Derivatives Data
    funding_info = await get_funding_info(symbol)
    derivs_data = {
        "funding_rate": funding_info.get("funding_rate"),
        "open_interest": funding_info.get("open_interest"),
        "liq_nearby": [],
    }

    return {
        "signal": signal,
        "target_price": float(target_price),
        "ta": {
            "sma_short": sma_short,
            "sma_long": sma_long,
            "close": last_close,
            "rsi": rsi,
            "macd": macd,
            "atr": atr,
            "ma": {
                "ma20": ma20,
                "ma50": ma50,
                "ma200": ma200,
                "bias": ma_bias,
            },
            "pattern": "NONE", # Placeholder for now
        },
        "risk": {
            "entry": entry,
            "stop": stop,
            "targets": targets,
            "rr": rr,
            "position_size": position_size,
            "max_loss": max_loss,
            "max_win": max_win,
            "risk_pct": risk_pct_user,
            "confidence": confidence,
        },
        "derivs": derivs_data,
        "onchain": {
            "netflow_24h": 1000000.0, # Dummy value
            "sopr": 1.05, # Dummy value
            "nupl": 0.6, # Dummy value
        },
        "notes": None,
    }
