"use client";

import { motion } from "framer-motion";
import { Package, AlertTriangle, TrendingUp, Truck } from "lucide-react";
import type { InventoryProduct } from "@/lib/inventory-data";

interface StatsBarProps {
  products: InventoryProduct[];
}

export default function StatsBar({ products }: StatsBarProps) {
  const totalProducts = products.length;
  const lowStock = products.filter(
    (p) => p.stock > 0 && p.stock <= p.lowStockThreshold
  ).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const inventoryValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const todayStr = new Date().toISOString().split("T")[0];
  const expiringSoon = products.filter((p) => {
    if (!p.expiryDate) return false;
    const diff =
      (new Date(p.expiryDate).getTime() - new Date(todayStr).getTime()) /
      (1000 * 60 * 60 * 24);
    return diff <= 90 && diff > 0;
  }).length;

  const stats = [
    {
      label: "Total SKUs",
      value: totalProducts,
      icon: Package,
      color: "#6366f1",
      bg: "#eef2ff",
      suffix: " items",
    },
    {
      label: "Low Stock",
      value: lowStock,
      icon: AlertTriangle,
      color: "#ea580c",
      bg: "#fff7ed",
      suffix: " products",
    },
    {
      label: "Expiring Soon",
      value: expiringSoon,
      icon: AlertTriangle,
      color: "#dc2626",
      bg: "#fef2f2",
      suffix: " (90 days)",
    },
    {
      label: "Inventory Value",
      value: `₹${(inventoryValue / 100000).toFixed(1)}L`,
      icon: TrendingUp,
      color: "#16a34a",
      bg: "#f0fdf4",
      suffix: "",
    },
    {
      label: "Active Suppliers",
      value: 5,
      icon: Truck,
      color: "var(--brand-dark)",
      bg: "var(--brand-light)",
      suffix: " vendors",
    },
  ];

  return (
    <div className="flex gap-4 px-6 py-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="flex items-center gap-3 px-5 py-4 rounded-2xl flex-shrink-0 min-w-[180px]"
          style={{
            background: "#ffffff",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--border)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: stat.bg }}
          >
            <stat.icon size={18} style={{ color: stat.color }} />
          </div>
          <div>
            <p className="text-xs font-medium leading-none" style={{ color: "var(--text-secondary)" }}>
              {stat.label}
            </p>
            <p className="text-xl font-bold mt-1 leading-none" style={{ color: "var(--text)" }}>
              {stat.value}
              {stat.suffix && (
                <span className="text-xs font-normal ml-1" style={{ color: "var(--text-secondary)" }}>
                  {stat.suffix}
                </span>
              )}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
