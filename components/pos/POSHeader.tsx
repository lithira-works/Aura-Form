"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Wifi,
  WifiOff,
  Scan,
  Settings,
  ChevronDown,
  Sparkles,
  Search,
} from "lucide-react";
import { ACTIVE_CASHIER } from "@/lib/mock-data";

interface POSHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onScannerToggle: () => void;
  cartCount: number;
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrator",
  senior_cashier: "Senior Cashier",
  cashier: "Cashier",
};

export default function POSHeader({
  searchQuery,
  onSearchChange,
  onScannerToggle,
  cartCount,
}: POSHeaderProps) {
  const [time, setTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const tick = setInterval(() => setTime(new Date()), 1000);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      clearInterval(tick);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const timeStr = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const dateStr = time.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <header
      className="flex items-center gap-4 px-6 py-3 border-b"
      style={{
        background: "#ffffff",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2 min-w-[180px]">
        <motion.div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "var(--brand-light)" }}
          whileHover={{ scale: 1.05 }}
        >
          <Sparkles size={18} style={{ color: "var(--brand-dark)" }} />
        </motion.div>
        <div>
          <p className="font-semibold text-sm leading-none" style={{ color: "var(--text)" }}>
            CosmoPOS
          </p>
          <p className="text-xs leading-none mt-0.5" style={{ color: "var(--text-secondary)" }}>
            Aura &amp; Form
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all"
          style={{
            background: "var(--bg)",
            border: "1.5px solid var(--border)",
          }}
        >
          <Search size={15} style={{ color: "var(--text-secondary)" }} />
          <input
            type="text"
            placeholder="Search products, brands..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none placeholder-gray-400"
            style={{ color: "var(--text)" }}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="text-xs px-1.5 py-0.5 rounded-md"
              style={{ background: "var(--brand-light)", color: "var(--brand-dark)" }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Barcode Scanner Button */}
      <motion.button
        onClick={onScannerToggle}
        className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        style={{
          background: "var(--brand-light)",
          color: "var(--brand-dark)",
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        <Scan size={16} />
        <span>Scan</span>
        {cartCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs flex items-center justify-center font-semibold text-white"
            style={{ background: "var(--brand-dark)" }}
          >
            {cartCount}
          </motion.span>
        )}
      </motion.button>

      {/* Sync status */}
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium"
        style={{
          background: isOnline ? "#f0fdf4" : "#fef2f2",
          color: isOnline ? "#16a34a" : "#dc2626",
        }}
      >
        {isOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
        <span>{isOnline ? "Synced" : "Offline"}</span>
      </div>

      {/* Date/Time */}
      <div className="text-right hidden lg:block">
        <p className="text-sm font-semibold leading-none" style={{ color: "var(--text)" }}>
          {timeStr}
        </p>
        <p className="text-xs leading-none mt-0.5" style={{ color: "var(--text-secondary)" }}>
          {dateStr}
        </p>
      </div>

      {/* Cashier */}
      <div
        className="flex items-center gap-2 pl-4 cursor-pointer group"
        style={{ borderLeft: "1px solid var(--border)" }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold flex-shrink-0"
          style={{ background: "var(--brand)", color: "#fff" }}
        >
          {ACTIVE_CASHIER.avatar}
        </div>
        <div className="hidden md:block">
          <p className="text-sm font-medium leading-none" style={{ color: "var(--text)" }}>
            {ACTIVE_CASHIER.name}
          </p>
          <p className="text-xs mt-0.5 leading-none" style={{ color: "var(--text-secondary)" }}>
            {ROLE_LABELS[ACTIVE_CASHIER.role]}
          </p>
        </div>
        <ChevronDown size={14} style={{ color: "var(--text-secondary)" }} />
      </div>

      {/* Settings */}
      <motion.button
        className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
        style={{ color: "var(--text-secondary)" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Settings size={17} />
      </motion.button>
    </header>
  );
}
