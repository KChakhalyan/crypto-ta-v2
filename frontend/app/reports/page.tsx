"use client";

import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/analysis/data-table";
import { Badge } from "@/components/ui/badge";

type Analysis = {
  id: number;
  symbol: string;
  signal: "BUY" | "SELL";
  entry: number;
  stop: number;
  targets: number[];
  status: "PENDING" | "SUCCESS" | "FAILED";
  created_at: string;
};

export default function AnalysisReportPage() {
  const [price, setPrice] = useState(29200); // стартовая цена
  const [data, setData] = useState<Analysis[]>([
    {
      id: 1,
      symbol: "BTCUSDT",
      signal: "BUY",
      entry: 29200,
      stop: 28900,
      targets: [29500, 29700],
      status: "PENDING",
      created_at: new Date().toISOString(),
    },
  ]);

  // имитация движения цены
  useEffect(() => {
    const interval = setInterval(() => {
      setPrice((p) => p + (Math.random() > 0.5 ? 50 : -50));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // обновление статуса
  useEffect(() => {
    setData((prev) =>
      prev.map((a) => {
        if (a.status !== "PENDING") return a;

        if (a.signal === "BUY") {
          if (price <= a.stop) return { ...a, status: "FAILED" };
          if (a.targets.some((t) => price >= t))
            return { ...a, status: "SUCCESS" };
        } else {
          if (price >= a.stop) return { ...a, status: "FAILED" };
          if (a.targets.some((t) => price <= t))
            return { ...a, status: "SUCCESS" };
        }
        return { ...a, status: "PENDING" };
      })
    );
  }, [price]);

  const columns: ColumnDef<Analysis>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "symbol", header: "Symbol" },
    { accessorKey: "signal", header: "Signal" },
    { accessorKey: "entry", header: "Entry" },
    { accessorKey: "stop", header: "Stop" },
    {
      accessorKey: "targets",
      header: "Targets",
      cell: ({ row }) => row.original.targets.join(" / "),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const value = row.original.status.toLowerCase() as
          | "success"
          | "failed"
          | "pending";
        return (
          <Badge variant={value} className="capitalize">
            {row.original.status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => {
        const [formatted, setFormatted] = useState("");
        useEffect(() => {
          setFormatted(new Date(row.getValue("created_at")).toLocaleString());
        }, [row]);
        return <span>{formatted}</span>;
      },
    },
  ];

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Analysis Reports</h1>
      <p className="text-lg">
        Current Price: <b>{price}</b>
      </p>
      <DataTable data={data} columns={columns} />
    </main>
  );
}
