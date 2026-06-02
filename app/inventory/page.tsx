"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Package, Truck } from "lucide-react";
import StatsBar from "@/components/inventory/StatsBar";
import InventoryTopBar from "@/components/inventory/InventoryTopBar";
import StockTable from "@/components/inventory/StockTable";
import ProductDrawer from "@/components/inventory/ProductDrawer";
import SuppliersPanel from "@/components/inventory/SuppliersPanel";
import { INVENTORY_PRODUCTS } from "@/lib/inventory-data";
import type { InventoryProduct } from "@/lib/inventory-data";
import type { Category } from "@/lib/mock-data";

type Tab = "stock" | "suppliers";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "stock", label: "Stock Management", icon: <Package size={15} /> },
  { id: "suppliers", label: "Suppliers", icon: <Truck size={15} /> },
];

export default function InventoryPage() {
  const [tab, setTab] = useState<Tab>("stock");
  const [products, setProducts] = useState<InventoryProduct[]>(INVENTORY_PRODUCTS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category | "All">("All");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<InventoryProduct | null>(null);

  /* ── Filtering ── */
  const today = new Date().toISOString().split("T")[0];
  const filteredProducts = useMemo(() => {
    let list = products;

    if (categoryFilter !== "All")
      list = list.filter((p) => p.category === categoryFilter);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.barcode.includes(q) ||
          p.supplierName.toLowerCase().includes(q) ||
          (p.shade?.toLowerCase().includes(q) ?? false)
      );
    }

    if (statusFilter === "low_stock")
      list = list.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold);
    else if (statusFilter === "out_of_stock")
      list = list.filter((p) => p.stock === 0);
    else if (statusFilter === "active")
      list = list.filter((p) => p.status === "active" && p.stock > p.lowStockThreshold);
    else if (statusFilter === "expiring")
      list = list.filter((p) => {
        if (!p.expiryDate) return false;
        const diff =
          (new Date(p.expiryDate).getTime() - new Date(today).getTime()) /
          (1000 * 60 * 60 * 24);
        return diff <= 90 && diff > 0;
      });

    return list;
  }, [products, search, categoryFilter, statusFilter, today]);

  /* ── Selection ── */
  const toggleSelect = useCallback((id: string) => {
    setSelected((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback((ids: string[]) => {
    setSelected((s) => {
      const allSelected = ids.every((id) => s.has(id));
      const next = new Set(s);
      if (allSelected) ids.forEach((id) => next.delete(id));
      else ids.forEach((id) => next.add(id));
      return next;
    });
  }, []);

  /* ── CRUD ── */
  const handleEdit = useCallback((product: InventoryProduct) => {
    setEditingProduct(product);
    setDrawerOpen(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setSelected((s) => { const n = new Set(s); n.delete(id); return n; });
  }, []);

  const handleSave = useCallback((data: Partial<InventoryProduct>) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id ? { ...p, ...data } : p
        )
      );
    } else {
      const newProduct: InventoryProduct = {
        id: `p${Date.now()}`,
        barcode: data.barcode ?? `${Date.now()}`,
        name: data.name ?? "New Product",
        brand: data.brand ?? "",
        category: data.category ?? "Face",
        price: data.price ?? 0,
        costPrice: data.costPrice ?? 0,
        stock: data.stock ?? 0,
        lowStockThreshold: data.lowStockThreshold ?? 5,
        emoji: data.emoji ?? "🌸",
        shade: data.shade,
        expiryDate: data.expiryDate,
        sku: data.sku ?? `AF-NEW-${Date.now()}`,
        supplierId: data.supplierId ?? "s001",
        supplierName: data.supplierName ?? "",
        reorderQty: data.reorderQty ?? 15,
        location: data.location ?? "Shelf A1",
        status: data.status ?? "active",
        lastRestocked: new Date().toISOString().split("T")[0],
        imageEmoji: data.emoji ?? "🌸",
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
    setEditingProduct(null);
    setDrawerOpen(false);
  }, [editingProduct]);

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Page header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ background: "#ffffff", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}
      >
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
            Inventory Management
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
            {products.length} products · Last synced just now
          </p>
        </div>

        {/* Tab switcher */}
        <div
          className="flex items-center gap-1 p-1 rounded-xl"
          style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
        >
          {TABS.map((t) => (
            <motion.button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
              style={{
                background: tab === t.id ? "var(--brand)" : "transparent",
                color: tab === t.id ? "#ffffff" : "var(--text-secondary)",
                boxShadow: tab === t.id ? "0 2px 8px rgba(242,167,185,0.35)" : "none",
              }}
              whileHover={tab !== t.id ? { color: "var(--text)" } : {}}
              whileTap={{ scale: 0.97 }}
            >
              {t.icon}
              {t.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* KPI stats */}
      <StatsBar products={products} />

      {/* Divider */}
      <div style={{ height: "1px", background: "var(--border)", flexShrink: 0 }} />

      {/* Tab content */}
      {tab === "stock" ? (
        <div className="flex flex-col flex-1 overflow-hidden">
          <InventoryTopBar
            search={search}
            onSearchChange={setSearch}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            selectedCount={selected.size}
            allProducts={products}
            filteredProducts={filteredProducts}
            onAddNew={() => { setEditingProduct(null); setDrawerOpen(true); }}
          />
          <StockTable
            products={filteredProducts}
            selected={selected}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAll}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      ) : (
        <SuppliersPanel />
      )}

      {/* Product drawer */}
      <ProductDrawer
        isOpen={drawerOpen}
        product={editingProduct}
        onClose={() => { setDrawerOpen(false); setEditingProduct(null); }}
        onSave={handleSave}
      />
    </div>
  );
}
