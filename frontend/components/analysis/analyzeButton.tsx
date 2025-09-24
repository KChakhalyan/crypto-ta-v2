"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Analysis } from "@/types/analysis";
import { generateMockAnalysis, type MockParams } from "@/lib/mock";

type Props = {
  onResult: (result: Analysis) => void;
  params?: MockParams; // ← params теперь необязателен
};

export function AnalyzeButton({ onResult, params }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    setLoading(true);
    try {
      const mock = await generateMockAnalysis({
        symbol: params?.symbol ?? "BTCUSDT",
        interval: params?.interval ?? "1h",
        deposit: params?.deposit ?? 1000,
        riskPct: params?.riskPct ?? 1,
      });
      onResult(mock);
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
