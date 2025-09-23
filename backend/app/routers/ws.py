import json
import asyncio
import aiohttp
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()


@router.websocket("/ws/candles")
async def ws_candles(websocket: WebSocket):
    await websocket.accept()

    # Достаём параметры из запроса
    params = websocket.query_params
    symbol = params.get("symbol", "BTCUSDT").lower()
    interval = params.get("interval", "1h")

    # Binance WS URL
    url = f"wss://stream.binance.com:9443/ws/{symbol}@kline_{interval}"

    try:
        async with aiohttp.ClientSession() as session:
            async with session.ws_connect(url) as binance_ws:
                async for msg in binance_ws:
                    if msg.type == aiohttp.WSMsgType.TEXT:
                        data = json.loads(msg.data)
                        k = data.get("k")
                        if not k:
                            continue

                        # Преобразуем в формат для графика
                        candle = {
                            "time": k["t"] // 1000,  # timestamp в секундах
                            "open": float(k["o"]),
                            "high": float(k["h"]),
                            "low": float(k["l"]),
                            "close": float(k["c"]),
                        }
                        await websocket.send_json(candle)

                    elif msg.type == aiohttp.WSMsgType.ERROR:
                        print("⚠️ Binance WS error")
                        break

    except WebSocketDisconnect:
        print("❌ Client disconnected")

    except Exception as e:
        print(f"🔥 Unexpected error: {e}")
