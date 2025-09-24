"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PairOverviewProps {
  pair: string;
}

export function PairOverview({ pair }: PairOverviewProps) {
  // пока моковые данные (потом подтянем с Binance API)
  const mock = {
    price: 30125.42,
    change24h: -1.32,
    volume24h: 128_532_000,
  };

  const isUp = mock.change24h >= 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{pair} Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
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
      </CardContent>
    </Card>
  );
}
