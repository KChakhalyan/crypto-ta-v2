"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TrendingUp, TrendingDown, MinusCircle } from "lucide-react";
import type { Analysis } from "@/types/analysis";

function SignalIcon({ signal }: { signal: Analysis["signal"] }) {
  if (signal === "buy") return <TrendingUp className="h-4 w-4 mr-1.5" />;
  if (signal === "sell") return <TrendingDown className="h-4 w-4 mr-1.5" />;
  return <MinusCircle className="h-4 w-4 mr-1.5" />;
}

export function AnalysisCard({ analysis }: { analysis: Analysis | null }) {
  const [open, setOpen] = React.useState(false);

  if (!analysis) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Analysis</CardTitle>
          <CardDescription>
            Запусти анализ, чтобы увидеть результат.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Нет данных
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Краткий вид */}
      <Card className="w-full">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle>
              {analysis.symbol} • {analysis.interval}
            </CardTitle>
            <CardDescription>
              #{analysis.id} · {new Date(analysis.created_at).toLocaleString()}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant={analysis.signal} className="capitalize">
              <SignalIcon signal={analysis.signal} />
              {analysis.signal}
            </Badge>
            <Badge variant={analysis.status} className="capitalize">
              {analysis.status}
            </Badge>
            {analysis.risk?.confidence !== undefined && (
              <Badge variant="secondary">
                CONF {analysis.risk.confidence}%
              </Badge>
            )}
          </div>
        </CardHeader>

        {/* Только Trade Plan в карточке */}
        {analysis.risk && (
          <CardContent className="grid gap-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <span>Entry: {analysis.risk.entry}</span>
              <span>Stop: {analysis.risk.stop}</span>
              <span>Size: {analysis.risk.position_size}</span>
              <span>Targets: {analysis.risk.targets.join(", ")}</span>
              <span>Max Loss: ${analysis.risk.max_loss}</span>
              <span>Max Win: ${analysis.risk.max_win}</span>
              <span>R:R {analysis.risk.rr}</span>
              <span>Risk: {analysis.risk.risk_pct}%</span>
            </div>
            <div>
              <Button
                size="sm"
                onClick={() => setOpen(true)}
                className="w-full sm:w-auto"
              >
                Detailed
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Диалог с деталями */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl w-[95vw]">
          <DialogHeader>
            <DialogTitle>
              Детальный отчет: {analysis.symbol} • {analysis.interval}
            </DialogTitle>
            <DialogDescription>
              Сгенерировано {new Date(analysis.created_at).toLocaleString()}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 text-sm">
            {/* Risk */}
            {analysis.risk && (
              <section>
                <h3 className="font-semibold mb-2">Trade Plan</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <span>Entry: {analysis.risk.entry}</span>
                  <span>Stop: {analysis.risk.stop}</span>
                  <span>Targets: {analysis.risk.targets.join(", ")}</span>
                  <span>R:R {analysis.risk.rr}</span>
                  <span>Max Loss: ${analysis.risk.max_loss}</span>
                  <span>Max Win: ${analysis.risk.max_win}</span>
                  <span>Risk %: {analysis.risk.risk_pct}</span>
                  <span>Confidence: {analysis.risk.confidence}%</span>
                </div>
              </section>
            )}

            {/* Technical */}
            {analysis.ta && (
              <section>
                <h3 className="font-semibold mb-2">Technical</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <span>RSI: {analysis.ta.rsi}</span>
                  <span>
                    MACD: {analysis.ta.macd.line} / {analysis.ta.macd.signal} (
                    {analysis.ta.macd.hist})
                  </span>
                  <span>ATR: {analysis.ta.atr}</span>
                  <span>
                    MA: {analysis.ta.ma.ma20} / {analysis.ta.ma.ma50} /{" "}
                    {analysis.ta.ma.ma200}
                  </span>
                  <span>Bias: {analysis.ta.ma.bias}</span>
                  {analysis.ta.pattern && (
                    <span>Pattern: {analysis.ta.pattern}</span>
                  )}
                </div>
              </section>
            )}

            {/* Derivatives */}
            {analysis.derivs && (
              <section>
                <h3 className="font-semibold mb-2">Derivatives</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <span>Funding 8h: {analysis.derivs.funding_8h}%</span>
                  <span>OI Δ 24h: {analysis.derivs.oi_change_24h}%</span>
                  {analysis.derivs.liq_nearby?.length && (
                    <span>
                      Nearest Liq: {analysis.derivs.liq_nearby[0].side} @{" "}
                      {analysis.derivs.liq_nearby[0].price}
                    </span>
                  )}
                </div>
              </section>
            )}

            {/* Onchain */}
            {analysis.onchain && (
              <section>
                <h3 className="font-semibold mb-2">On-chain</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <span>Netflow 24h: {analysis.onchain.netflow_24h}</span>
                  {analysis.onchain.sopr && (
                    <span>SOPR: {analysis.onchain.sopr}</span>
                  )}
                  {analysis.onchain.nupl && (
                    <span>NUPL: {analysis.onchain.nupl}</span>
                  )}
                </div>
              </section>
            )}

            {/* Notes */}
            {analysis.notes && (
              <section>
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-muted-foreground">{analysis.notes}</p>
              </section>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
