"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Tag,
  CreditCard,
  Banknote,
  QrCode,
  ChevronRight,
  X,
  ReceiptText,
  Percent,
} from "lucide-react";
import { TAX_RATE } from "@/lib/mock-data";
import type { Product } from "@/lib/mock-data";
import { formatLKR } from "@/lib/currency";

export interface CartItem {
  product: Product;
  qty: number;
}

type PaymentMethod = "cash" | "card" | "qr";

interface CartSidebarProps {
  items: CartItem[];
  onUpdateQty: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
}

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  { id: "cash", label: "Cash", icon: <Banknote size={16} /> },
  { id: "card", label: "Card", icon: <CreditCard size={16} /> },
  { id: "qr", label: "QR Pay", icon: <QrCode size={16} /> },
];

export default function CartSidebar({
  items,
  onUpdateQty,
  onRemove,
  onClear,
}: CartSidebarProps) {
  const [discount, setDiscount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const discountVal = Math.min(
    parseFloat(discount || "0") / 100,
    1
  );
  const discountAmount = subtotal * discountVal;
  const taxable = subtotal - discountAmount;
  const tax = taxable * TAX_RATE;
  const total = taxable + tax;

  const handleCheckout = () => {
    if (items.length === 0) return;
    setCheckoutSuccess(true);
    setTimeout(() => {
      setCheckoutSuccess(false);
      onClear();
      setDiscount("");
    }, 2200);
  };

  return (
    <aside
      className="flex flex-col h-full border-l shrink-0 w-[280px] min-w-[260px] max-w-[34vw] xl:w-[320px] 2xl:w-[340px]"
      style={{
        background: "#ffffff",
        borderColor: "var(--border)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b shrink-0"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <ShoppingBag size={18} style={{ color: "var(--brand-dark)" }} />
          <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>
            Current Order
          </span>
          {items.length > 0 && (
            <motion.span
              key={items.length}
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-semibold text-white"
              style={{ background: "var(--brand)" }}
            >
              {items.reduce((s, i) => s + i.qty, 0)}
            </motion.span>
          )}
        </div>
        {items.length > 0 && (
          <motion.button
            onClick={onClear}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors"
            style={{ color: "#dc2626", background: "#fef2f2" }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <X size={11} />
            Clear
          </motion.button>
        )}
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        <AnimatePresence initial={false}>
          {items.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-48 gap-3"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "var(--brand-light)" }}
              >
                <ShoppingBag size={24} style={{ color: "var(--brand)" }} />
              </div>
              <p className="text-sm text-center" style={{ color: "var(--text-secondary)" }}>
                Tap a product or scan<br />a barcode to begin
              </p>
            </motion.div>
          ) : (
            items.map((item) => (
              <motion.div
                key={item.product.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                }}
              >
                {/* Emoji */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: "var(--brand-light)" }}
                >
                  {item.product.emoji}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate leading-none"
                    style={{ color: "var(--text)" }}
                  >
                    {item.product.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                    {formatLKR(item.product.price)}
                    {item.product.shade && ` · ${item.product.shade}`}
                  </p>
                </div>

                {/* Qty controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <motion.button
                    onClick={() => onUpdateQty(item.product.id, item.qty - 1)}
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: "var(--brand-light)", color: "var(--brand-dark)" }}
                    whileTap={{ scale: 0.85 }}
                  >
                    <Minus size={11} strokeWidth={2.5} />
                  </motion.button>
                  <span
                    className="w-6 text-center text-sm font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {item.qty}
                  </span>
                  <motion.button
                    onClick={() => onUpdateQty(item.product.id, item.qty + 1)}
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: "var(--brand)", color: "#fff" }}
                    whileTap={{ scale: 0.85 }}
                    disabled={item.qty >= item.product.stock}
                  >
                    <Plus size={11} strokeWidth={2.5} />
                  </motion.button>
                </div>

                {/* Line total */}
                <div className="text-right shrink-0 min-w-[52px]">
                  <p className="text-sm font-bold" style={{ color: "var(--text)" }}>
                    {formatLKR(item.product.price * item.qty)}
                  </p>
                  <motion.button
                    onClick={() => onRemove(item.product.id)}
                    className="mt-0.5"
                    whileTap={{ scale: 0.8 }}
                  >
                    <Trash2 size={12} style={{ color: "#dc2626", opacity: 0.7 }} />
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Bottom panel */}
      <div
        className="shrink-0 border-t p-4 space-y-3"
        style={{ borderColor: "var(--border)" }}
      >
        {/* Discount input */}
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
          style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
        >
          <Tag size={14} style={{ color: "var(--brand-dark)" }} />
          <input
            type="number"
            min="0"
            max="100"
            placeholder="Discount %"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none"
            style={{ color: "var(--text)" }}
          />
          <Percent size={13} style={{ color: "var(--text-secondary)" }} />
        </div>

        {/* Summary */}
        <div className="space-y-1.5 px-1">
          <div className="flex justify-between text-sm" style={{ color: "var(--text-secondary)" }}>
            <span>Subtotal</span>
            <span>{formatLKR(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex justify-between text-sm"
              style={{ color: "#16a34a" }}
            >
              <span>Discount ({discount}%)</span>
              <span>−{formatLKR(discountAmount)}</span>
            </motion.div>
          )}
          <div className="flex justify-between text-sm" style={{ color: "var(--text-secondary)" }}>
            <span>VAT ({(TAX_RATE * 100).toFixed(0)}%)</span>
            <span>{formatLKR(tax)}</span>
          </div>
          <div
            className="flex justify-between font-bold text-base pt-2 border-t"
            style={{ color: "var(--text)", borderColor: "var(--border)" }}
          >
            <span>Total</span>
            <motion.span key={total}>
              {formatLKR(total)}
            </motion.span>
          </div>
        </div>

        {/* Payment method */}
        <div className="flex gap-2">
          {PAYMENT_METHODS.map((m) => (
            <motion.button
              key={m.id}
              onClick={() => setPaymentMethod(m.id)}
              className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-medium transition-colors"
              style={{
                background: paymentMethod === m.id ? "var(--brand-light)" : "var(--bg)",
                color: paymentMethod === m.id ? "var(--brand-dark)" : "var(--text-secondary)",
                border: paymentMethod === m.id
                  ? "1.5px solid var(--brand)"
                  : "1px solid var(--border)",
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {m.icon}
              {m.label}
            </motion.button>
          ))}
        </div>

        {/* Checkout button */}
        <motion.button
          onClick={handleCheckout}
          disabled={items.length === 0}
          className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 relative overflow-hidden"
          style={{
            background: items.length === 0
              ? "#e5e7eb"
              : "linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)",
            color: items.length === 0 ? "#9ca3af" : "#fff",
            boxShadow: items.length === 0 ? "none" : "0 6px 20px rgba(242,167,185,0.45)",
          }}
          whileHover={items.length > 0 ? { scale: 1.01 } : {}}
          whileTap={items.length > 0 ? { scale: 0.98 } : {}}
        >
          <AnimatePresence mode="wait">
            {checkoutSuccess ? (
              <motion.span
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                ✓ Order Complete!
              </motion.span>
            ) : (
              <motion.span
                key="default"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <ReceiptText size={16} />
                Charge {formatLKR(total)}
                <ChevronRight size={16} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </aside>
  );
}
