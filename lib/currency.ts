/**
 * Sri Lankan Rupee (LKR) formatting utilities for CosmoPOS.
 */

/** Full format: LKR 12,500 */
export const formatLKR = (amount: number): string =>
  `LKR ${Math.round(amount).toLocaleString("en-US")}`;

/** Compact format for charts/labels: LKR 12.5K / LKR 1.2M */
export const formatLKRCompact = (amount: number): string => {
  if (amount >= 1_000_000) return `LKR ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000)     return `LKR ${(amount / 1_000).toFixed(0)}K`;
  return `LKR ${Math.round(amount)}`;
};

/** Symbol-only compact for axes: 12.5K / 1.2M (no prefix, saves space) */
export const formatAxisLKR = (amount: number): string => {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000)     return `${(amount / 1_000).toFixed(0)}K`;
  return String(Math.round(amount));
};
