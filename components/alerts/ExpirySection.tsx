"use client";

import { motion } from "framer-motion";
import { CalendarClock, Flame, Clock, CheckCircle } from "lucide-react";
import { EXPIRY_BAND_CONFIG } from "@/lib/alerts-data";
import type { ExpiryAlert, ExpiryBand } from "@/lib/alerts-data";

interface ExpirySectionProps {
  alerts: ExpiryAlert[];
}

function ExpiryTag({ band }: { band: ExpiryBand }) {
  const cfg = EXPIRY_BAND_CONFIG[band];
  const Icon = band === "critical" ? Flame : Clock;
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
    >
      <Icon size={9} />
      {cfg.label}
    </span>
  );
}

function DaysCountdown({ days, band }: { days: number; band: ExpiryBand }) {
  const cfg = EXPIRY_BAND_CONFIG[band];
  const pct = Math.max(0, Math.min(100, (days / 90) * 100));
  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#f3f4f6" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: cfg.color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
      <span
        className="text-xs font-bold tabular-nums whitespace-nowrap"
        style={{ color: cfg.color }}
      >
        {days}d
      </span>
    </div>
  );
}

function BandGroup({
  band,
  alerts,
}: {
  band: ExpiryBand;
  alerts: ExpiryAlert[];
}) {
  if (alerts.length === 0) return null;
  const cfg = EXPIRY_BAND_CONFIG[band];

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "#ffffff",
        boxShadow: "var(--shadow-md)",
        border: `1px solid ${cfg.border}`,
      }}
    >
      {/* Band header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ background: cfg.bg, borderColor: cfg.border }}
      >
        <div className="flex items-center gap-2">
          <CalendarClock size={16} style={{ color: cfg.color }} />
          <span className="font-semibold text-sm" style={{ color: cfg.color }}>
            Expiring {cfg.label}
          </span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
            style={{ background: cfg.color }}
          >
            {alerts.length}
          </span>
        </div>
        {band === "critical" && (
          <span className="text-[11px] font-semibold animate-pulse" style={{ color: cfg.color }}>
            ⚠ Immediate action required
          </span>
        )}
      </div>

      {/* Rows */}
      {alerts.map((alert, i) => (
        <motion.div
          key={alert.product.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center gap-4 px-5 py-4 border-b last:border-0"
          style={{ borderColor: "var(--border)" }}
        >
          {/* Dot indicator */}
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: cfg.dot }}
          />

          {/* Emoji */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: cfg.bg }}
          >
            {alert.product.emoji}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>
                {alert.product.name}
              </p>
              <ExpiryTag band={alert.band} />
            </div>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
              {alert.product.brand} · {alert.product.sku} · Stock: {alert.product.stock}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <DaysCountdown days={alert.daysUntilExpiry} band={alert.band} />
            </div>
          </div>

          {/* Expiry date */}
          <div className="text-right flex-shrink-0">
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Expires
            </p>
            <p className="text-sm font-bold" style={{ color: cfg.color }}>
              {new Date(alert.expiryDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Action */}
          <motion.button
            className="px-3 py-2 rounded-xl text-xs font-semibold flex-shrink-0"
            style={{
              background: cfg.bg,
              color: cfg.color,
              border: `1.5px solid ${cfg.border}`,
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            {band === "critical" ? "Mark for Clearance" : "Review"}
          </motion.button>
        </motion.div>
      ))}
    </div>
  );
}

export default function ExpirySection({ alerts }: ExpirySectionProps) {
  const critical = alerts.filter((a) => a.band === "critical");
  const warning = alerts.filter((a) => a.band === "warning");
  const caution = alerts.filter((a) => a.band === "caution");

  if (alerts.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-3 py-16 rounded-2xl"
        style={{ background: "#ffffff", border: "1px solid var(--border)" }}
      >
        <CheckCircle size={32} style={{ color: "#16a34a" }} />
        <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>
          No products expiring within 90 days!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <BandGroup band="critical" alerts={critical} />
      <BandGroup band="warning" alerts={warning} />
      <BandGroup band="caution" alerts={caution} />
    </div>
  );
}
