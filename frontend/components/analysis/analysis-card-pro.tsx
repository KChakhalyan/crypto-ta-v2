"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TrendingUp, TrendingDown, MinusCircle, Info } from "lucide-react";
import type { Analysis } from "@/types/analysis";

const num = (n?: number) =>
  n == null ? "—" : String(Number.isFinite(n) ? +n.toFixed(2) : n);
const pct = (n?: number) => (n == null ? "—" : `${(+n).toFixed(2)}%`);
const fmt = (n?: number) =>
  n == null ? "—" : new Intl.NumberFormat().format(n);
const money = (n?: number) =>
  n == null ? "—" : `$${new Intl.NumberFormat().format(+n.toFixed(2))}`;

function Icon({ s }: { s: "buy" | "sell" | "hold" }) {
  if (s === "buy") return <TrendingUp className="h-4 w-4 mr-1.5 shrink-0" />;
  if (s === "sell") return <TrendingDown className="h-4 w-4 mr-1.5 shrink-0" />;
  return <MinusCircle className="h-4 w-4 mr-1.5 shrink-0" />;
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="col-span-2 md:col-span-1 text-sm font-semibold mb-1">
      {children}
    </h3>
  );
}
function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-2 p-2 rounded-md bg-muted/40">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}

export function AnalysisCardPro({ data }: { data: Analysis | null }) {
  if (!data) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Analysis</CardTitle>
          <CardDescription>Запусти анализ…</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Нет данных
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>
            {data.symbol} • {data.interval}
          </CardTitle>
          <CardDescription>
            #{data.id} · {new Date(data.created_at).toLocaleString()}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={data.signal} className="uppercase">
            <Icon s={data.signal} />
            {data.signal.toUpperCase()}
          </Badge>
          <Badge variant={data.status} className="uppercase">
            {data.status.toUpperCase()}
          </Badge>
          {data.risk?.confidence !== undefined && (
            <Badge variant="secondary" className="uppercase">
              Conf {Math.round(data.risk.confidence)}%
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Trade Plan / Risk */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-semibold">Trade plan</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  План входа, стоп и цели, рассчитанные от риска
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <KV k="Entry" v={fmt(data.risk?.entry)} />
            <KV k="Stop" v={fmt(data.risk?.stop)} />
            <KV
              k="Targets"
              v={(data.risk?.targets ?? []).map(fmt).join(" / ") || "—"}
            />
            <KV k="R:R" v={data.risk ? data.risk.rr.toFixed(2) : "—"} />
            <KV
              k="Size"
              v={data.risk ? String(data.risk.position_size) : "—"}
            />
            <KV k="Max Loss" v={money(data.risk?.max_loss)} />
            <KV k="Max Win" v={money(data.risk?.max_win)} />
            <KV k="Risk %" v={data.risk ? `${data.risk.risk_pct}%` : "—"} />
          </div>
        </section>

        <Separator />

        {/* TA snapshot */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <H3>Technical</H3>
          <KV k="RSI" v={num(data.ta?.rsi)} />
          <KV
            k="MACD"
            v={
              data.ta
                ? `${num(data.ta.macd.line)} / ${num(
                    data.ta.macd.signal
                  )} (${num(data.ta.macd.hist)})`
                : "—"
            }
          />
          <KV k="ATR" v={num(data.ta?.atr)} />
          <KV k="MA bias" v={data.ta?.ma?.bias?.toUpperCase() || "—"} />
          <KV
            k="MA(20/50/200)"
            v={
              data.ta
                ? `${num(data.ta.ma.ma20)} / ${num(data.ta.ma.ma50)} / ${num(
                    data.ta.ma.ma200
                  )}`
                : "—"
            }
          />
          <KV k="Pattern" v={data.ta?.pattern || "—"} />
        </section>

        <Separator />

        {/* Derivatives snapshot */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <H3>Derivatives</H3>
          <KV k="Funding 8h" v={pct(data.derivs?.funding_8h)} />
          <KV k="OI Δ 24h" v={pct(data.derivs?.oi_change_24h)} />
          <KV
            k="Nearest Liq"
            v={
              data.derivs?.liq_nearby?.[0]
                ? `${data.derivs.liq_nearby[0].side} @ ${fmt(
                    data.derivs.liq_nearby[0].price
                  )}`
                : "—"
            }
          />
        </section>

        {/* On-chain snapshot */}
        {data.onchain && (
          <>
            <Separator />
            <section className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <H3>On-chain</H3>
              <KV k="Netflow 24h" v={num(data.onchain.netflow_24h)} />
              <KV k="SOPR" v={num(data.onchain.sopr)} />
              <KV k="NUPL" v={num(data.onchain.nupl)} />
            </section>
          </>
        )}

        {/* Notes */}
        {data.notes && (
          <>
            <Separator />
            <section>
              <H3>Notes</H3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {data.notes}
              </p>
            </section>
          </>
        )}
      </CardContent>
    </Card>
  );
}
