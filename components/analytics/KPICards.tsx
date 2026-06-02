"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Receipt,
  Calculator,
  UserPlus,
} from "lucide-react";
import type { KPIData } from "@/lib/analytics-data";
import { formatLKR } from "@/lib/currency";

interface KPICardsProps {
  data: KPIData;
}

interface Card {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  prefix?: string;
  suffix?: string;
  sublabel: string;
}

export default function KPICards({ data }: KPICardsProps) {
  const cards: Card[] = [
    {
      label: "Today's Revenue",
      value: formatLKR(data.todayRevenue),
      change: data.revenueChange,
      icon: <TrendingUp size={20} />,
      iconBg: "var(--brand-light)",
      iconColor: "var(--brand-dark)",
      sublabel: "vs. yesterday",
    },
    {
      label: "Total Transactions",
      value: String(data.todayTransactions),
      change: data.transactionsChange,
      icon: <Receipt size={20} />,
      iconBg: "#eff6ff",
      iconColor: "#2563eb",
      sublabel: "vs. yesterday",
    },
    {
      label: "Avg. Order Value",
      value: formatLKR(data.avgOrderValue),
      change: data.aovChange,
      icon: <Calculator size={20} />,
      iconBg: "#fdf4ff",
      iconColor: "#a855f7",
      sublabel: "vs. yesterday",
    },
    {
      label: "New Loyalty Signups",
      value: String(data.newLoyaltySignups),
      change: data.signupsChange,
      icon: <UserPlus size={20} />,
      iconBg: "#f0fdf4",
      iconColor: "#16a34a",
      sublabel: "vs. yesterday",
    },
  ];

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, type: "spring", stiffness: 260, damping: 24 }}
          whileHover={{
            y: -4,
            boxShadow: "0 12px 32px rgba(242,167,185,0.2)",
            transition: { duration: 0.2 },
          }}
          className="flex flex-col gap-4 p-5 rounded-2xl cursor-default"
          style={{
            background: "#ffffff",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--border)",
          }}
        >
          {/* Icon + change badge */}
          <div className="flex items-start justify-between">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: card.iconBg, color: card.iconColor }}
            >
              {card.icon}
            </div>
            <div
              className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
              style={{
                background: card.change >= 0 ? "#f0fdf4" : "#fef2f2",
                color: card.change >= 0 ? "#16a34a" : "#dc2626",
              }}
            >
              {card.change >= 0 ? (
                <TrendingUp size={11} />
              ) : (
                <TrendingDown size={11} />
              )}
              {card.change >= 0 ? "+" : ""}
              {card.change}%
            </div>
          </div>

          {/* Value */}
          <div>
            <motion.p
              key={card.value}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-2xl font-black tracking-tight"
              style={{ color: "var(--text)" }}
            >
              {card.value}
            </motion.p>
            <p className="text-sm font-medium mt-0.5" style={{ color: "var(--text-secondary)" }}>
              {card.label}
            </p>
          </div>

          {/* Sublabel */}
          <p className="text-xs" style={{ color: "var(--text-secondary)", opacity: 0.7 }}>
            {card.sublabel}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
