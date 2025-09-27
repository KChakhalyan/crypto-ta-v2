// lowercase для БД/API, UI сам поднимет регистры где нужно
export type AnalysisSignal = "buy" | "sell" | "hold";
export type AnalysisStatus = "pending" | "success" | "failed";

export interface RiskBlock {
  entry: number;
  stop: number;
  targets: number[]; // [t1, t2, t3]
  rr: number; // risk:reward
  position_size: number; // qty
  max_loss: number; // $
  max_win: number; // $
  risk_pct: number; // % от депозита
  confidence: number; // 0..100
}

export interface TABlock {
  rsi: number;
  macd: { line: number; signal: number; hist: number };
  atr: number;
  ma: {
    ma20: number;
    ma50: number;
    ma200: number;
    bias: "bull" | "bear" | "neutral";
  };
  pattern?: string;
}

export interface DerivsBlock {
  funding_rate: number; // %
  open_interest: number; // %
  liq_nearby?: { price: number; side: "long" | "short"; size: number }[];
}

export interface OnChainBlock {
  netflow_24h: number;
  sopr?: number;
  nupl?: number;
}

export interface Analysis {
  id: number;
  symbol: string;
  interval: string;
  signal: AnalysisSignal;
  target_price: number | null;
  status: AnalysisStatus;
  created_at: string;

  // новые блоки
  risk?: RiskBlock;
  ta?: TABlock;
  derivs?: DerivsBlock;
  onchain?: OnChainBlock;
  notes?: string;
}
