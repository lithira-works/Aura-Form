"use client";

import { motion } from "framer-motion";
import { Gift, TrendingUp, Star } from "lucide-react";
import { formatLKRCompact } from "@/lib/currency";
import TierBadge from "./TierBadge";
import {
  TIER_CONFIG,
  getNextTier,
  pointsToNextTier,
} from "@/lib/customers-data";
import type { Customer } from "@/lib/customers-data";

interface LoyaltyCardProps {
  customer: Customer;
}

export default function LoyaltyCard({ customer }: LoyaltyCardProps) {
  const cfg = TIER_CONFIG[customer.tier];
  const nextTier = getNextTier(customer.tier);
  const toNext = pointsToNextTier(customer.points, customer.tier);
  const nextCfg = nextTier ? TIER_CONFIG[nextTier] : null;

  const progressPct = nextTier
    ? Math.min(100,
        ((customer.points - cfg.minPoints) /
          (TIER_CONFIG[nextTier].minPoints - cfg.minPoints)) *
          100
      )
    : 100;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${cfg.bg} 0%, #ffffff 70%)`,
        border: `1.5px solid ${cfg.border}`,
        boxShadow: "var(--shadow-md)",
      }}
    >
      {/* Top section */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: cfg.color, opacity: 0.7 }}>
              Loyalty Status
            </p>
            <TierBadge tier={customer.tier} size="lg" animated />
          </div>
          <div className="text-right">
            <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
              Points Balance
            </p>
            <motion.p
              key={customer.points}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl font-black"
              style={{ color: cfg.color }}
            >
              {customer.points.toLocaleString("en-US")}
            </motion.p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>pts</p>
          </div>
        </div>

        {/* Progress to next tier */}
        {nextTier && nextCfg && toNext !== null && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                Progress to {nextTier} Tier {nextCfg.emoji}
              </span>
              <span className="text-xs font-semibold" style={{ color: nextCfg.color }}>
                {toNext.toLocaleString("en-US")} pts to go
              </span>
            </div>
            <div className="relative h-3 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${cfg.color}, ${nextCfg.color})`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              {/* Shine */}
              <motion.div
                className="absolute inset-y-0 w-8 rounded-full"
                style={{ background: "rgba(255,255,255,0.5)" }}
                animate={{ x: ["-32px", "200px"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
              />
            </div>
          </div>
        )}

        {!nextTier && (
          <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(0,0,0,0.04)" }}>
            <Star size={14} style={{ color: cfg.color }} fill={cfg.color} />
            <span className="text-xs font-medium" style={{ color: cfg.color }}>
              Maximum tier reached — Diamond member!
            </span>
          </div>
        )}
      </div>

      {/* Perks */}
      <div style={{ borderTop: `1px solid ${cfg.border}`, background: "rgba(255,255,255,0.7)" }}>
        <div className="px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: cfg.color, opacity: 0.7 }}>
            {customer.tier} Tier Perks
          </p>
          <div className="flex flex-wrap gap-2">
            {cfg.perks.map((perk) => (
              <span
                key={perk}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium"
                style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
              >
                <Gift size={11} />
                {perk}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div
        className="grid grid-cols-3 divide-x"
        style={{ borderTop: `1px solid ${cfg.border}` }}
      >
        {[
          { label: "Total Spent", value: formatLKRCompact(customer.totalSpent) },
          { label: "Purchases", value: customer.purchaseCount },
          { label: "Last Visit", value: new Date(customer.lastVisit).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) },
        ].map((s) => (
          <div key={s.label} className="flex flex-col items-center py-3 gap-0.5">
            <p className="text-lg font-bold" style={{ color: "var(--text)" }}>{s.value}</p>
            <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
