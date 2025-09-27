"use client";

import { AnalyzeButton } from "@/components/analysis/analyzeButton";
import TradingViewWidget from "./charts/TradingViewWidget";
import { AnalysisCard } from "@/components/analysis/analysis-card";
import type { Analysis } from "@/types/analysis";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

import { PairSelector } from "@/components/pairs/PairSelector";
import { PairOverview } from "@/components/pairs/PairOverview";
import { LastAnalyses } from "@/components/analysis/LastAnalyses";

export default function Page() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [selectedPair, setSelectedPair] = useState("BTCUSDT");

  const pairs = [
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
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Верхняя панель — кнопка и результат */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 rounded-xl md:col-span-3 h-[300px] overflow-hidden flex">
          <div className="p-4 w-[200px] flex items-center justify-center">
            <AnalyzeButton onResult={setAnalysis} />
          </div>
          <Separator orientation="vertical" />
          <div className="p-4 w-full">
            <AnalysisCard analysis={analysis} />
          </div>
        </div>
      </div>

      {/* Нижняя секция */}
      <div className="grid gap-4 md:grid-cols-3 flex-1 min-h-0">
        {/* Левая часть: график */}
        <div className="md:col-span-2 h-[calc(100vh-200px)] min-h-0 overflow-hidden">
          <TradingViewWidget symbol={selectedPair} interval="60" />
        </div>

        {/* Правая часть: единый Card */}
        <Card className="flex flex-col h-[calc(100vh-200px)]">
          <CardContent className="flex-1 flex flex-col gap-4 justify-between overflow-y-auto ">
            <PairSelector pairs={pairs} onSelect={setSelectedPair} />

            <Separator />

            <PairOverview pair={selectedPair} />

            <Separator />

            <LastAnalyses pair={selectedPair} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
