"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Bell, AlertTriangle, CalendarClock, Settings2, PackageX } from "lucide-react";
import LowStockSection from "@/components/alerts/LowStockSection";
import ExpirySection from "@/components/alerts/ExpirySection";
import AlertSettings from "@/components/alerts/AlertSettings";
import {
  INVENTORY_PRODUCTS,
} from "@/lib/inventory-data";
import {
  DEFAULT_THRESHOLDS,
  computeStockAlerts,
  computeExpiryAlerts,
} from "@/lib/alerts-data";
import type { AlertThreshold } from "@/lib/alerts-data";

type Tab = "stock" | "expiry" | "settings";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "stock", label: "Low Stock", icon: <AlertTriangle size={14} /> },
  { id: "expiry", label: "Expiry Tracking", icon: <CalendarClock size={14} /> },
  { id: "settings", label: "Settings", icon: <Settings2 size={14} /> },
];

export default function AlertsPage() {
  const [tab, setTab] = useState<Tab>("stock");
  const [thresholds, setThresholds] = useState<AlertThreshold>(DEFAULT_THRESHOLDS);

  const stockAlerts = useMemo(
    () => computeStockAlerts(INVENTORY_PRODUCTS, thresholds),
    [thresholds]
  );
  const expiryAlerts = useMemo(
    () => computeExpiryAlerts(INVENTORY_PRODUCTS, thresholds),
    [thresholds]
  );

  const criticalCount =
    stockAlerts.filter((a) => a.isOutOfStock).length +
    expiryAlerts.filter((a) => a.band === "critical").length;

  const totalAlerts = stockAlerts.length + expiryAlerts.length;

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Page header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
        style={{ background: "#ffffff", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center relative"
            style={{ background: "var(--brand-light)" }}
          >
            <Bell size={18} style={{ color: "var(--brand-dark)" }} />
            {criticalCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                style={{ background: "#FF3B30" }}
              >
                {criticalCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
              Alerts &amp; Notifications
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
              {totalAlerts} active alerts · {criticalCount > 0 ? `${criticalCount} critical` : "All thresholds healthy"}
            </p>
          </div>
        </div>

        {/* Summary pills */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold" style={{ background: "#fff8ed", color: "#FF9F0A", border: "1px solid #fde8b4" }}>
            <AlertTriangle size={13} />
            {stockAlerts.length} stock alerts
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold" style={{ background: "#fff1f0", color: "#FF3B30", border: "1px solid #ffc5c2" }}>
            <CalendarClock size={13} />
            {expiryAlerts.length} expiry alerts
          </div>
        </div>
      </div>

      {/* Alert summary bar */}
      <div className="flex gap-4 px-6 py-4 flex-shrink-0 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {[
          {
            label: "Out of Stock",
            value: stockAlerts.filter((a) => a.isOutOfStock).length,
            icon: <PackageX size={16} />,
            color: "#FF3B30", bg: "#fff1f0",
          },
          {
            label: "Low Stock",
            value: stockAlerts.filter((a) => !a.isOutOfStock).length,
            icon: <AlertTriangle size={16} />,
            color: "#FF9F0A", bg: "#fff8ed",
          },
          {
            label: "Expiring < 30d",
            value: expiryAlerts.filter((a) => a.band === "critical").length,
            icon: <CalendarClock size={16} />,
            color: "#FF3B30", bg: "#fff1f0",
          },
          {
            label: "Expiring 30–60d",
            value: expiryAlerts.filter((a) => a.band === "warning").length,
            icon: <CalendarClock size={16} />,
            color: "#FF9F0A", bg: "#fff8ed",
          },
          {
            label: "Expiring 60–90d",
            value: expiryAlerts.filter((a) => a.band === "caution").length,
            icon: <CalendarClock size={16} />,
            color: "#ca8a04", bg: "#fefce8",
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl flex-shrink-0 min-w-[160px]"
            style={{ background: "#ffffff", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)" }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
              <span style={{ color: s.color }}>{s.icon}</span>
            </div>
            <div>
              <p className="text-xs font-medium leading-none" style={{ color: "var(--text-secondary)" }}>{s.label}</p>
              <p className="text-2xl font-bold mt-0.5 leading-none" style={{ color: s.value > 0 ? s.color : "#16a34a" }}>{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ height: "1px", background: "var(--border)", flexShrink: 0 }} />

      {/* Tab bar */}
      <div
        className="flex items-center gap-1 px-6 py-3 border-b flex-shrink-0"
        style={{ background: "#ffffff", borderColor: "var(--border)" }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors active:scale-[0.97] ${
              tab !== t.id ? "hover:bg-[var(--bg)]" : ""
            }`}
            style={{
              background: tab === t.id ? "var(--brand)" : "#ffffff",
              color: tab === t.id ? "#fff" : "var(--text-secondary)",
              boxShadow: tab === t.id ? "0 2px 8px rgba(242,167,185,0.35)" : "none",
            }}
          >
            {t.icon}
            {t.label}
            {t.id === "stock" && stockAlerts.length > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: tab === "stock" ? "rgba(255,255,255,0.3)" : "#fff8ed", color: tab === "stock" ? "#fff" : "#FF9F0A" }}>
                {stockAlerts.length}
              </span>
            )}
            {t.id === "expiry" && expiryAlerts.length > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: tab === "expiry" ? "rgba(255,255,255,0.3)" : "#fff1f0", color: tab === "expiry" ? "#fff" : "#FF3B30" }}>
                {expiryAlerts.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-6">
        {tab === "stock" && <LowStockSection alerts={stockAlerts} />}
        {tab === "expiry" && <ExpirySection alerts={expiryAlerts} />}
        {tab === "settings" && (
          <AlertSettings thresholds={thresholds} onChange={setThresholds} />
        )}
      </div>
    </div>
  );
}
