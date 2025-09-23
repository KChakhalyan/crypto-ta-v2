"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, MinusCircle } from "lucide-react";
import type {
  Analysis,
  AnalysisSignal,
  AnalysisStatus,
} from "@/types/analysis";

function normalizeSignal(signal: string): AnalysisSignal {
  const s = signal?.toLowerCase();
  if (s === "buy" || s === "sell" || s === "hold") return s;
  return "hold";
}

function normalizeStatus(status: string): AnalysisStatus {
  const s = status?.toLowerCase();
  if (s === "success" || s === "failed" || s === "pending") return s;
  return "pending";
}

function SignalIcon({ signal }: { signal: AnalysisSignal }) {
  const s = normalizeSignal(signal);
  if (s === "buy") return <TrendingUp className="h-4 w-4 mr-1.5 shrink-0" />;
  if (s === "sell") return <TrendingDown className="h-4 w-4 mr-1.5 shrink-0" />;
  if (s === "hold") return <MinusCircle className="h-4 w-4 mr-1.5 shrink-0" />;
  return <Minus className="h-4 w-4 mr-1.5 shrink-0" />;
}

export function AnalysisCard({ analysis }: { analysis: Analysis | null }) {
  if (!analysis) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Analysis</CardTitle>
          <CardDescription>
            Запусти анализ, чтобы увидеть результат.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Нет данных
        </CardContent>
      </Card>
    );
  }

  const sig = normalizeSignal(analysis.signal);
  const stat = normalizeStatus(analysis.status);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div>
          <CardTitle>
            {analysis.symbol} • {analysis.interval}
          </CardTitle>
          <CardDescription>
            #{analysis.id} · {new Date(analysis.created_at).toLocaleString()}
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={sig} className="uppercase">
            <SignalIcon signal={sig} />
            {sig.toUpperCase()}
          </Badge>
          <Badge variant={stat} className="uppercase">
            {stat.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="grid gap-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Target price</span>
          <span className="font-medium">
            {analysis.target_price !== null ? analysis.target_price : "—"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Created</span>
          <span className="font-medium">
            {new Date(analysis.created_at).toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
