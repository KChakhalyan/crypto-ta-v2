"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Analysis } from "@/types/analysis";

interface AnalyzeButtonProps {
  onResult: (result: Analysis) => void;
}

export function AnalyzeButton({ onResult }: AnalyzeButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/analyze/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ symbol: "BTCUSDT", interval: "1h" }),
        }
      );

      if (!res.ok) throw new Error("Failed to analyze");

      const json: Analysis = await res.json();
      console.log("✅ Analysis result:", json);

      onResult(json);
    } catch (err) {
      console.error("❌ Error analyzing:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleAnalyze} disabled={loading} className="w-full">
      {loading ? "Analyzing..." : "Analyze"}
    </Button>
  );
}
