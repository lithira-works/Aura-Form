"use client";

import { useState, useCallback, useMemo } from "react";
import POSHeader from "@/components/pos/POSHeader";
import CategoryFilter from "@/components/pos/CategoryFilter";
import ProductGrid from "@/components/pos/ProductGrid";
import CartSidebar, { type CartItem } from "@/components/pos/CartSidebar";
import BarcodeScannerModal from "@/components/pos/BarcodeScannerModal";
import CustomerAttachModal from "@/components/customers/CustomerAttachModal";
import { useBarcode } from "@/hooks/useBarcode";
import { PRODUCTS, CATEGORIES, type Category } from "@/lib/mock-data";
import { TAX_RATE } from "@/lib/mock-data";
import type { Customer } from "@/lib/customers-data";

export default function POSPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [attachedCustomer, setAttachedCustomer] = useState<Customer | null>(null);

  /* ── Filtered products ── */
  const filteredProducts = useMemo(() => {
    let list = PRODUCTS;
    if (activeCategory !== "All") {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.barcode.includes(q) ||
          (p.shade?.toLowerCase().includes(q) ?? false)
      );
    }
    return list;
  }, [activeCategory, searchQuery]);

  /* ── Category counts ── */
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: PRODUCTS.length,
    };
    CATEGORIES.filter((c) => c !== "All").forEach((cat) => {
      counts[cat] = PRODUCTS.filter((p) => p.category === cat).length;
    });
    return counts;
  }, []);

  /* ── Cart helpers ── */
  const addToCart = useCallback((productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product || product.stock === 0) return;

    setLastAddedId(productId);
    setTimeout(() => setLastAddedId(null), 600);

    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === productId);
      if (existing) {
        if (existing.qty >= product.stock) return prev;
        return prev.map((i) =>
          i.product.id === productId ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  }, []);

  const addToCartByProductRef = useCallback(
    (product: (typeof PRODUCTS)[0]) => addToCart(product.id),
    [addToCart]
  );

  const updateQty = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
    } else {
      setCartItems((prev) =>
        prev.map((i) =>
          i.product.id === productId
            ? { ...i, qty: Math.min(qty, i.product.stock) }
            : i
        )
      );
    }
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  /* ── Barcode hook: USB/BT scanner ── */
  const handleBarcodeScan = useCallback(
    (barcode: string) => {
      const product = PRODUCTS.find((p) => p.barcode === barcode);
      if (product) addToCart(product.id);
    },
    [addToCart]
  );

  useBarcode({ onScan: handleBarcodeScan });

  /* ── Scanner modal product found ── */
  const handleModalProductFound = useCallback(
    (productId: string) => {
      addToCart(productId);
      setScannerOpen(false);
    },
    [addToCart]
  );

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartSubtotal = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0);
  const cartTotal = Math.round(cartSubtotal * (1 + TAX_RATE));

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Top bar */}
      <POSHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onScannerToggle={() => setScannerOpen(true)}
        onCustomerToggle={() => setCustomerModalOpen(true)}
        attachedCustomer={attachedCustomer}
        cartCount={cartCount}
      />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Product panel */}
        <main className="flex flex-col flex-1 overflow-hidden">
          {/* Category tabs */}
          <CategoryFilter
            active={activeCategory}
            onChange={setActiveCategory}
            counts={categoryCounts}
          />

          {/* Divider */}
          <div
            className="mx-6"
            style={{ height: "1px", background: "var(--border)" }}
          />

          {/* Product grid */}
          <ProductGrid
            products={filteredProducts}
            onAddToCart={addToCartByProductRef}
            lastAddedId={lastAddedId}
          />
        </main>

        {/* Cart sidebar */}
        <CartSidebar
          items={cartItems}
          onUpdateQty={updateQty}
          onRemove={removeFromCart}
          onClear={clearCart}
        />
      </div>

      {/* Barcode scanner modal */}
      <BarcodeScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onProductFound={handleModalProductFound}
      />

      {/* Customer attach modal */}
      <CustomerAttachModal
        isOpen={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        cartTotal={cartTotal}
        onAttach={(customer) => setAttachedCustomer(customer)}
        attachedCustomer={attachedCustomer}
      />
    </div>
  );
}
