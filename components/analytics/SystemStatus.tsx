"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cloud,
  CloudOff,
  Monitor,
  Smartphone,
  Tablet,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import { TERMINALS } from "@/lib/analytics-data";
import type { Terminal } from "@/lib/analytics-data";

const TYPE_ICON: Record<Terminal["type"], React.ReactNode> = {
  web: <Monitor size={13} />,
  mobile: <Smartphone size={13} />,
  tablet: <Tablet size={13} />,
};

const STATUS_CFG: Record<
  Terminal["status"],
  { color: string; bg: string; label: string }
> = {
  synced: { color: "#16a34a", bg: "#dcfce7", label: "Synced" },
  syncing: { color: "#2563eb", bg: "#dbeafe", label: "Syncing…" },
  offline: { color: "#dc2626", bg: "#fee2e2", label: "Offline" },
};

export default function SystemStatus() {
  const [open, setOpen] = useState(false);
  const allSynced = TERMINALS.every((t) => t.status === "synced");
  const offlineCount = TERMINALS.filter((t) => t.status === "offline").length;
  const syncingCount = TERMINALS.filter((t) => t.status === "syncing").length;

  const overallStatus = allSynced ? "synced" : offlineCount > 0 ? "offline" : "syncing";
  const cfg = STATUS_CFG[overallStatus];

  return (
    <div className="relative">
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-medium"
        style={{
          background: cfg.bg,
          color: cfg.color,
          border: `1.5px solid ${cfg.color}33`,
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        {/* Pulsing dot */}
        <span className="relative flex items-center justify-center w-2.5 h-2.5">
          {overallStatus === "synced" && (
            <motion.span
              className="absolute inline-flex w-full h-full rounded-full opacity-75"
              style={{ background: cfg.color }}
              animate={{ scale: [1, 1.8, 1], opacity: [0.75, 0, 0.75] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
          <span className="relative inline-flex w-2.5 h-2.5 rounded-full" style={{ background: cfg.color }} />
        </span>

        {overallStatus === "synced" && (
          <><Cloud size={14} /> All terminals synced</>
        )}
        {overallStatus === "syncing" && (
          <motion.span className="flex items-center gap-1.5" animate={{ opacity: [1, 0.6, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
            <RefreshCw size={14} /> {syncingCount} syncing…
          </motion.span>
        )}
        {overallStatus === "offline" && (
          <><CloudOff size={14} /> {offlineCount} terminal{offlineCount > 1 ? "s" : ""} offline</>
        )}
        <ChevronDown size={13} style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-[340px] rounded-2xl overflow-hidden z-50"
            style={{ background: "#ffffff", boxShadow: "0 12px 40px rgba(0,0,0,0.12)", border: "1px solid var(--border)" }}
          >
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>
                Terminal Status
              </p>
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {TERMINALS.filter((t) => t.status === "synced").length}/{TERMINALS.length} online
              </span>
            </div>

            {TERMINALS.map((t) => {
              const scfg = STATUS_CFG[t.status];
              return (
                <div
                  key={t.id}
                  className="flex items-center gap-3 px-4 py-3 border-b last:border-0"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: scfg.bg, color: scfg.color }}
                  >
                    {TYPE_ICON[t.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{t.name}</p>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      {t.cashier !== "—" ? t.cashier : "Unattended"} · {t.transactionsToday} txns today
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: scfg.bg, color: scfg.color }}
                    >
                      {scfg.label}
                    </span>
                    <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
                      {t.lastSync}
                    </span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
