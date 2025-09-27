"use client";

import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart2 } from "lucide-react";

interface PairOverviewProps {
  pair: string;
}

export function PairOverview({ pair }: PairOverviewProps) {
  const mock = {
    price: 30125.42,
    change24h: -1.32,
    volume24h: 128_532_000,
  };

  const isUp = mock.change24h >= 0;

  return (
    <section className="space-y-3">
      <h3 className="text-base font-semibold flex items-center gap-2">
        <BarChart2 className="h-4 w-4" /> {pair} Overview
      </h3>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span>Price</span>
          <span className="font-semibold">${mock.price.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>24h Change</span>
          <Badge
            variant={isUp ? "buy" : "sell"}
            className="flex items-center gap-1"
          >
            {isUp ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {mock.change24h}%
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span>24h Volume</span>
          <span>{(mock.volume24h / 1_000_000).toFixed(2)}M</span>
        </div>
      </div>
    </section>
  );
}
