"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PieChart as PieIcon } from "lucide-react";
import { CATEGORY_BREAKDOWN } from "@/lib/analytics-data";

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: { color: string; emoji: string } }[] }) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  return (
    <div
      className="rounded-xl px-4 py-2.5 text-sm shadow-xl"
      style={{ background: "#ffffff", border: "1px solid var(--border)", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}
    >
      <div className="flex items-center gap-2">
        <span>{entry.payload.emoji}</span>
        <span className="font-semibold" style={{ color: "var(--text)" }}>{entry.name}</span>
        <span className="font-bold" style={{ color: entry.payload.color }}>{entry.value}%</span>
      </div>
    </div>
  );
}

export default function CategoryBreakdown() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: "#ffffff", boxShadow: "var(--shadow-md)", border: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "var(--brand-light)" }}
        >
          <PieIcon size={16} style={{ color: "var(--brand-dark)" }} />
        </div>
        <div>
          <h3 className="font-bold text-base leading-none" style={{ color: "var(--text)" }}>
            Revenue by Category
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
            share of total · this month
          </p>
        </div>
      </div>

      {/* Donut + legend */}
      <div className="flex items-center gap-4">
        {/* Donut chart */}
        <div style={{ width: 160, height: 160, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={CATEGORY_BREAKDOWN}
                cx="50%"
                cy="50%"
                innerRadius={46}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                strokeWidth={0}
              >
                {CATEGORY_BREAKDOWN.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.35}
                    style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 flex-1">
          {CATEGORY_BREAKDOWN.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
              className="flex items-center gap-2 cursor-pointer"
              style={{ opacity: activeIndex === null || activeIndex === i ? 1 : 0.45, transition: "opacity 0.2s" }}
            >
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
              <span className="text-xs flex-1 font-medium" style={{ color: "var(--text)" }}>
                {item.emoji} {item.name}
              </span>
              <span className="text-xs font-bold" style={{ color: item.color }}>
                {item.value}%
              </span>
              {/* Mini bar */}
              <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: item.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value * 3.33}%` }}
                  transition={{ delay: i * 0.06 + 0.2, duration: 0.7, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
