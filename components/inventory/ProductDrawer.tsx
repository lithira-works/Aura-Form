"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Scan,
  ChevronDown,
  Save,
  Sparkles,
  Package,
  Tag,
  Truck,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { SUPPLIERS } from "@/lib/inventory-data";
import { CATEGORIES } from "@/lib/mock-data";
import type { InventoryProduct } from "@/lib/inventory-data";

interface ProductDrawerProps {
  isOpen: boolean;
  product: InventoryProduct | null;
  onClose: () => void;
  onSave: (data: Partial<InventoryProduct>) => void;
}

const EMOJI_OPTIONS = [
  "🌸","✨","🌷","🌟","☀️","👁️","🎨","🖊️","📏","💋","💄","🩷","✏️",
  "🍊","💧","🛡️","🌙","🌹","💅","💪","🖌️","🫧","🧴","💊","🧪",
];

const SECTION_TITLES: Record<string, { icon: React.ReactNode; label: string }> = {
  basic: { icon: <Package size={14} />, label: "Basic Information" },
  pricing: { icon: <Tag size={14} />, label: "Pricing & Stock" },
  barcode: { icon: <Scan size={14} />, label: "Barcode & Image" },
  supplier: { icon: <Truck size={14} />, label: "Supplier & Location" },
};

type Section = keyof typeof SECTION_TITLES;

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all";

const inputStyle = {
  background: "var(--bg)",
  border: "1.5px solid var(--border)",
  color: "var(--text)",
};

export default function ProductDrawer({
  isOpen,
  product,
  onClose,
  onSave,
}: ProductDrawerProps) {
  const isEdit = !!product;
  const [section, setSection] = useState<Section>("basic");
  const [saved, setSaved] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("🌸");
  const [barcodeScanned, setBarcodeScanned] = useState(false);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "Face",
    shade: "",
    barcode: "",
    sku: "",
    price: "",
    costPrice: "",
    stock: "",
    lowStockThreshold: "",
    reorderQty: "",
    supplierId: "s001",
    location: "Shelf A1",
    expiryDate: "",
    status: "active",
  });

  useEffect(() => {
    if (isOpen) {
      setSaved(false);
      setBarcodeScanned(false);
      setSection("basic");
      if (product) {
        setSelectedEmoji(product.emoji);
        setForm({
          name: product.name,
          brand: product.brand,
          category: product.category,
          shade: product.shade ?? "",
          barcode: product.barcode,
          sku: product.sku,
          price: String(product.price),
          costPrice: String(product.costPrice),
          stock: String(product.stock),
          lowStockThreshold: String(product.lowStockThreshold),
          reorderQty: String(product.reorderQty),
          supplierId: product.supplierId,
          location: product.location,
          expiryDate: product.expiryDate ?? "",
          status: product.status,
        });
      } else {
        setSelectedEmoji("🌸");
        setForm({
          name: "", brand: "", category: "Face", shade: "",
          barcode: "", sku: "", price: "", costPrice: "",
          stock: "", lowStockThreshold: "5", reorderQty: "15",
          supplierId: "s001", location: "Shelf A1", expiryDate: "", status: "active",
        });
      }
    }
  }, [isOpen, product]);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = () => {
    onSave({
      ...form,
      emoji: selectedEmoji,
      price: parseFloat(form.price) || 0,
      costPrice: parseFloat(form.costPrice) || 0,
      stock: parseInt(form.stock) || 0,
      lowStockThreshold: parseInt(form.lowStockThreshold) || 5,
      reorderQty: parseInt(form.reorderQty) || 15,
      supplierName: SUPPLIERS.find((s) => s.id === form.supplierId)?.name ?? "",
      category: form.category as InventoryProduct["category"],
      status: form.status as InventoryProduct["status"],
      expiryDate: form.expiryDate || undefined,
    });
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1400);
  };

  const handleSimulateScan = () => {
    setForm((f) => ({
      ...f,
      barcode: `890123456${Math.floor(1000 + Math.random() * 9000)}`,
    }));
    setBarcodeScanned(true);
    setTimeout(() => setBarcodeScanned(false), 2000);
  };

  const SECTIONS = Object.keys(SECTION_TITLES) as Section[];
  const currentIdx = SECTIONS.indexOf(section);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40"
            style={{ background: "rgba(29,29,31,0.3)", backdropFilter: "blur(3px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            className="fixed top-0 right-0 bottom-0 z-50 flex flex-col"
            style={{
              width: "480px",
              background: "#ffffff",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5 border-b flex-shrink-0"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "var(--brand-light)" }}
                >
                  {isEdit ? <Sparkles size={16} style={{ color: "var(--brand-dark)" }} /> : <Package size={16} style={{ color: "var(--brand-dark)" }} />}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>
                    {isEdit ? "Edit Product" : "New Product"}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {isEdit ? `Editing ${product?.sku}` : "Fill in product details"}
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

            {/* Section tabs */}
            <div
              className="flex gap-1 px-6 py-3 border-b flex-shrink-0"
              style={{ borderColor: "var(--border)", background: "var(--bg)" }}
            >
              {SECTIONS.map((s, i) => {
                const isDone = i < currentIdx;
                const isActive = s === section;
                return (
                  <motion.button
                    key={s}
                    onClick={() => setSection(s)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium flex-1 justify-center"
                    style={{
                      background: isActive ? "var(--brand)" : isDone ? "var(--brand-light)" : "white",
                      color: isActive ? "#fff" : isDone ? "var(--brand-dark)" : "var(--text-secondary)",
                      border: "1px solid var(--border)",
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {isDone ? <CheckCircle size={11} /> : SECTION_TITLES[s].icon}
                    <span className="hidden sm:block">{SECTION_TITLES[s].label.split(" ")[0]}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Form body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <AnimatePresence mode="wait">
                {/* Basic Info */}
                {section === "basic" && (
                  <motion.div
                    key="basic"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-4"
                  >
                    <FormField label="Product Name" required>
                      <input className={inputCls} style={inputStyle} value={form.name} onChange={set("name")} placeholder="e.g. Silk Foundation" />
                    </FormField>
                    <FormField label="Brand" required>
                      <input className={inputCls} style={inputStyle} value={form.brand} onChange={set("brand")} placeholder="e.g. Dior Beauty" />
                    </FormField>
                    <div className="grid grid-cols-2 gap-3">
                      <FormField label="Category" required>
                        <div className="relative">
                          <select className={inputCls} style={inputStyle} value={form.category} onChange={set("category")}>
                            {CATEGORIES.filter((c) => c !== "All").map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          <ChevronDown size={13} className="absolute right-3 top-3 pointer-events-none" style={{ color: "var(--text-secondary)" }} />
                        </div>
                      </FormField>
                      <FormField label="Shade / Variant">
                        <input className={inputCls} style={inputStyle} value={form.shade} onChange={set("shade")} placeholder="e.g. N20 Ivory" />
                      </FormField>
                    </div>
                    <FormField label="Expiry Date">
                      <input type="date" className={inputCls} style={inputStyle} value={form.expiryDate} onChange={set("expiryDate")} />
                    </FormField>
                    <FormField label="Status">
                      <div className="relative">
                        <select className={inputCls} style={inputStyle} value={form.status} onChange={set("status")}>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="discontinued">Discontinued</option>
                        </select>
                        <ChevronDown size={13} className="absolute right-3 top-3 pointer-events-none" style={{ color: "var(--text-secondary)" }} />
                      </div>
                    </FormField>
                  </motion.div>
                )}

                {/* Pricing & Stock */}
                {section === "pricing" && (
                  <motion.div
                    key="pricing"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-4"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <FormField label="Selling Price (₹)" required>
                        <input type="number" className={inputCls} style={inputStyle} value={form.price} onChange={set("price")} placeholder="0" />
                      </FormField>
                      <FormField label="Cost Price (₹)" required>
                        <input type="number" className={inputCls} style={inputStyle} value={form.costPrice} onChange={set("costPrice")} placeholder="0" />
                      </FormField>
                    </div>
                    {form.price && form.costPrice && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="flex items-center justify-between px-4 py-3 rounded-xl text-sm"
                        style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
                      >
                        <span style={{ color: "#15803d" }}>Gross Margin</span>
                        <span className="font-bold" style={{ color: "#15803d" }}>
                          {Math.round(((parseFloat(form.price) - parseFloat(form.costPrice)) / parseFloat(form.price)) * 100)}%
                          {" "}(₹{(parseFloat(form.price) - parseFloat(form.costPrice)).toLocaleString("en-IN")})
                        </span>
                      </motion.div>
                    )}
                    <div className="grid grid-cols-3 gap-3">
                      <FormField label="Current Stock" required>
                        <input type="number" className={inputCls} style={inputStyle} value={form.stock} onChange={set("stock")} placeholder="0" />
                      </FormField>
                      <FormField label="Low Stock Alert">
                        <input type="number" className={inputCls} style={inputStyle} value={form.lowStockThreshold} onChange={set("lowStockThreshold")} placeholder="5" />
                      </FormField>
                      <FormField label="Reorder Qty">
                        <input type="number" className={inputCls} style={inputStyle} value={form.reorderQty} onChange={set("reorderQty")} placeholder="15" />
                      </FormField>
                    </div>
                  </motion.div>
                )}

                {/* Barcode & Image */}
                {section === "barcode" && (
                  <motion.div
                    key="barcode"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-4"
                  >
                    <FormField label="Barcode" required>
                      <div className="flex gap-2">
                        <input
                          className={`${inputCls} flex-1`}
                          style={inputStyle}
                          value={form.barcode}
                          onChange={set("barcode")}
                          placeholder="Scan or enter barcode…"
                        />
                        <motion.button
                          onClick={handleSimulateScan}
                          className="px-3 py-2.5 rounded-xl flex items-center gap-1.5 text-sm font-medium flex-shrink-0"
                          style={{
                            background: barcodeScanned ? "#f0fdf4" : "var(--brand-light)",
                            color: barcodeScanned ? "#16a34a" : "var(--brand-dark)",
                            border: `1.5px solid ${barcodeScanned ? "#bbf7d0" : "var(--brand)"}`,
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {barcodeScanned ? <CheckCircle size={14} /> : <Scan size={14} />}
                          {barcodeScanned ? "Scanned!" : "Scan"}
                        </motion.button>
                      </div>
                    </FormField>
                    <FormField label="SKU">
                      <input className={inputCls} style={inputStyle} value={form.sku} onChange={set("sku")} placeholder="Auto-generated or custom" />
                    </FormField>

                    {/* Image / Emoji picker */}
                    <FormField label="Product Image">
                      {/* Upload area */}
                      <div
                        className="flex flex-col items-center justify-center gap-3 h-32 rounded-2xl border-2 border-dashed cursor-pointer transition-colors mb-3"
                        style={{ borderColor: "var(--brand)", background: "var(--brand-light)" }}
                      >
                        <Upload size={22} style={{ color: "var(--brand-dark)", opacity: 0.6 }} />
                        <div className="text-center">
                          <p className="text-sm font-medium" style={{ color: "var(--brand-dark)" }}>
                            Drop image here or <span className="underline">browse</span>
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--brand-dark)", opacity: 0.6 }}>
                            PNG, JPG, WEBP up to 5MB
                          </p>
                        </div>
                      </div>

                      {/* Emoji picker */}
                      <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
                        Or choose an emoji icon:
                      </p>
                      <div className="grid grid-cols-8 gap-2">
                        {EMOJI_OPTIONS.map((e) => (
                          <motion.button
                            key={e}
                            onClick={() => setSelectedEmoji(e)}
                            className="w-9 h-9 rounded-xl text-xl flex items-center justify-center"
                            style={{
                              background: selectedEmoji === e ? "var(--brand)" : "var(--bg)",
                              border: selectedEmoji === e ? "2px solid var(--brand-dark)" : "1px solid var(--border)",
                              boxShadow: selectedEmoji === e ? "0 2px 8px rgba(242,167,185,0.4)" : "none",
                            }}
                            whileTap={{ scale: 0.85 }}
                          >
                            {e}
                          </motion.button>
                        ))}
                      </div>
                    </FormField>
                  </motion.div>
                )}

                {/* Supplier & Location */}
                {section === "supplier" && (
                  <motion.div
                    key="supplier"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-4"
                  >
                    <FormField label="Supplier" required>
                      <div className="relative">
                        <select className={inputCls} style={inputStyle} value={form.supplierId} onChange={set("supplierId")}>
                          {SUPPLIERS.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                        <ChevronDown size={13} className="absolute right-3 top-3 pointer-events-none" style={{ color: "var(--text-secondary)" }} />
                      </div>
                    </FormField>

                    {/* Supplier card preview */}
                    {form.supplierId && (() => {
                      const sup = SUPPLIERS.find((s) => s.id === form.supplierId);
                      if (!sup) return null;
                      return (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-3 p-4 rounded-xl"
                          style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                        >
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                            style={{ background: "var(--brand)" }}
                          >
                            {sup.initials}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{sup.name}</p>
                            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{sup.contactPerson} · {sup.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium" style={{ color: "var(--brand-dark)" }}>
                              {sup.leadTimeDays}d lead
                            </p>
                            <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>{sup.paymentTerms}</p>
                          </div>
                        </motion.div>
                      );
                    })()}

                    <FormField label="Storage Location">
                      <div className="relative">
                        <MapPin size={14} className="absolute left-3 top-3" style={{ color: "var(--text-secondary)" }} />
                        <input
                          className={inputCls}
                          style={{ ...inputStyle, paddingLeft: "2rem" }}
                          value={form.location}
                          onChange={set("location")}
                          placeholder="e.g. Shelf A1"
                        />
                      </div>
                    </FormField>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-between px-6 py-4 border-t flex-shrink-0"
              style={{ borderColor: "var(--border)", background: "var(--bg)" }}
            >
              <div className="flex gap-2">
                {currentIdx > 0 && (
                  <motion.button
                    onClick={() => setSection(SECTIONS[currentIdx - 1])}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium"
                    style={{ background: "white", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Back
                  </motion.button>
                )}
              </div>
              <div className="flex gap-2">
                <motion.button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium"
                  style={{ background: "white", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  Cancel
                </motion.button>
                {currentIdx < SECTIONS.length - 1 ? (
                  <motion.button
                    onClick={() => setSection(SECTIONS[currentIdx + 1])}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)", boxShadow: "0 4px 12px rgba(242,167,185,0.4)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Next →
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleSave}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2"
                    style={{ background: saved ? "#16a34a" : "linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)", boxShadow: "0 4px 12px rgba(242,167,185,0.4)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {saved ? <><CheckCircle size={14} /> Saved!</> : <><Save size={14} /> {isEdit ? "Update" : "Create"}</>}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
