"use client";

import { AnimatePresence } from "framer-motion";
import {
  Plus,
  AlertTriangle,
  Package,
  Smile,
  Eye,
  Heart,
  Droplets,
  Wind,
  Palette,
  Scissors,
  Layers,
  type LucideIcon,
} from "lucide-react";
import type { Product } from "@/lib/mock-data";
import { formatLKR } from "@/lib/currency";
import "./product-cards.css";

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  lastAddedId: string | null;
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Face: Smile,
  Eyes: Eye,
  Lips: Heart,
  "Skin Care": Droplets,
  Fragrance: Wind,
  Nails: Palette,
  Tools: Scissors,
};

function CategoryIcon({ category }: { category: string }) {
  const Icon = CATEGORY_ICONS[category] ?? Layers;
  return <Icon size={22} strokeWidth={1.75} aria-hidden />;
}

function StockBadge({ stock, threshold }: { stock: number; threshold: number }) {
  if (stock === 0) {
    return (
      <span className="pos-product-card__badge pos-product-card__badge--out">
        Out of stock
      </span>
    );
  }
  if (stock <= threshold) {
    return (
      <span className="pos-product-card__badge pos-product-card__badge--low">
        <AlertTriangle size={10} strokeWidth={2.5} aria-hidden />
        Low: {stock}
      </span>
    );
  }
  return (
    <span className="pos-product-card__badge pos-product-card__badge--ok">
      {stock} in stock
    </span>
  );
}

function ProductCard({
  product,
  onAdd,
  isLastAdded,
}: {
  product: Product;
  onAdd: (p: Product) => void;
  isLastAdded: boolean;
}) {
  const outOfStock = product.stock === 0;

  return (
    <article
      role="button"
      tabIndex={outOfStock ? -1 : 0}
      className={[
        "pos-product-card",
        outOfStock ? "pos-product-card--disabled" : "",
        isLastAdded ? "pos-product-card--active" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => !outOfStock && onAdd(product)}
      onKeyDown={(e) => {
        if (!outOfStock && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onAdd(product);
        }
      }}
      aria-label={`${product.name}, ${formatLKR(product.price)}`}
    >
      {isLastAdded && <span className="pos-product-card__pulse" aria-hidden />}

      <div className="pos-product-card__media">
        <span className="pos-product-card__category">{product.category}</span>
        <div className="pos-product-card__icon-wrap">
          <CategoryIcon category={product.category} />
        </div>
        {!outOfStock && (
          <span className="pos-product-card__add" aria-hidden>
            <Plus size={14} strokeWidth={2.5} />
          </span>
        )}
      </div>

      <div className="pos-product-card__body">
        <p className="pos-product-card__brand">{product.brand}</p>

        <h3 className="pos-product-card__title" title={product.name}>
          {product.name}
        </h3>

        <p
          className={
            product.shade
              ? "pos-product-card__shade"
              : "pos-product-card__shade pos-product-card__shade--placeholder"
          }
          title={product.shade ?? undefined}
          aria-hidden={!product.shade}
        >
          {product.shade ?? "—"}
        </p>

        <div className="pos-product-card__spacer" aria-hidden />

        <footer className="pos-product-card__footer">
          <p className="pos-product-card__price">{formatLKR(product.price)}</p>
          <div className="pos-product-card__stock-row">
            <StockBadge stock={product.stock} threshold={product.lowStockThreshold} />
          </div>
        </footer>
      </div>
    </article>
  );
}

export default function ProductGrid({
  products,
  onAddToCart,
  lastAddedId,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: "var(--brand-light)" }}
        >
          <Package size={28} style={{ color: "var(--brand-dark)" }} />
        </div>
        <div className="text-center">
          <p className="font-semibold" style={{ color: "var(--text)" }}>
            No products found
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Try a different category or search term
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pos-product-grid">
      <AnimatePresence mode="popLayout">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={onAddToCart}
            isLastAdded={lastAddedId === product.id}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
