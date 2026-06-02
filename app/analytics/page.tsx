"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3, Download, RefreshCw } from "lucide-react";
import KPICards from "@/components/analytics/KPICards";
import RevenueChart from "@/components/analytics/RevenueChart";
import TopProducts from "@/components/analytics/TopProducts";
import CategoryBreakdown from "@/components/analytics/CategoryBreakdown";
import RecentTransactions from "@/components/analytics/RecentTransactions";
import SystemStatus from "@/components/analytics/SystemStatus";
import {
  generateDailyData,
  generateMonthlyData,
  getKPIData,
} from "@/lib/analytics-data";

export default function AnalyticsPage() {
  const dailyData   = useMemo(() => generateDailyData(),   []);
  const monthlyData = useMemo(() => generateMonthlyData(), []);
  const kpi         = useMemo(() => getKPIData(dailyData), [dailyData]);

  const now = new Date("2026-06-02");
  const dateLabel = now.toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Page header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
        style={{ background: "#ffffff", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "var(--brand-light)" }}
          >
            <BarChart3 size={18} style={{ color: "var(--brand-dark)" }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
              Analytics Dashboard
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
              {dateLabel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* System sync status */}
          <SystemStatus />

          {/* Export */}
          <motion.button
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
            style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <Download size={14} />
            Export Report
          </motion.button>

          {/* Refresh */}
          <motion.button
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ rotate: 180, scale: 0.95 }}
            transition={{ duration: 0.35 }}
          >
            <RefreshCw size={15} />
          </motion.button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* KPI row */}
        <KPICards data={kpi} />

        {/* Revenue chart — full width */}
        <RevenueChart dailyData={dailyData} monthlyData={monthlyData} />

        {/* Middle row: Top Products + Category breakdown */}
        <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 340px" }}>
          <TopProducts />
          <CategoryBreakdown />
        </div>

        {/* Bottom: Recent transactions */}
        <RecentTransactions />

        {/* Bottom spacer */}
        <div className="h-4" />
      </div>
    </div>
  );
}
