// types/analysis.ts
export type AnalysisStatus = "pending" | "success" | "failed";

export interface Analysis {
  id: number;
  symbol: string;
  interval: string;
  signal: string;
  target_price: number;
  status: string;
  created_at: string;
}
