"use client";

import { motion } from "framer-motion";
import { CreditCard, Banknote, QrCode, Clock } from "lucide-react";
import { RECENT_TRANSACTIONS } from "@/lib/analytics-data";
import type { Transaction } from "@/lib/analytics-data";
import { formatLKR } from "@/lib/currency";

const METHOD_CFG: Record<Transaction["method"], { icon: React.ReactNode; label: string; bg: string; color: string }> = {
  card: { icon: <CreditCard size={11} />, label: "Card",    bg: "#eff6ff", color: "#2563eb" },
  cash: { icon: <Banknote  size={11} />, label: "Cash",    bg: "#f0fdf4", color: "#16a34a" },
  upi:  { icon: <QrCode   size={11} />, label: "QR Pay",  bg: "#fdf4ff", color: "#a855f7" },
};

export default function RecentTransactions() {
  const totalToday = RECENT_TRANSACTIONS.reduce((s, t) => s + t.total, 0);

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ background: "#ffffff", boxShadow: "var(--shadow-md)", border: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2">
          <Clock size={16} style={{ color: "var(--brand-dark)" }} />
          <h3 className="font-bold text-base" style={{ color: "var(--text)" }}>Recent Transactions</h3>
        </div>
        <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
          Today · {formatLKR(totalToday)}
        </span>
      </div>

      {/* List */}
      <div className="flex flex-col divide-y" style={{ borderColor: "var(--border)" }}>
        {RECENT_TRANSACTIONS.map((txn, i) => {
          const m = METHOD_CFG[txn.method];
          return (
            <motion.div
              key={txn.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#fafafc] transition-colors"
              style={{ borderColor: "var(--border)" }}
            >
              {/* Method icon */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: m.bg, color: m.color }}
              >
                {m.icon}
              </div>

              {/* Customer + ID */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold truncate leading-none" style={{ color: "var(--text)" }}>
                    {txn.customer ?? "Walk-in Customer"}
                  </p>
                  {txn.points && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: "#f0fdf4", color: "#16a34a" }}>
                      +{txn.points}pts
                    </span>
                  )}
                </div>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                  <code className="text-[10px]">{txn.id}</code> · {txn.items} item{txn.items > 1 ? "s" : ""} · {txn.cashier}
                </p>
              </div>

              {/* Time */}
              <p className="text-xs shrink-0" style={{ color: "var(--text-secondary)" }}>
                {txn.time}
              </p>

              {/* Amount */}
              <div className="text-right shrink-0">
                <p className="text-sm font-bold" style={{ color: "var(--text)" }}>
                  {formatLKR(txn.total)}
                </p>
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ background: m.bg, color: m.color }}
                >
                  {m.icon} {m.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center py-3 border-t" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
        <button className="text-xs font-semibold" style={{ color: "var(--brand-dark)" }}>
          View all transactions →
        </button>
      </div>
    </div>
  );
}
