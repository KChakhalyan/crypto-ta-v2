"use client";
import { AnalyzeButton } from "@/components/analysis/analyzeButton";
import TradingViewWidget from "./charts/TradingViewWidget";
import { AnalysisCard } from "@/components/analysis/analysis-card";
import type { Analysis } from "@/types/analysis";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { PairSelector } from "@/components/pairs/PairSelector";

export default function Page() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [selectedPair, setSelectedPair] = useState("BTCUSDT");

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 rounded-xl md:col-span-3 h-[300px] overflow-hidden md:grid-rows-2 flex">
          <div className="p-4 w-[200px] flex items-center justify-center">
            <AnalyzeButton onResult={setAnalysis} />
          </div>
          <Separator orientation="vertical" />
          <div className="p-4 w-full">
            <AnalysisCard analysis={analysis} />
          </div>
        </div>
      </div>

      {/* НИЖНИЙ БЛОК */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3 flex-1 min-h-0">
        {/* ЛЕВАЯ: график */}
        <div className="md:col-span-2 h-[calc(100vh-200px)] min-h-0 overflow-hidden">
          <TradingViewWidget symbol={selectedPair} interval="60" />
        </div>

        {/* ПРАВАЯ: селектор + списки */}
        <div className="bg-muted/90 rounded-xl h-[calc(100vh-200px)] p-2 flex flex-col min-h-0 overflow-hidden">
          <PairSelector
            pairs={[
              "BTCUSDT",
              "ETHUSDT",
              "BNBUSDT",
              "XRPUSDT",
              "SOLUSDT",
              "ADAUSDT",
              "DOGEUSDT",
              "DOTUSDT",
              "MATICUSDT",
              "AVAXUSDT",
              "LTCUSDT",
              "TRXUSDT",
              "ATOMUSDT",
            ]}
            onSelect={setSelectedPair}
          />
        </div>
      </div>
    </div>
  );
}
