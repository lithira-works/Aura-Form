"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Trophy } from "lucide-react";
import { TOP_PRODUCTS } from "@/lib/analytics-data";

const RANK_STYLE = [
  { bg: "#fef9c3", color: "#ca8a04", label: "🥇" },
  { bg: "#f3f4f6", color: "#6b7280", label: "🥈" },
  { bg: "#fef3c7", color: "#d97706", label: "🥉" },
];

const CATEGORY_COLORS: Record<string, string> = {
  Face:      "#F2A7B9",
  Eyes:      "#60a5fa",
  Lips:      "#fb7185",
  "Skin Care": "#c084fc",
  Fragrance: "#a78bfa",
  Nails:     "#34d399",
  Tools:     "#fbbf24",
};

export default function TopProducts() {
  const maxUnits = Math.max(...TOP_PRODUCTS.map((p) => p.unitsSold));

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: "#ffffff", boxShadow: "var(--shadow-md)", border: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "var(--brand-light)" }}
          >
            <Trophy size={16} style={{ color: "var(--brand-dark)" }} />
          </div>
          <div>
            <h3 className="font-bold text-base leading-none" style={{ color: "var(--text)" }}>
              Top Selling Products
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
              by units sold · last 30 days
            </p>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {TOP_PRODUCTS.slice(0, 5).map((product, i) => {
          const rankStyle = RANK_STYLE[i] ?? { bg: "var(--bg)", color: "var(--text-secondary)", label: `${i + 1}` };
          const barPct = (product.unitsSold / maxUnits) * 100;
          const catColor = CATEGORY_COLORS[product.category] ?? "#F2A7B9";

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-3 group"
            >
              {/* Rank badge */}
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ background: rankStyle.bg, color: rankStyle.color }}
              >
                {i < 3 ? rankStyle.label : <span className="text-xs">{i + 1}</span>}
              </div>

              {/* Emoji */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: "var(--brand-light)" }}
              >
                {product.emoji}
              </div>

              {/* Info + bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate leading-none" style={{ color: "var(--text)" }}>
                      {product.name}
                    </p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-secondary)" }}>
                      {product.brand}
                      <span
                        className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium"
                        style={{ background: `${catColor}22`, color: catColor }}
                      >
                        {product.category}
                      </span>
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-sm font-bold leading-none" style={{ color: "var(--text)" }}>
                      {product.unitsSold}
                      <span className="text-xs font-normal ml-0.5" style={{ color: "var(--text-secondary)" }}>units</span>
                    </p>
                  </div>
                </div>

                {/* Bar */}
                <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: catColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${barPct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Revenue + trend */}
              <div className="text-right flex-shrink-0 w-24">
                <p className="text-sm font-bold leading-none" style={{ color: "var(--text)" }}>
                  ₹{(product.revenue / 1000).toFixed(0)}k
                </p>
                <div
                  className="flex items-center justify-end gap-0.5 mt-0.5 text-[11px] font-semibold"
                  style={{ color: product.trend >= 0 ? "#16a34a" : "#dc2626" }}
                >
                  {product.trend >= 0 ? (
                    <TrendingUp size={10} />
                  ) : (
                    <TrendingDown size={10} />
                  )}
                  {product.trend >= 0 ? "+" : ""}
                  {product.trend}%
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
