"use client";

import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/analysis/data-table";
import { Badge } from "@/components/ui/badge";
import { getReports } from "@/lib/api";
import type { Analysis } from "@/types/analysis";

export default function AnalysisReportPage() {
  const [data, setData] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const reports = await getReports();
      setData(reports);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(); // Fetch immediately on mount

    const intervalId = setInterval(fetchReports, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, []);

  const columns: ColumnDef<Analysis>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "symbol", header: "Symbol" },
    { accessorKey: "interval", header: "Interval" },
    { accessorKey: "signal", header: "Signal" },
    { accessorKey: "target_price", header: "Target Price" },
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

  if (loading) return <main className="p-6 space-y-4">Loading reports...</main>;
  if (error) return <main className="p-6 space-y-4">Error: {error}</main>;

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Analysis Reports</h1>
      <DataTable data={data} columns={columns} />
    </main>
  );
}
