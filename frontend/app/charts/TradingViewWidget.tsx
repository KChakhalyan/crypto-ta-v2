"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface TradingViewWidgetProps {
  symbol: string; // Пример: "BTCUSDT"
  interval?: string; // Пример: "60", "1D", "1W"
}

export default function TradingViewWidget({
  symbol,
  interval = "60",
}: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!container.current) return;

    // очистка контейнера
    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `BINANCE:${symbol}`,
      interval,
      timezone: "Etc/UTC",
      theme: theme === "dark" ? "dark" : "light",
      style: "1",
      locale: "en",
      hide_top_toolbar: false,
      hide_legend: false,
      studies: ["RSI@tv-basicstudies", "MACD@tv-basicstudies"],
      support_host: "https://www.tradingview.com",
    });

    container.current.appendChild(script);
  }, [symbol, interval, theme]);

  return (
    <div className="h-full bg-card rounded-lg border p-4">
      <div
        ref={container}
        className="tradingview-widget-container 
                   h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]"
        style={{ width: "100%" }}
      />
    </div>
  );
}
