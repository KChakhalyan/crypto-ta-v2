"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Analysis } from "@/types/analysis";

export const columns: ColumnDef<Analysis>[] = [
  {
    accessorKey: "symbol",
    header: "Symbol",
  },
  {
    accessorKey: "interval",
    header: "Interval",
  },
  {
    accessorKey: "signal",
    header: "Signal",
  },
  {
    accessorKey: "target_price",
    header: "Target Price",
    cell: ({ row }) => {
      const value = row.original.target_price;
      return (
        <div className="text-right">
          {value !== null ? value.toFixed(2) : "—"}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return date.toLocaleString();
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return status;
    },
  },
];
