"use client";

import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Download,
  SlidersHorizontal,
  X,
  ChevronDown,
} from "lucide-react";
import { CATEGORIES } from "@/lib/mock-data";
import type { Category } from "@/lib/mock-data";
import { exportToCSV } from "@/lib/inventory-data";
import type { InventoryProduct } from "@/lib/inventory-data";

interface InventoryTopBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  categoryFilter: Category | "All";
  onCategoryChange: (c: Category | "All") => void;
  statusFilter: string;
  onStatusChange: (s: string) => void;
  selectedCount: number;
  allProducts: InventoryProduct[];
  filteredProducts: InventoryProduct[];
  onAddNew: () => void;
}

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "low_stock", label: "Low Stock" },
  { value: "out_of_stock", label: "Out of Stock" },
  { value: "expiring", label: "Expiring Soon" },
];

export default function InventoryTopBar({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  selectedCount,
  allProducts,
  filteredProducts,
  onAddNew,
}: InventoryTopBarProps) {
  return (
    <div
      className="flex items-center gap-3 px-6 py-3 border-b flex-wrap"
      style={{
        background: "#ffffff",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Search */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-1 min-w-[220px] max-w-sm"
        style={{
          background: "var(--bg)",
          border: "1.5px solid var(--border)",
        }}
      >
        <Search size={14} style={{ color: "var(--text-secondary)" }} />
        <input
          type="text"
          placeholder="Search by name, SKU, barcode, brand…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 text-sm bg-transparent outline-none"
          style={{ color: "var(--text)" }}
        />
        {search && (
          <button onClick={() => onSearchChange("")}>
            <X size={13} style={{ color: "var(--text-secondary)" }} />
          </button>
        )}
      </div>

      {/* Category filter */}
      <div
        className="relative flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm cursor-pointer"
        style={{
          background: "var(--bg)",
          border: "1px solid var(--border)",
          color: "var(--text-secondary)",
          minWidth: "150px",
        }}
      >
        <SlidersHorizontal size={13} />
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value as Category | "All")}
          className="flex-1 bg-transparent outline-none text-sm cursor-pointer appearance-none"
          style={{ color: "var(--text)" }}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <ChevronDown size={12} />
      </div>

      {/* Status filter */}
      <div
        className="relative flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm cursor-pointer"
        style={{
          background: "var(--bg)",
          border: "1px solid var(--border)",
          minWidth: "150px",
        }}
      >
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm cursor-pointer appearance-none"
          style={{ color: "var(--text)" }}
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown size={12} />
      </div>

      {/* Result count */}
      <p className="text-xs hidden sm:block" style={{ color: "var(--text-secondary)" }}>
        {filteredProducts.length} of {allProducts.length} products
      </p>

      <div className="flex-1" />

      {/* Selection badge */}
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-xs font-medium px-3 py-2 rounded-xl"
          style={{ background: "var(--brand-light)", color: "var(--brand-dark)" }}
        >
          {selectedCount} selected
        </motion.div>
      )}

      {/* Export CSV */}
      <motion.button
        onClick={() => exportToCSV(filteredProducts)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
        style={{
          background: "var(--bg)",
          border: "1px solid var(--border)",
          color: "var(--text-secondary)",
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        <Download size={14} />
        Export CSV
      </motion.button>

      {/* Add new product */}
      <motion.button
        onClick={onAddNew}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
        style={{
          background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)",
          boxShadow: "0 4px 14px rgba(242,167,185,0.4)",
        }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <Plus size={15} strokeWidth={2.5} />
        Add Product
      </motion.button>
    </div>
  );
}
