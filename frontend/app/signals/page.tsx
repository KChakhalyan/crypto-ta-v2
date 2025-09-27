"use client";

import { useEffect, useState } from "react";
import { getReports, runAnalysis, getPairs, Pair } from "@/lib/api";
import type { Analysis } from "@/types/analysis";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function SignalsPage() {
  const [reports, setReports] = useState<Analysis[]>([]);
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [loading, setLoading] = useState(true);
  const [symbol, setSymbol] = useState("");
  const [timeframe, setTimeframe] = useState("1h");
  const [running, setRunning] = useState(false);

  // Загружаем пары и репорты
  useEffect(() => {
    Promise.all([getPairs("USDT", 20), getReports(50)])
      .then(([pairsData, reportsData]) => {
        setPairs(pairsData);
        if (pairsData.length > 0) {
          setSymbol(pairsData[0].symbol); // первый символ по умолчанию
        }
        setReports(reportsData);
      })
      .catch((err) => console.error("Failed to fetch:", err))
      .finally(() => setLoading(false));
  }, []);

  async function handleRunAnalysis() {
    if (!symbol) return;
    setRunning(true);
    try {
      const newReport = await runAnalysis(symbol, timeframe, 1000, 1); // Placeholder values for deposit and riskPct
      setReports((prev) => [...prev, newReport]);
    } catch (err) {
      console.error(err);
      alert("Failed to run analysis");
    } finally {
      setRunning(false);
    }
  }

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Signals</h1>

      <div className="flex gap-4 mb-6 items-center">
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {pairs.map((p) => (
            <option key={p.symbol} value={p.symbol}>
              {p.symbol}
            </option>
          ))}
        </select>

        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="15m">15m</option>
          <option value="1h">1h</option>
          <option value="4h">4h</option>
        </select>

        <Button onClick={handleRunAnalysis} disabled={running}>
          {running ? "Running..." : "Run Analysis"}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Interval</TableHead>
            <TableHead>Target Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.id}</TableCell>
              <TableCell>{r.symbol}</TableCell>
              <TableCell>{r.interval}</TableCell>
              <TableCell>{r.target_price}</TableCell>
              <TableCell>{r.status}</TableCell>
              <TableCell>{new Date(r.created_at).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
