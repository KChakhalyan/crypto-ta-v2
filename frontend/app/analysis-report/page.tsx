"use client";

import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/analysis/data-table";
import { Analysis } from "@/types/analysis";
import { Badge } from "@/components/ui/badge";

export default function AnalysisReportPage() {
  const [data, setData] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/api/analysis`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("❌ Error fetching analysis:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const columns: ColumnDef<Analysis>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "symbol", header: "Symbol" },
    { accessorKey: "interval", header: "Interval" },
    {
      accessorKey: "signal",
      header: "Signal",
      cell: ({ row }) => {
        const value = String(row.getValue("signal")).toLowerCase() as
          | "buy"
          | "sell"
          | "hold";

        return <Badge variant={value}>{value.toUpperCase()}</Badge>;
      },
    },
    { accessorKey: "target_price", header: "Target Price" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const value = String(row.getValue("status")).toLowerCase() as
          | "success"
          | "failed"
          | "pending";

        return <Badge variant={value}>{value.toUpperCase()}</Badge>;
      },
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleString(),
    },
  ];

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Analysis Reports</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable data={data} columns={columns} />
      )}
    </main>
  );
}
