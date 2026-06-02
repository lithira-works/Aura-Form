"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Package,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  Globe,
  Clock,
  TrendingUp,
  Plus,
  CheckCircle,
  Truck,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { SUPPLIERS } from "@/lib/inventory-data";
import type { Supplier, OrderRecord } from "@/lib/inventory-data";

const STATUS_CONFIG: Record<
  Supplier["status"],
  { label: string; bg: string; color: string }
> = {
  active: { label: "Active", bg: "#f0fdf4", color: "#16a34a" },
  inactive: { label: "Inactive", bg: "#f3f4f6", color: "#6b7280" },
  on_hold: { label: "On Hold", bg: "#fff7ed", color: "#ea580c" },
};

const ORDER_STATUS_CONFIG: Record<
  OrderRecord["status"],
  { label: string; icon: React.ReactNode; bg: string; color: string }
> = {
  delivered: { label: "Delivered", icon: <CheckCircle size={11} />, bg: "#f0fdf4", color: "#16a34a" },
  in_transit: { label: "In Transit", icon: <Truck size={11} />, bg: "#eff6ff", color: "#2563eb" },
  pending: { label: "Pending", icon: <Clock size={11} />, bg: "#fefce8", color: "#ca8a04" },
  cancelled: { label: "Cancelled", icon: <XCircle size={11} />, bg: "#fee2e2", color: "#dc2626" },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={11}
          fill={i < Math.floor(rating) ? "var(--brand)" : "none"}
          style={{ color: i < Math.floor(rating) ? "var(--brand)" : "var(--border)" }}
        />
      ))}
      <span className="text-xs ml-1 font-medium" style={{ color: "var(--text-secondary)" }}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

function SupplierCard({ supplier }: { supplier: Supplier }) {
  const [expanded, setExpanded] = useState(false);
  const statusCfg = STATUS_CONFIG[supplier.status];
  const margin = `₹${(supplier.totalSpend / 100000).toFixed(1)}L`;

  return (
    <motion.div
      layout
      className="rounded-2xl overflow-hidden"
      style={{
        background: "#ffffff",
        boxShadow: "var(--shadow-sm)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Card header */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Logo */}
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)" }}
          >
            {supplier.initials}
          </div>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-semibold text-base" style={{ color: "var(--text)" }}>
                {supplier.name}
              </h3>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: statusCfg.bg, color: statusCfg.color }}
              >
                {statusCfg.label}
              </span>
            </div>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
              {supplier.contactPerson}
            </p>
            <StarRating rating={supplier.rating} />
          </div>
        </div>

        {/* Contact strip */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <a
            href={`mailto:${supplier.email}`}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
            style={{ background: "var(--bg)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
          >
            <Mail size={12} style={{ color: "var(--brand-dark)" }} />
            <span className="truncate">{supplier.email}</span>
          </a>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
            style={{ background: "var(--bg)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
          >
            <Phone size={12} style={{ color: "var(--brand-dark)" }} />
            <span className="truncate">{supplier.phone}</span>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
            style={{ background: "var(--bg)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
          >
            <Globe size={12} style={{ color: "var(--brand-dark)" }} />
            <span>{supplier.country}</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mt-3">
          {[
            { label: "Lead Time", value: `${supplier.leadTimeDays} days`, icon: <Clock size={13} /> },
            { label: "Payment", value: supplier.paymentTerms, icon: <TrendingUp size={13} /> },
            { label: "Orders", value: supplier.totalOrders, icon: <Package size={13} /> },
            { label: "Total Spend", value: margin, icon: <TrendingUp size={13} /> },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-1 p-3 rounded-xl"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-1" style={{ color: "var(--brand-dark)" }}>
                {stat.icon}
                <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
                  {stat.label}
                </span>
              </div>
              <p className="text-sm font-bold" style={{ color: "var(--text)" }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Category tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {supplier.categories.map((c) => (
            <span
              key={c}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full"
              style={{ background: "var(--brand-light)", color: "var(--brand-dark)" }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Order history toggle */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium"
          style={{ color: "var(--text-secondary)", background: "var(--bg)" }}
        >
          <span className="flex items-center gap-2">
            <Package size={14} style={{ color: "var(--brand-dark)" }} />
            Order History ({supplier.orderHistory.length} orders)
          </span>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-4 space-y-2">
                {supplier.orderHistory.map((order) => {
                  const cfg = ORDER_STATUS_CONFIG[order.status];
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between px-4 py-3 rounded-xl"
                      style={{ background: "#ffffff", border: "1px solid var(--border)" }}
                    >
                      <div className="flex items-center gap-3">
                        <code
                          className="text-xs font-mono font-bold px-2 py-0.5 rounded"
                          style={{ background: "var(--brand-light)", color: "var(--brand-dark)" }}
                        >
                          {order.id}
                        </code>
                        <div>
                          <p className="text-xs font-medium" style={{ color: "var(--text)" }}>
                            {order.items} items
                          </p>
                          <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
                            {order.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                          ₹{order.amount.toLocaleString("en-IN")}
                        </p>
                        <span
                          className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                          style={{ background: cfg.bg, color: cfg.color }}
                        >
                          {cfg.icon}
                          {cfg.label}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function SuppliersPanel() {
  const activeCount = SUPPLIERS.filter((s) => s.status === "active").length;
  const onHoldCount = SUPPLIERS.filter((s) => s.status === "on_hold").length;
  const totalSpend = SUPPLIERS.reduce((s, sup) => s + sup.totalSpend, 0);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Summary bar */}
      <div
        className="flex items-center gap-6 px-6 py-4 border-b"
        style={{ background: "#ffffff", borderColor: "var(--border)" }}
      >
        {[
          { label: "Total Suppliers", value: SUPPLIERS.length, color: "var(--text)" },
          { label: "Active", value: activeCount, color: "#16a34a" },
          { label: "On Hold", value: onHoldCount, color: "#ea580c" },
          {
            label: "Lifetime Spend",
            value: `₹${(totalSpend / 100000).toFixed(1)}L`,
            color: "var(--brand-dark)",
          },
        ].map((s) => (
          <div key={s.label}>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{s.label}</p>
            <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
        <div className="flex-1" />
        <motion.button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{
            background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)",
            boxShadow: "0 4px 14px rgba(242,167,185,0.4)",
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Plus size={15} strokeWidth={2.5} />
          Add Supplier
        </motion.button>
      </div>

      {/* Supplier cards */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {SUPPLIERS.map((supplier, i) => (
          <motion.div
            key={supplier.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <SupplierCard supplier={supplier} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
