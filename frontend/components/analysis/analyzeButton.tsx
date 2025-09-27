"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Analysis } from "@/types/analysis";
import { runAnalysis } from "@/lib/api";

type Props = {
  onResult: (result: Analysis) => void;
  params: { symbol: string; interval: string; deposit: number; riskPct: number };
};

export function AnalyzeButton({ onResult, params }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    setLoading(true);
    console.log("params in handleAnalyze:", params);
    try {
      // The 'params' prop is now required, so this check is technically redundant but kept for safety.
      if (!params) {
        throw new Error("Analysis parameters are missing.");
      }
      const result = await runAnalysis(params.symbol, params.interval, params.deposit, params.riskPct);
      onResult(result);
    } catch (error: any) {
      console.error("Failed to run analysis:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleAnalyze}
      disabled={loading}
      className="w-full md:w-auto"
    >
      {loading ? "Analyzing..." : "Analyze"}
    </Button>
  );
}
