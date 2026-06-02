"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, UserPlus, Check, Star, ChevronRight } from "lucide-react";
import TierBadge from "./TierBadge";
import { CUSTOMERS, calcPointsForAmount } from "@/lib/customers-data";
import type { Customer } from "@/lib/customers-data";
import { TIER_CONFIG } from "@/lib/customers-data";

interface CustomerAttachModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartTotal: number;
  onAttach: (customer: Customer) => void;
  attachedCustomer: Customer | null;
}

export default function CustomerAttachModal({
  isOpen,
  onClose,
  cartTotal,
  onAttach,
  attachedCustomer,
}: CustomerAttachModalProps) {
  const [search, setSearch] = useState("");
  const [confirming, setConfirming] = useState<Customer | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return CUSTOMERS;
    const q = search.toLowerCase();
    return CUSTOMERS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }, [search]);

  const earnPoints = calcPointsForAmount(cartTotal);
  const cfg = confirming ? TIER_CONFIG[confirming.tier] : null;

  const handleSelect = (c: Customer) => setConfirming(c);

  const handleConfirm = () => {
    if (confirming) {
      onAttach(confirming);
      setConfirming(null);
      setSearch("");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40"
            style={{ background: "rgba(29,29,31,0.45)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            key="modal"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
          >
            <div
              className="w-full max-w-md rounded-3xl overflow-hidden flex flex-col"
              style={{ background: "#ffffff", maxHeight: "80vh", boxShadow: "0 24px 60px rgba(0,0,0,0.15)" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b flex-shrink-0" style={{ borderColor: "var(--border)" }}>
                <div>
                  <p className="font-bold text-base" style={{ color: "var(--text)" }}>Attach Customer</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                    {cartTotal > 0
                      ? `This sale earns ${earnPoints} loyalty pts`
                      : "Link a customer to this sale"}
                  </p>
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

              {/* Points preview banner */}
              {cartTotal > 0 && (
                <div
                  className="flex items-center gap-3 px-5 py-3 flex-shrink-0"
                  style={{ background: "var(--brand-light)", borderBottom: "1px solid var(--brand)" }}
                >
                  <Star size={16} style={{ color: "var(--brand-dark)" }} fill="var(--brand)" />
                  <p className="text-sm font-semibold" style={{ color: "var(--brand-dark)" }}>
                    Attach a customer to award{" "}
                    <span className="font-black">{earnPoints} points</span>{" "}
                    on this ₹{cartTotal.toLocaleString("en-IN")} sale
                  </p>
                </div>
              )}

              {/* Currently attached */}
              {attachedCustomer && (
                <div
                  className="flex items-center gap-3 px-5 py-3 flex-shrink-0 border-b"
                  style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}
                >
                  <Check size={15} style={{ color: "#16a34a" }} />
                  <p className="text-sm font-medium flex-1" style={{ color: "#15803d" }}>
                    Currently: <span className="font-bold">{attachedCustomer.name}</span>
                  </p>
                  <TierBadge tier={attachedCustomer.tier} size="sm" />
                </div>
              )}

              {/* Search */}
              <div className="px-5 pt-4 pb-2 flex-shrink-0">
                <div
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                  style={{ background: "var(--bg)", border: "1.5px solid var(--border)" }}
                >
                  <Search size={14} style={{ color: "var(--text-secondary)" }} />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search by name, phone, email…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 text-sm bg-transparent outline-none"
                    style={{ color: "var(--text)" }}
                  />
                </div>
              </div>

              {/* Customer list */}
              <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
                <AnimatePresence>
                  {confirming ? (
                    /* Confirmation view */
                    <motion.div
                      key="confirm"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 rounded-2xl space-y-4"
                      style={{ background: cfg?.bg, border: `1.5px solid ${cfg?.border}` }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold text-white"
                          style={{ background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)" }}
                        >
                          {confirming.avatar}
                        </div>
                        <div>
                          <p className="font-bold text-base" style={{ color: "var(--text)" }}>{confirming.name}</p>
                          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{confirming.phone}</p>
                        </div>
                        <div className="ml-auto">
                          <TierBadge tier={confirming.tier} size="md" />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-center">
                        {[
                          { label: "Current Points", value: confirming.points.toLocaleString("en-IN") },
                          { label: "Points to Earn", value: `+${earnPoints}` },
                          { label: "After This Sale", value: (confirming.points + earnPoints).toLocaleString("en-IN") },
                        ].map((s) => (
                          <div key={s.label} className="px-3 py-2 rounded-xl" style={{ background: "white" }}>
                            <p className="text-lg font-black" style={{ color: s.label === "Points to Earn" ? "#16a34a" : cfg?.color }}>{s.value}</p>
                            <p className="text-[10px] font-medium" style={{ color: "var(--text-secondary)" }}>{s.label}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setConfirming(null)}
                          className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                          style={{ background: "white", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                        >
                          Back
                        </button>
                        <motion.button
                          onClick={handleConfirm}
                          className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                          style={{ background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)", boxShadow: "0 4px 14px rgba(242,167,185,0.4)" }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <UserPlus size={14} /> Attach Customer
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    filtered.map((customer) => (
                      <motion.button
                        key={customer.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => handleSelect(customer)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-colors"
                        style={{
                          background: attachedCustomer?.id === customer.id ? "var(--brand-light)" : "var(--bg)",
                          border: attachedCustomer?.id === customer.id ? "1.5px solid var(--brand)" : "1px solid var(--border)",
                        }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                          style={{ background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)" }}
                        >
                          {customer.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>{customer.name}</p>
                            <TierBadge tier={customer.tier} size="sm" />
                          </div>
                          <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                            {customer.phone} · {customer.points.toLocaleString("en-IN")} pts
                          </p>
                        </div>
                        <ChevronRight size={14} style={{ color: "var(--text-secondary)", flexShrink: 0 }} />
                      </motion.button>
                    ))
                  )}
                </AnimatePresence>

                {!confirming && filtered.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No customers found</p>
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
