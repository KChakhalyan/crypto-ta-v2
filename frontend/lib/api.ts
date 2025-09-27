import type { Analysis } from "@/types/analysis";

export interface Pair {
  symbol: string;
}

// 🔹 Получить список торговых пар
export async function getPairs(
  quote: string = "USDT",
  limit: number = 20
): Promise<Pair[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/pairs?quote=${quote}&limit=${limit}`
  );
  if (!response.ok) throw new Error("Failed to fetch pairs");
  return response.json();
}

// 🔹 Получить отчёты
export async function getReports(limit: number = 50): Promise<Analysis[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/reports?limit=${limit}`
  );
  if (!response.ok) throw new Error("Failed to fetch reports");
  return response.json();
}

export async function runAnalysis(symbol: string, interval: string, deposit: number, riskPct: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/analysis`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol, interval, deposit, riskPct }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to analyze symbol: ${text}`);
  }

  return response.json();
}
