"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LastAnalysesProps {
  pair: string;
}

export function LastAnalyses({ pair }: LastAnalysesProps) {
  // моковые данные анализа
  const mockAnalyses = [
    { id: 1, signal: "buy", date: "2025-09-20 12:00" },
    { id: 2, signal: "sell", date: "2025-09-21 15:30" },
    { id: 3, signal: "hold", date: "2025-09-22 18:10" },
  ] as const;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Last Analyses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
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
      </CardContent>
    </Card>
  );
}
