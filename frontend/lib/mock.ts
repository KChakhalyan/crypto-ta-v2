import type { Analysis } from "@/types/analysis";

const rand = (min: number, max: number) =>
  +(min + Math.random() * (max - min)).toFixed(2);
const pick = <T>(a: T[]) => a[Math.floor(Math.random() * a.length)];

export type MockParams = {
  symbol?: string;
  interval?: string;
  deposit?: number; // $ депозит
  riskPct?: number; // % риска на сделку (например, 1 = 1%)
};

export async function generateMockAnalysis({
  symbol = "BTCUSDT",
  interval = "1h",
  deposit = 1000,
  riskPct = 1,
}: MockParams = {}): Promise<Analysis> {
  // базовая «рыночная» цена (для мока)
  const entry = rand(11200, 118000); // подставь реальнее под свои пары при желании
  const atr = rand(entry * 0.003, entry * 0.02);
  const stop = +(entry - atr * 2).toFixed(2);
  const t1 = +(entry + atr * 2).toFixed(2);
  const t2 = +(entry + atr * 3.5).toFixed(2);
  const t3 = +(entry + atr * 5).toFixed(2);

  const signal = pick<"buy" | "sell" | "hold">(["buy", "sell", "hold"]);
  const status = "success" as const;

  // === Risk Management ===
  const riskAmount = +(deposit * (riskPct / 100)).toFixed(2); // $ риск на сделку
  const perUnitRisk = Math.max(entry - stop, entry * 0.001); // защита от нулевого риска
  const positionSize = Math.max(1, Math.floor(riskAmount / perUnitRisk)); // кол-во единиц
  const rr = +((t2 - entry) / (entry - stop)).toFixed(2);
  const maxLoss = +(positionSize * (entry - stop)).toFixed(2);
  const maxWin = +(positionSize * (t2 - entry)).toFixed(2);

  return {
    id: Math.floor(Math.random() * 100000),
    symbol,
    interval,
    signal,
    status,
    target_price: signal === "buy" ? t2 : signal === "sell" ? stop : null,
    created_at: new Date().toISOString(),
    risk: {
      entry,
      stop,
      targets: [t1, t2, t3],
      rr,
      position_size: positionSize,
      max_loss: maxLoss,
      max_win: maxWin,
      risk_pct: riskPct,
      confidence: Math.floor(rand(55, 85)),
    },
    ta: {
      rsi: rand(20, 80),
      macd: { line: rand(-5, 5), signal: rand(-5, 5), hist: rand(-2, 2) },
      atr,
      ma: {
        ma20: entry * 0.999,
        ma50: entry * 1.001,
        ma200: entry * 1.01,
        bias: pick(["bull", "bear", "neutral"]),
      },
      pattern: pick([undefined, "bullish engulfing", "pin bar", "triangle"]),
    },
    derivs: {
      funding_8h: rand(-0.05, 0.05),
      oi_change_24h: rand(-10, 10),
      liq_nearby: [
        {
          price: +(entry * 0.98).toFixed(2),
          side: "long",
          size: Math.floor(rand(100, 500)),
        },
      ],
    },
    onchain: symbol.toUpperCase().startsWith("BTC")
      ? {
          netflow_24h: rand(-3000, 3000),
          sopr: rand(0.9, 1.2),
          nupl: rand(-0.2, 0.6),
        }
      : undefined,
    notes: "Mock data only. Replace with real backend response later.",
  };
}
