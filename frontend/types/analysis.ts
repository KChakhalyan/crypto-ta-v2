// types/analysis.ts
export type AnalysisStatus = "pending" | "success" | "failed";
export type AnalysisSignal = "buy" | "sell" | "hold";

// export interface Analysis {
//   id: number;
//   symbol: string;
//   interval: string;
//   signal: "buy" | "sell" | "hold";
//   target_price: number;
//   status: "success" | "failed" | "pending";
//   created_at: string;
// }
// types/analysis.ts

export interface Analysis {
  id: number;
  symbol: string;
  interval: string;
  signal: AnalysisSignal;
  target_price: number | null;
  status: AnalysisStatus;
  created_at: string; // ISO строка
}
