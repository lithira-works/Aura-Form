"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { InventoryProduct, SortField, SortDir } from "@/lib/inventory-data";

interface StockTableProps {
  products: InventoryProduct[];
  selected: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: (ids: string[]) => void;
  onEdit: (product: InventoryProduct) => void;
  onDelete: (id: string) => void;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50];

type Col = {
  key: SortField | "actions";
  label: string;
  sortable?: boolean;
  width?: string;
};

const COLUMNS: Col[] = [
  { key: "name", label: "Product", sortable: true, width: "240px" },
  { key: "sku", label: "SKU / Barcode", sortable: true, width: "160px" },
  { key: "category", label: "Category", sortable: true, width: "120px" },
  { key: "stock", label: "Stock Level", sortable: true, width: "160px" },
  { key: "price", label: "Unit Price", sortable: true, width: "110px" },
  { key: "costPrice", label: "Cost Price", sortable: true, width: "110px" },
  { key: "supplierName", label: "Supplier", sortable: true, width: "180px" },
  { key: "status", label: "Status", sortable: true, width: "110px" },
  { key: "actions", label: "", width: "80px" },
];

function StockBar({ stock, threshold }: { stock: number; threshold: number }) {
  const pct = Math.min(100, (stock / (threshold * 4)) * 100);
  const color =
    stock === 0 ? "#dc2626" : stock <= threshold ? "#ea580c" : "#16a34a";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <span className="text-xs font-semibold w-6 text-right" style={{ color }}>
        {stock}
      </span>
    </div>
  );
}

function StatusBadge({ status, stock, threshold }: { status: string; stock: number; threshold: number }) {
  if (stock === 0)
    return (
      <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "#fee2e2", color: "#dc2626" }}>
        <XCircle size={11} />Out of Stock
      </span>
    );
  if (stock <= threshold)
    return (
      <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "#fff7ed", color: "#ea580c" }}>
        <AlertTriangle size={11} />Low Stock
      </span>
    );
  if (status === "inactive")
    return (
      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "#f3f4f6", color: "#6b7280" }}>
        Inactive
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "#f0fdf4", color: "#16a34a" }}>
      <CheckCircle size={11} />Active
    </span>
  );
}

export default function StockTable({
  products,
  selected,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onDelete,
}: StockTableProps) {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
    setPage(1);
  };

  const sorted = useMemo(() => {
    return [...products].sort((a, b) => {
      const av = a[sortField] ?? "";
      const bv = b[sortField] ?? "";
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [products, sortField, sortDir]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);
  const pageIds = paginated.map((p) => p.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id));

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown size={12} className="opacity-30" />;
    return sortDir === "asc" ? <ArrowUp size={12} style={{ color: "var(--brand-dark)" }} /> : <ArrowDown size={12} style={{ color: "var(--brand-dark)" }} />;
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse" style={{ minWidth: "1100px" }}>
          <thead className="sticky top-0 z-10">
            <tr style={{ background: "#fafafc", borderBottom: "1.5px solid var(--border)" }}>
              {/* Checkbox all */}
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  onChange={() => onToggleSelectAll(pageIds)}
                  className="w-4 h-4 rounded cursor-pointer accent-pink-400"
                  style={{ accentColor: "var(--brand)" }}
                />
              </th>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                  style={{
                    color: "var(--text-secondary)",
                    width: col.width,
                    cursor: col.sortable ? "pointer" : "default",
                    userSelect: "none",
                  }}
                  onClick={() => col.sortable && col.key !== "actions" && handleSort(col.key as SortField)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && <SortIcon field={col.key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {paginated.map((product, i) => {
                const isSelected = selected.has(product.id);
                return (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="group border-b transition-colors"
                    style={{
                      borderColor: "var(--border)",
                      background: isSelected ? "var(--brand-light)" : "white",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected)
                        (e.currentTarget as HTMLElement).style.background = "var(--bg)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected)
                        (e.currentTarget as HTMLElement).style.background = "white";
                    }}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(product.id)}
                        className="w-4 h-4 rounded cursor-pointer"
                        style={{ accentColor: "var(--brand)" }}
                      />
                    </td>

                    {/* Product name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                          style={{ background: "var(--brand-light)" }}
                        >
                          {product.emoji}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>
                            {product.name}
                          </p>
                          <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                            {product.brand}{product.shade ? ` · ${product.shade}` : ""}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* SKU / Barcode */}
                    <td className="px-4 py-3">
                      <p className="text-xs font-mono font-semibold" style={{ color: "var(--text)" }}>
                        {product.sku}
                      </p>
                      <p className="text-[10px] font-mono mt-0.5" style={{ color: "var(--text-secondary)" }}>
                        {product.barcode}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ background: "var(--brand-light)", color: "var(--brand-dark)" }}
                      >
                        {product.category}
                      </span>
                    </td>

                    {/* Stock level */}
                    <td className="px-4 py-3" style={{ width: "160px" }}>
                      <StockBar stock={product.stock} threshold={product.lowStockThreshold} />
                    </td>

                    {/* Unit price */}
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>
                    </td>

                    {/* Cost price */}
                    <td className="px-4 py-3">
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                        ₹{product.costPrice.toLocaleString("en-IN")}
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: "#16a34a" }}>
                        {Math.round(((product.price - product.costPrice) / product.price) * 100)}% margin
                      </p>
                    </td>

                    {/* Supplier */}
                    <td className="px-4 py-3">
                      <p className="text-sm truncate" style={{ color: "var(--text)", maxWidth: "160px" }}>
                        {product.supplierName}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <StatusBadge
                        status={product.status}
                        stock={product.stock}
                        threshold={product.lowStockThreshold}
                      />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          onClick={() => onEdit(product)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: "var(--brand-light)", color: "var(--brand-dark)" }}
                          whileTap={{ scale: 0.85 }}
                          title="Edit"
                        >
                          <Pencil size={12} />
                        </motion.button>
                        <motion.button
                          onClick={() => onDelete(product.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: "#fee2e2", color: "#dc2626" }}
                          whileTap={{ scale: 0.85 }}
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>

            {paginated.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length + 1} className="text-center py-16">
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    No products match your filters.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        className="flex items-center justify-between px-6 py-3 border-t flex-shrink-0"
        style={{ background: "#ffffff", borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          <span>Rows per page:</span>
          {PAGE_SIZE_OPTIONS.map((n) => (
            <button
              key={n}
              onClick={() => { setPageSize(n); setPage(1); }}
              className="px-2 py-0.5 rounded-lg text-xs font-medium"
              style={{
                background: pageSize === n ? "var(--brand-light)" : "transparent",
                color: pageSize === n ? "var(--brand-dark)" : "var(--text-secondary)",
              }}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
          <span>
            {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}
          </span>
          <div className="flex gap-1">
            <motion.button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={14} />
            </motion.button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pg = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page + i - 2;
              if (pg < 1 || pg > totalPages) return null;
              return (
                <motion.button
                  key={pg}
                  onClick={() => setPage(pg)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium"
                  style={{
                    background: page === pg ? "var(--brand)" : "var(--bg)",
                    color: page === pg ? "#fff" : "var(--text-secondary)",
                    border: "1px solid var(--border)",
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  {pg}
                </motion.button>
              );
            })}
            <motion.button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={14} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
