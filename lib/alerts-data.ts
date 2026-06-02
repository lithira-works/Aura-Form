import { INVENTORY_PRODUCTS } from "./inventory-data";
import type { InventoryProduct } from "./inventory-data";

export interface AlertThreshold {
  categoryOverrides: Record<string, number>;
  globalThreshold: number;
  expiryWarningDays: number;
  expiryCriticalDays: number;
}

export const DEFAULT_THRESHOLDS: AlertThreshold = {
  globalThreshold: 5,
  categoryOverrides: {
    Face: 5,
    Eyes: 6,
    Lips: 8,
    "Skin Care": 4,
    Fragrance: 3,
    Nails: 10,
    Tools: 3,
  },
  expiryWarningDays: 90,
  expiryCriticalDays: 30,
};

export type ExpiryBand = "critical" | "warning" | "caution";

export interface ExpiryAlert {
  product: InventoryProduct;
  daysUntilExpiry: number;
  band: ExpiryBand;
  expiryDate: string;
}

export interface StockAlert {
  product: InventoryProduct;
  currentStock: number;
  threshold: number;
  deficit: number;
  reorderQty: number;
  isOutOfStock: boolean;
}

export function getEffectiveThreshold(
  product: InventoryProduct,
  thresholds: AlertThreshold
): number {
  return (
    thresholds.categoryOverrides[product.category] ?? thresholds.globalThreshold
  );
}

export function computeStockAlerts(
  products: InventoryProduct[],
  thresholds: AlertThreshold
): StockAlert[] {
  return products
    .filter((p) => {
      const t = getEffectiveThreshold(p, thresholds);
      return p.stock <= t;
    })
    .map((p) => {
      const threshold = getEffectiveThreshold(p, thresholds);
      return {
        product: p,
        currentStock: p.stock,
        threshold,
        deficit: Math.max(0, threshold - p.stock),
        reorderQty: p.reorderQty,
        isOutOfStock: p.stock === 0,
      };
    })
    .sort((a, b) => a.currentStock - b.currentStock);
}

export function computeExpiryAlerts(
  products: InventoryProduct[],
  thresholds: AlertThreshold
): ExpiryAlert[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return products
    .filter((p) => !!p.expiryDate)
    .map((p) => {
      const exp = new Date(p.expiryDate!);
      exp.setHours(0, 0, 0, 0);
      const days = Math.round(
        (exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      return { product: p, daysUntilExpiry: days, expiryDate: p.expiryDate! };
    })
    .filter((a) => a.daysUntilExpiry <= thresholds.expiryWarningDays)
    .map((a) => ({
      ...a,
      band:
        a.daysUntilExpiry <= thresholds.expiryCriticalDays
          ? ("critical" as ExpiryBand)
          : a.daysUntilExpiry <= 60
          ? ("warning" as ExpiryBand)
          : ("caution" as ExpiryBand),
    }))
    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
}

export const EXPIRY_BAND_CONFIG: Record<
  ExpiryBand,
  { label: string; bg: string; color: string; border: string; dot: string }
> = {
  critical: {
    label: "< 30 days",
    bg: "#fff1f0",
    color: "#FF3B30",
    border: "#ffc5c2",
    dot: "#FF3B30",
  },
  warning: {
    label: "30–60 days",
    bg: "#fff8ed",
    color: "#FF9F0A",
    border: "#fde8b4",
    dot: "#FF9F0A",
  },
  caution: {
    label: "60–90 days",
    bg: "#fefce8",
    color: "#ca8a04",
    border: "#fef08a",
    dot: "#ca8a04",
  },
};

export const ALL_STOCK_ALERTS = computeStockAlerts(
  INVENTORY_PRODUCTS,
  DEFAULT_THRESHOLDS
);
export const ALL_EXPIRY_ALERTS = computeExpiryAlerts(
  INVENTORY_PRODUCTS,
  DEFAULT_THRESHOLDS
);
