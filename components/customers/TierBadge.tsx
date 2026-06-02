"use client";

import { motion } from "framer-motion";
import { TIER_CONFIG } from "@/lib/customers-data";
import type { LoyaltyTier } from "@/lib/customers-data";

interface TierBadgeProps {
  tier: LoyaltyTier;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export default function TierBadge({ tier, size = "md", animated = false }: TierBadgeProps) {
  const cfg = TIER_CONFIG[tier];

  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    md: "text-xs px-3 py-1 gap-1.5",
    lg: "text-sm px-4 py-2 gap-2",
  };

  const emojiSize = { sm: "text-xs", md: "text-sm", lg: "text-base" };

  return (
    <motion.span
      className={`inline-flex items-center font-bold rounded-full ${sizeClasses[size]}`}
      style={{
        background: cfg.bg,
        color: cfg.color,
        border: `1.5px solid ${cfg.border}`,
      }}
      animate={
        animated
          ? { boxShadow: [`0 0 0 0 ${cfg.border}`, `0 0 0 6px transparent`] }
          : {}
      }
      transition={animated ? { duration: 1.5, repeat: Infinity } : {}}
    >
      <span className={emojiSize[size]}>{cfg.emoji}</span>
      {tier} Tier
    </motion.span>
  );
}
