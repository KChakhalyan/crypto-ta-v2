"use client";

import { useState } from "react";
import type { Analysis } from "@/types/analysis";
import { AnalysisCardPro } from "@/components/analysis/analysis-card-pro";
import { AnalyzeButton } from "@/components/analysis/analyzeButton";
import {
  AnalysisForm,
  type AnalysisFormState,
} from "@/components/analysis/analysis-form";
import TradingViewWidget from "@/app/charts/TradingViewWidget";

export default function AnalysisReportPage() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [form, setForm] = useState<AnalysisFormState>({
    symbol: "BTCUSDT",
    interval: "1h",
    deposit: 1000,
    riskPct: 1,
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Controls */}
      <div className="flex flex-col gap-3">
        <AnalysisForm value={form} onChange={setForm} />
        <div>
          <AnalyzeButton
            params={{
              symbol: form.symbol,
              interval: form.interval,
              deposit: form.deposit,
              riskPct: form.riskPct,
            }}
            onResult={setAnalysis}
          />
        </div>
      </div>

      {/* Detailed card */}
      <AnalysisCardPro data={analysis} />

      {/* Chart */}
      {/* <div className="rounded-xl bg-muted/30 p-2">
        <TradingViewWidget symbol="BTCUSDT" interval="60" />
      </div> */}
    </div>
  );
}
