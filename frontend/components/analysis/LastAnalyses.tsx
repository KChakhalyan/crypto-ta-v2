"use client";

import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";

interface LastAnalysesProps {
  pair: string;
}

export function LastAnalyses({ pair }: LastAnalysesProps) {
  const mockAnalyses = [
    { id: 1, signal: "buy", date: "2025-09-20 12:00" },
    { id: 2, signal: "sell", date: "2025-09-21 15:30" },
    { id: 3, signal: "hold", date: "2025-09-22 18:10" },
  ] as const;

  return (
    <section className="space-y-3">
      <h3 className="text-base font-semibold flex items-center gap-2">
        <History className="h-4 w-4" /> Last Analyses ({pair})
      </h3>
      <div className="space-y-2 text-sm">
        {mockAnalyses.map((a) => (
          <div key={a.id} className="flex justify-between items-center">
            <span className="text-muted-foreground">{a.date}</span>
            <Badge
              variant={a.signal as "buy" | "sell" | "hold"}
              className="capitalize"
            >
              {a.signal}
            </Badge>
          </div>
        ))}
      </div>
    </section>
  );
}
