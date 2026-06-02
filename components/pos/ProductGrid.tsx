"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, AlertTriangle, Package } from "lucide-react";
import type { Product } from "@/lib/mock-data";
import { formatLKR } from "@/lib/currency";

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  lastAddedId: string | null;
}

function StockBadge({ stock, threshold }: { stock: number; threshold: number }) {
  if (stock === 0) {
    return (
      <span
        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
        style={{ background: "#fee2e2", color: "#dc2626" }}
      >
        Out of Stock
      </span>
    );
  }
  if (stock <= threshold) {
    return (
      <span
        className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
        style={{ background: "#fff7ed", color: "#ea580c" }}
      >
        <AlertTriangle size={9} />
        Low: {stock}
      </span>
    );
  }
  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: "#f0fdf4", color: "#16a34a" }}
    >
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
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      whileHover={!outOfStock ? { y: -3, boxShadow: "0 8px 24px rgba(242,167,185,0.25)" } : {}}
      className="relative flex flex-col rounded-2xl overflow-hidden cursor-pointer select-none"
      style={{
        background: "#ffffff",
        boxShadow: "var(--shadow-sm)",
        border: isLastAdded ? "1.5px solid var(--brand)" : "1px solid var(--border)",
        opacity: outOfStock ? 0.55 : 1,
      }}
      onClick={() => !outOfStock && onAdd(product)}
    >
      {/* Pulse ring on add */}
      <AnimatePresence>
        {isLastAdded && (
          <motion.div
            key="ring"
            className="absolute inset-0 rounded-2xl pointer-events-none z-10"
            initial={{ opacity: 0.7, scale: 1 }}
            animate={{ opacity: 0, scale: 1.05 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ border: "2px solid var(--brand)" }}
          />
        )}
      </AnimatePresence>

      {/* Product emoji hero */}
      <div
        className="flex items-center justify-center h-[90px] text-4xl relative"
        style={{ background: "var(--brand-light)" }}
      >
        <motion.span
          animate={isLastAdded ? { scale: [1, 1.25, 1] } : {}}
          transition={{ duration: 0.35 }}
        >
          {product.emoji}
        </motion.span>

        {/* Category chip */}
        <span
          className="absolute top-2 left-2 text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide"
          style={{ background: "rgba(255,255,255,0.75)", color: "var(--brand-dark)" }}
        >
          {product.category}
        </span>

        {/* Quick-add button */}
        {!outOfStock && (
          <motion.div
            className="absolute bottom-2 right-2 w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ background: "var(--brand)", boxShadow: "0 2px 8px rgba(242,167,185,0.5)" }}
            whileTap={{ scale: 0.85 }}
          >
            <Plus size={14} color="#fff" strokeWidth={2.5} />
          </motion.div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-3 flex-1">
        <p
          className="text-[11px] font-medium leading-none truncate"
          style={{ color: "var(--text-secondary)" }}
        >
          {product.brand}
        </p>
        <p
          className="text-sm font-semibold leading-tight line-clamp-2"
          style={{ color: "var(--text)" }}
        >
          {product.name}
          {product.shade && (
            <span className="font-normal text-xs" style={{ color: "var(--text-secondary)" }}>
              {" · "}{product.shade}
            </span>
          )}
        </p>

        <div className="flex items-center justify-between mt-auto pt-1">
          <p className="text-[13px] font-bold leading-none" style={{ color: "var(--text)" }}>
            {formatLKR(product.price)}
          </p>
          <StockBadge stock={product.stock} threshold={product.lowStockThreshold} />
        </div>
      </div>
    </motion.div>
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
    <div
      className="grid gap-4 p-6 overflow-y-auto flex-1"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
        alignContent: "start",
      }}
    >
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
