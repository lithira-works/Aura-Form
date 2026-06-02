"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";
import { BarChart2, TrendingUp, Calendar } from "lucide-react";
import type { DayRevenue, MonthRevenue } from "@/lib/analytics-data";
import { formatLKRCompact, formatAxisLKR } from "@/lib/currency";
import ChartBox from "./ChartBox";

type ViewMode = "daily" | "monthly";
type ChartType = "bar" | "area";

interface RevenueChartProps {
  dailyData: DayRevenue[];
  monthlyData: MonthRevenue[];
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-2xl px-4 py-3 text-sm shadow-xl"
      style={{
        background: "#ffffff",
        border: "1px solid var(--border)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        minWidth: "160px",
      }}
    >
      <p className="font-semibold mb-2 text-xs uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span style={{ color: "var(--text-secondary)" }}>{entry.name}</span>
          </div>
          <span className="font-bold" style={{ color: "var(--text)" }}>
            {entry.name === "Transactions"
              ? entry.value
              : formatLKRCompact(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function CustomBar(props: {
  x?: number; y?: number; width?: number; height?: number;
  fill?: string;
}) {
  const { x = 0, y = 0, width = 0, height = 0, fill } = props;
  if (!width || !height) return null;
  const radius = Math.min(6, width / 2);
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        rx={radius}
        ry={radius}
        style={{ filter: "drop-shadow(0 2px 4px rgba(242,167,185,0.25))" }}
      />
    </g>
  );
}

const CHART_HEIGHT = 260;
const INACTIVE_TOGGLE_BG = "#ffffff";

export default function RevenueChart({ dailyData, monthlyData }: RevenueChartProps) {
  const [view, setView] = useState<ViewMode>("daily");
  const [chartType, setChartType] = useState<ChartType>("bar");

  const data = view === "daily"
    ? dailyData.map((d) => ({ name: d.date, Revenue: d.revenue, Profit: d.profit, Transactions: d.transactions }))
    : monthlyData.map((m) => ({ name: m.month, Revenue: m.revenue, Profit: m.profit, Transactions: m.transactions }));

  const displayData = view === "daily" ? data.slice(-14) : data;

  const totalRevenue = data.reduce((s, d) => s + d.Revenue, 0);
  const totalProfit  = data.reduce((s, d) => s + d.Profit, 0);
  const profitMargin = Math.round((totalProfit / totalRevenue) * 100);

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: "#ffffff", boxShadow: "var(--shadow-md)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-bold text-base" style={{ color: "var(--text)" }}>
            Revenue &amp; Profit Trends
          </h3>
          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-3 h-3 rounded-sm" style={{ background: "#F2A7B9" }} />
              <span style={{ color: "var(--text-secondary)" }}>Revenue: </span>
              <span className="font-bold" style={{ color: "var(--text)" }}>{formatLKRCompact(totalRevenue)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-3 h-3 rounded-sm" style={{ background: "#c084fc" }} />
              <span style={{ color: "var(--text-secondary)" }}>Profit: </span>
              <span className="font-bold" style={{ color: "var(--text)" }}>{formatLKRCompact(totalProfit)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <TrendingUp size={12} style={{ color: "#16a34a" }} />
              <span className="font-bold" style={{ color: "#16a34a" }}>{profitMargin}% margin</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex p-1 rounded-xl gap-1" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
            {([["bar", <BarChart2 size={13} key="b" />], ["area", <TrendingUp size={13} key="a" />]] as [ChartType, React.ReactNode][]).map(([type, icon]) => (
              <button
                key={type}
                type="button"
                onClick={() => setChartType(type)}
                className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors active:scale-95"
                style={{
                  background: chartType === type ? "var(--brand)" : INACTIVE_TOGGLE_BG,
                  color: chartType === type ? "#fff" : "var(--text-secondary)",
                }}
              >
                {icon}
              </button>
            ))}
          </div>

          <div className="flex p-1 rounded-xl gap-1" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
            {(["daily", "monthly"] as ViewMode[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors active:scale-95"
                style={{
                  background: view === v ? "var(--brand)" : INACTIVE_TOGGLE_BG,
                  color: view === v ? "#fff" : "var(--text-secondary)",
                  boxShadow: view === v ? "0 2px 8px rgba(242,167,185,0.35)" : "none",
                }}
              >
                <Calendar size={11} />
                {v === "daily" ? "14 Days" : "12 Months"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ChartBox height={CHART_HEIGHT} key={`${view}-${chartType}`}>
        {(width, height) =>
          chartType === "bar" ? (
            <BarChart width={width} height={height} data={displayData} barGap={4} barCategoryGap="28%">
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "var(--text-secondary)", fontFamily: "inherit" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatAxisLKR}
                tick={{ fontSize: 11, fill: "var(--text-secondary)", fontFamily: "inherit" }}
                axisLine={false}
                tickLine={false}
                width={52}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(242,167,185,0.06)", radius: 8 }} />
              <Bar dataKey="Revenue" fill="#F2A7B9" shape={<CustomBar />} maxBarSize={32} />
              <Bar dataKey="Profit" fill="#c084fc" shape={<CustomBar />} maxBarSize={32} />
            </BarChart>
          ) : (
            <AreaChart width={width} height={height} data={displayData}>
              <defs>
                <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F2A7B9" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#F2A7B9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c084fc" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-secondary)", fontFamily: "inherit" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatAxisLKR} tick={{ fontSize: 11, fill: "var(--text-secondary)", fontFamily: "inherit" }} axisLine={false} tickLine={false} width={52} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="Revenue" stroke="#F2A7B9" strokeWidth={2.5} fill="url(#gradRevenue)" dot={false} activeDot={{ r: 5, fill: "#F2A7B9" }} />
              <Area type="monotone" dataKey="Profit" stroke="#c084fc" strokeWidth={2} fill="url(#gradProfit)" dot={false} activeDot={{ r: 5, fill: "#c084fc" }} />
            </AreaChart>
          )
        }
      </ChartBox>
    </div>
  );
}
