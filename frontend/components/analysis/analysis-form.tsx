"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const SYMBOLS = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT"];
const INTERVALS = ["1h", "4h", "1d"];

export type AnalysisFormState = {
  symbol: string;
  interval: string;
  deposit: number; // $
  riskPct: number; // %
};

export function AnalysisForm({
  value,
  onChange,
}: {
  value: AnalysisFormState;
  onChange: (v: AnalysisFormState) => void;
}) {
  const [local, setLocal] = useState<AnalysisFormState>(value);

  function commit<K extends keyof AnalysisFormState>(
    k: K,
    v: AnalysisFormState[K]
  ) {
    const next = { ...local, [k]: v };
    setLocal(next);
    onChange(next);
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
      {/* Symbol */}
      <div className="space-y-1">
        <Label>Symbol</Label>
        <Select value={local.symbol} onValueChange={(v) => commit("symbol", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Symbol" />
          </SelectTrigger>
          <SelectContent>
            {SYMBOLS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Interval */}
      <div className="space-y-1">
        <Label>Interval</Label>
        <Select
          value={local.interval}
          onValueChange={(v) => commit("interval", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Interval" />
          </SelectTrigger>
          <SelectContent>
            {INTERVALS.map((i) => (
              <SelectItem key={i} value={i}>
                {i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Deposit */}
      <div className="space-y-1">
        <Label>Deposit ($)</Label>
        <Input
          inputMode="decimal"
          type="number"
          min={10}
          step="10"
          value={local.deposit}
          onChange={(e) =>
            commit("deposit", Math.max(10, Number(e.target.value)))
          }
        />
      </div>

      {/* Risk % */}
      <div className="space-y-1">
        <Label>Risk %</Label>
        <Input
          inputMode="decimal"
          type="number"
          min={0.1}
          max={5}
          step="0.1"
          value={local.riskPct}
          onChange={(e) => {
            const n = Number(e.target.value);
            commit("riskPct", Math.min(5, Math.max(0.1, n)));
          }}
        />
      </div>
    </div>
  );
}
