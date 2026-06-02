"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  PackageX,
  ShoppingCart,
  CheckCircle,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import type { StockAlert } from "@/lib/alerts-data";

interface LowStockSectionProps {
  alerts: StockAlert[];
}

function StockMeter({ current, threshold }: { current: number; threshold: number }) {
  const pct = threshold === 0 ? 0 : Math.min(100, (current / (threshold * 2)) * 100);
  const color = current === 0 ? "#FF3B30" : "#FF9F0A";
  return (
    <div className="flex items-center gap-2 flex-1">
      <div
        className="flex-1 h-1.5 rounded-full overflow-hidden"
        style={{ background: "#f3f4f6" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
      <span
        className="text-xs font-bold w-5 text-right tabular-nums"
        style={{ color }}
      >
        {current}
      </span>
    </div>
  );
}

export default function LowStockSection({ alerts }: LowStockSectionProps) {
  const [reordered, setReordered] = useState<Set<string>>(new Set());

  const outOfStock = alerts.filter((a) => a.isOutOfStock);
  const lowStock = alerts.filter((a) => !a.isOutOfStock);

  const handleReorder = (id: string) => {
    setReordered((s) => new Set([...s, id]));
  };

  const renderRow = (alert: StockAlert) => {
    const done = reordered.has(alert.product.id);
    return (
      <motion.div
        key={alert.product.id}
        layout
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0 }}
        className="flex items-center gap-4 px-5 py-4 border-b last:border-0 group"
        style={{ borderColor: "var(--border)" }}
      >
        {/* Emoji icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{
            background: alert.isOutOfStock ? "#fff1f0" : "#fff8ed",
          }}
        >
          {alert.product.emoji}
        </div>

        {/* Product info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>
              {alert.product.name}
            </p>
            {alert.isOutOfStock ? (
              <span
                className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                style={{ background: "#fff1f0", color: "#FF3B30", border: "1px solid #ffc5c2" }}
              >
                <PackageX size={9} />
                Out of Stock
              </span>
            ) : (
              <span
                className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                style={{ background: "#fff8ed", color: "#FF9F0A", border: "1px solid #fde8b4" }}
              >
                <AlertTriangle size={9} />
                Low Stock
              </span>
            )}
          </div>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
            {alert.product.brand} · {alert.product.sku} · {alert.product.supplierName}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <StockMeter current={alert.currentStock} threshold={alert.threshold} />
            <span className="text-xs whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
              Min: {alert.threshold}
            </span>
          </div>
        </div>

        {/* Reorder qty */}
        <div className="text-right flex-shrink-0 hidden sm:block">
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Reorder</p>
          <p className="text-sm font-bold" style={{ color: "var(--text)" }}>
            {alert.reorderQty} units
          </p>
        </div>

        {/* Quick Reorder button */}
        <motion.button
          onClick={() => handleReorder(alert.product.id)}
          disabled={done}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold flex-shrink-0 transition-all"
          style={{
            background: done ? "#f0fdf4" : "#fff8ed",
            color: done ? "#16a34a" : "#FF9F0A",
            border: `1.5px solid ${done ? "#bbf7d0" : "#fde8b4"}`,
          }}
          whileHover={!done ? { scale: 1.04 } : {}}
          whileTap={!done ? { scale: 0.96 } : {}}
        >
          {done ? (
            <>
              <CheckCircle size={13} /> Ordered
            </>
          ) : (
            <>
              <ShoppingCart size={13} /> Reorder
            </>
          )}
        </motion.button>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Out of stock */}
      {outOfStock.length > 0 && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "#ffffff",
            boxShadow: "var(--shadow-md)",
            border: "1px solid #ffc5c2",
          }}
        >
          <div
            className="flex items-center justify-between px-5 py-4 border-b"
            style={{ background: "#fff1f0", borderColor: "#ffc5c2" }}
          >
            <div className="flex items-center gap-2">
              <PackageX size={16} style={{ color: "#FF3B30" }} />
              <span className="font-semibold text-sm" style={{ color: "#FF3B30" }}>
                Out of Stock
              </span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                style={{ background: "#FF3B30" }}
              >
                {outOfStock.length}
              </span>
            </div>
            <button className="flex items-center gap-1 text-xs" style={{ color: "#FF3B30" }}>
              Reorder All <ChevronRight size={13} />
            </button>
          </div>
          <AnimatePresence>{outOfStock.map(renderRow)}</AnimatePresence>
        </div>
      )}

      {/* Low stock */}
      {lowStock.length > 0 && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "#ffffff",
            boxShadow: "var(--shadow-md)",
            border: "1px solid #fde8b4",
          }}
        >
          <div
            className="flex items-center justify-between px-5 py-4 border-b"
            style={{ background: "#fff8ed", borderColor: "#fde8b4" }}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} style={{ color: "#FF9F0A" }} />
              <span className="font-semibold text-sm" style={{ color: "#FF9F0A" }}>
                Low Stock Warning
              </span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                style={{ background: "#FF9F0A" }}
              >
                {lowStock.length}
              </span>
            </div>
            <button className="flex items-center gap-1 text-xs" style={{ color: "#FF9F0A" }}>
              View in Inventory <ArrowUpRight size={13} />
            </button>
          </div>
          <AnimatePresence>{lowStock.map(renderRow)}</AnimatePresence>
        </div>
      )}

      {alerts.length === 0 && (
        <div
          className="flex flex-col items-center justify-center gap-3 py-16 rounded-2xl"
          style={{ background: "#ffffff", border: "1px solid var(--border)" }}
        >
          <CheckCircle size={32} style={{ color: "#16a34a" }} />
          <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>
            All stock levels are healthy!
          </p>
        </div>
      )}
    </div>
  );
}
