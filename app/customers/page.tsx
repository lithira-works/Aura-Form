"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Users,
  TrendingUp,
  Star,
  X,
  ChevronRight,
  UserPlus,
  Filter,
} from "lucide-react";
import CustomerProfile from "@/components/customers/CustomerProfile";
import TierBadge from "@/components/customers/TierBadge";
import { CUSTOMERS, TIER_CONFIG } from "@/lib/customers-data";
import type { Customer, LoyaltyTier } from "@/lib/customers-data";
import { formatLKRCompact } from "@/lib/currency";

const TIER_FILTERS: (LoyaltyTier | "All")[] = ["All", "Diamond", "Platinum", "Gold", "Rose"];

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<LoyaltyTier | "All">("All");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = CUSTOMERS;
    if (tierFilter !== "All") list = list.filter((c) => c.tier === tierFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => b.totalSpent - a.totalSpent);
  }, [search, tierFilter]);

  const totalLTV = CUSTOMERS.reduce((s, c) => s + c.totalSpent, 0);
  const avgPoints = Math.round(CUSTOMERS.reduce((s, c) => s + c.points, 0) / CUSTOMERS.length);

  const openProfile = (c: Customer) => {
    setSelectedCustomer(c);
    setProfileOpen(true);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Page header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
        style={{ background: "#ffffff", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}
      >
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>Customer Hub</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
            {CUSTOMERS.length} members · LKR {(totalLTV / 1000).toFixed(0)}K lifetime value
          </p>
        </div>
        <motion.button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{
            background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)",
            boxShadow: "0 4px 14px rgba(242,167,185,0.4)",
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <UserPlus size={15} />
          New Customer
        </motion.button>
      </div>

      {/* Stats bar */}
      <div className="flex gap-4 px-6 py-4 flex-shrink-0 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {[
          { label: "Total Members", value: CUSTOMERS.length, icon: <Users size={16} />, color: "#6366f1", bg: "#eef2ff" },
          { label: "Total LTV", value: formatLKRCompact(totalLTV), icon: <TrendingUp size={16} />, color: "#16a34a", bg: "#f0fdf4" },
          { label: "Avg. Points", value: avgPoints.toLocaleString("en-US"), icon: <Star size={16} />, color: "var(--brand-dark)", bg: "var(--brand-light)" },
          ...TIER_FILTERS.filter((t) => t !== "All").map((tier) => {
            const cnt = CUSTOMERS.filter((c) => c.tier === tier).length;
            const cfg = TIER_CONFIG[tier as LoyaltyTier];
            return { label: `${tier} Tier`, value: cnt, icon: <span className="text-base">{cfg.emoji}</span>, color: cfg.color, bg: cfg.bg };
          }),
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl flex-shrink-0 min-w-[150px]"
            style={{ background: "#ffffff", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)" }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
              <span style={{ color: s.color }}>{s.icon}</span>
            </div>
            <div>
              <p className="text-[11px] font-medium" style={{ color: "var(--text-secondary)" }}>{s.label}</p>
              <p className="text-xl font-bold leading-none mt-0.5" style={{ color: "var(--text)" }}>{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ height: "1px", background: "var(--border)", flexShrink: 0 }} />

      {/* Filters */}
      <div
        className="flex items-center gap-3 px-6 py-3 border-b flex-shrink-0"
        style={{ background: "#ffffff", borderColor: "var(--border)" }}
      >
        {/* Search */}
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-1 max-w-sm"
          style={{ background: "var(--bg)", border: "1.5px solid var(--border)" }}
        >
          <Search size={14} style={{ color: "var(--text-secondary)" }} />
          <input
            type="text"
            placeholder="Search by name, phone, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none"
            style={{ color: "var(--text)" }}
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X size={12} style={{ color: "var(--text-secondary)" }} />
            </button>
          )}
        </div>

        {/* Tier filter pills */}
        <div className="flex items-center gap-1.5">
          <Filter size={13} style={{ color: "var(--text-secondary)" }} />
          {TIER_FILTERS.map((tier) => {
            const active = tier === tierFilter;
            const cfg = tier !== "All" ? TIER_CONFIG[tier] : null;
            return (
              <motion.button
                key={tier}
                onClick={() => setTierFilter(tier)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
                style={{
                  background: active ? (cfg?.bg ?? "var(--brand-light)") : "var(--bg)",
                  color: active ? (cfg?.color ?? "var(--brand-dark)") : "var(--text-secondary)",
                  border: active ? `1.5px solid ${cfg?.border ?? "var(--brand)"}` : "1px solid var(--border)",
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                {cfg?.emoji && <span>{cfg.emoji}</span>}
                {tier}
              </motion.button>
            );
          })}
        </div>

        <p className="text-xs ml-auto" style={{ color: "var(--text-secondary)" }}>
          {filtered.length} results
        </p>
      </div>

      {/* Customer list */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}>
          {filtered.map((customer, i) => {
            const cfg = TIER_CONFIG[customer.tier];
            return (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => openProfile(customer)}
                className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer"
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-sm)",
                }}
                whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(242,167,185,0.18)" }}
              >
                {/* Avatar */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${cfg.color}88, ${cfg.color})` }}
                >
                  {customer.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold truncate" style={{ color: "var(--text)" }}>
                      {customer.name}
                    </p>
                    <TierBadge tier={customer.tier} size="sm" />
                  </div>
                  <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-secondary)" }}>
                    {customer.phone} · {customer.purchaseCount} visits
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs font-semibold" style={{ color: cfg.color }}>
                      {customer.points.toLocaleString("en-US")} pts
                    </span>
                    <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      LTV: {formatLKRCompact(customer.totalSpent)}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight size={15} style={{ color: "var(--text-secondary)", flexShrink: 0 }} />
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <Users size={36} style={{ color: "var(--text-secondary)", opacity: 0.3 }} />
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No customers match your search</p>
          </div>
        )}
      </div>

      {/* Customer profile slide-over */}
      <CustomerProfile
        customer={selectedCustomer}
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </div>
  );
}

