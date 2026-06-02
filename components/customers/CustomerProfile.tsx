"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Phone,
  Mail,
  MapPin,
  Cake,
  Calendar,
  CreditCard,
  Banknote,
  QrCode,
  StickyNote,
  ArrowUpRight,
  ShoppingBag,
} from "lucide-react";
import LoyaltyCard from "./LoyaltyCard";
import TierBadge from "./TierBadge";
import type { Customer, Purchase } from "@/lib/customers-data";
import { formatLKR } from "@/lib/currency";

interface CustomerProfileProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

const PAY_ICONS: Record<Purchase["paymentMethod"], React.ReactNode> = {
  card: <CreditCard size={12} />,
  cash: <Banknote size={12} />,
  upi: <QrCode size={12} />,
};

function ReceiptCard({ purchase }: { purchase: Purchase }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
    >
      {/* Receipt header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2">
          <code className="text-xs font-mono font-bold px-2 py-0.5 rounded" style={{ background: "var(--brand-light)", color: "var(--brand-dark)" }}>
            {purchase.id}
          </code>
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            <Calendar size={11} className="inline mr-1" />
            {new Date(purchase.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: "white", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
            {PAY_ICONS[purchase.paymentMethod]}
            {purchase.paymentMethod.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="px-4 py-2 space-y-1.5">
        {purchase.items.map((item, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span style={{ color: "var(--text)" }}>
              {item.name}
              {item.qty > 1 && (
                <span className="text-xs ml-1" style={{ color: "var(--text-secondary)" }}>×{item.qty}</span>
              )}
            </span>
            <span className="font-medium" style={{ color: "var(--text)" }}>
              {formatLKR(item.price * item.qty)}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: "var(--border)", background: "white" }}>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: "#16a34a" }}>
          <span className="font-semibold">+{purchase.pointsEarned} pts</span>
          <span style={{ color: "var(--text-secondary)" }}>earned</span>
        </div>
        <div>
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Total: </span>
          <span className="text-sm font-bold" style={{ color: "var(--text)" }}>
            {formatLKR(purchase.total)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CustomerProfile({ customer, isOpen, onClose }: CustomerProfileProps) {
  return (
    <AnimatePresence>
      {isOpen && customer && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40"
            style={{ background: "rgba(29,29,31,0.3)", backdropFilter: "blur(3px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            key="panel"
            className="fixed top-0 right-0 bottom-0 z-50 flex flex-col overflow-hidden"
            style={{ width: "520px", background: "#ffffff", boxShadow: "-8px 0 40px rgba(0,0,0,0.12)" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b flex-shrink-0" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-base font-bold text-white flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)" }}
                >
                  {customer.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-base" style={{ color: "var(--text)" }}>{customer.name}</p>
                    <TierBadge tier={customer.tier} size="sm" />
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                    Member since {new Date(customer.joinDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" })} · #{customer.id}
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "var(--bg)", color: "var(--text-secondary)" }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={15} />
              </motion.button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Loyalty card */}
              <LoyaltyCard customer={customer} />

              {/* Contact info */}
              <div
                className="rounded-2xl p-4 space-y-3"
                style={{ background: "#ffffff", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
              >
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>
                  Contact Information
                </p>
                {[
                  { icon: <Phone size={13} />, value: customer.phone },
                  { icon: <Mail size={13} />, value: customer.email },
                  customer.address && { icon: <MapPin size={13} />, value: customer.address },
                  customer.dob && {
                    icon: <Cake size={13} />,
                    value: new Date(customer.dob).toLocaleDateString("en-GB", { day: "numeric", month: "long" }),
                  },
                ]
                  .filter(Boolean)
                  .map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm" style={{ color: "var(--text)" }}>
                      <span className="mt-0.5 flex-shrink-0" style={{ color: "var(--brand-dark)" }}>
                        {(item as { icon: React.ReactNode; value: string }).icon}
                      </span>
                      <span>{(item as { icon: React.ReactNode; value: string }).value}</span>
                    </div>
                  ))}

                {customer.notes && (
                  <div className="flex items-start gap-3 text-sm pt-2 border-t" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                    <StickyNote size={13} className="mt-0.5 flex-shrink-0" style={{ color: "var(--brand-dark)" }} />
                    <span className="italic">{customer.notes}</span>
                  </div>
                )}
              </div>

              {/* Purchase history */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>
                    Purchase History ({customer.purchases.length})
                  </p>
                  <button className="flex items-center gap-1 text-xs font-medium" style={{ color: "var(--brand-dark)" }}>
                    View all <ArrowUpRight size={12} />
                  </button>
                </div>
                {customer.purchases.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 rounded-2xl" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                    <ShoppingBag size={24} style={{ color: "var(--text-secondary)", opacity: 0.4 }} />
                    <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>No purchases yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {customer.purchases.map((p) => (
                      <ReceiptCard key={p.id} purchase={p} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

