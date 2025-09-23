"use client";
import { AnalyzeButton } from "@/components/analysis/analyzeButton";
import TradingViewWidget from "./charts/TradingViewWidget";
import { AnalysisCard } from "@/components/analysis/analysis-card";
import type { Analysis } from "@/types/analysis";
import { useState } from "react";

export default function Page() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl">
          {/* добавим сюда кнопку Analyze */}
          <AnalyzeButton onResult={setAnalysis} />
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl ">
          {/* добавим сюда детальный отчет об анализе */}
          <AnalysisCard analysis={analysis} />
        </div>
        {/* <div className="bg-muted/50 aspect-video rounded-xl"></div> */}
      </div>
      <div className=" min-h-[100vh] flex-1 rounded-xl md:min-h-min">
        <TradingViewWidget symbol="BTCUSDT" interval="60" />
      </div>
    </div>
  );
}
