"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scan, X, CheckCircle, AlertCircle, Zap } from "lucide-react";
import { PRODUCTS } from "@/lib/mock-data";

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductFound: (productId: string) => void;
}

type ScanState = "idle" | "scanning" | "found" | "not_found";

export default function BarcodeScannerModal({
  isOpen,
  onClose,
  onProductFound,
}: BarcodeScannerModalProps) {
  const [manualInput, setManualInput] = useState("");
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [foundProduct, setFoundProduct] = useState<(typeof PRODUCTS)[0] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setScanState("idle");
      setManualInput("");
      setFoundProduct(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleScan = (barcode: string) => {
    if (!barcode.trim()) return;
    setScanState("scanning");

    setTimeout(() => {
      const product = PRODUCTS.find((p) => p.barcode === barcode.trim());
      if (product) {
        setFoundProduct(product);
        setScanState("found");
        setTimeout(() => {
          onProductFound(product.id);
          setManualInput("");
          setScanState("idle");
          setFoundProduct(null);
        }, 1200);
      } else {
        setScanState("not_found");
        setTimeout(() => {
          setScanState("idle");
          setManualInput("");
        }, 1800);
      }
    }, 350);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleScan(manualInput);
  };

  const scannerLineAnimate = {
    y: ["0%", "100%", "0%"],
    transition: {
      duration: 1.8,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40"
            style={{ background: "rgba(29,29,31,0.45)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
          >
            <div
              className="w-full max-w-sm rounded-3xl p-6 flex flex-col gap-5 shadow-2xl"
              style={{ background: "#ffffff" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "var(--brand-light)" }}
                  >
                    <Scan size={18} style={{ color: "var(--brand-dark)" }} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>
                      Barcode Scanner
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      Scan or enter manually
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

              {/* Scanner viewport */}
              <div
                className="relative h-48 rounded-2xl overflow-hidden flex items-center justify-center"
                style={{ background: "#0f0f0f" }}
              >
                {/* Corner brackets */}
                {[
                  "top-3 left-3 border-t-2 border-l-2",
                  "top-3 right-3 border-t-2 border-r-2",
                  "bottom-3 left-3 border-b-2 border-l-2",
                  "bottom-3 right-3 border-b-2 border-r-2",
                ].map((cls, i) => (
                  <div
                    key={i}
                    className={`absolute w-6 h-6 rounded-sm ${cls}`}
                    style={{ borderColor: "var(--brand)" }}
                  />
                ))}

                {/* Status overlay */}
                <AnimatePresence mode="wait">
                  {scanState === "idle" && (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-3"
                    >
                      {/* Animated scan line */}
                      <div className="relative w-32 h-16 overflow-hidden">
                        <motion.div
                          className="absolute left-0 right-0 h-px"
                          style={{ background: "linear-gradient(90deg, transparent, var(--brand), transparent)" }}
                          animate={scannerLineAnimate}
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                          {/* Mock barcode lines */}
                          {Array.from({ length: 18 }).map((_, i) => (
                            <div
                              key={i}
                              className="h-10 mx-[1px]"
                              style={{
                                width: i % 3 === 0 ? "3px" : "1px",
                                background: "rgba(255,255,255,0.7)",
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                        Point scanner at barcode
                      </p>
                    </motion.div>
                  )}

                  {scanState === "scanning" && (
                    <motion.div
                      key="scanning"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Zap size={28} style={{ color: "var(--brand)" }} />
                      </motion.div>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                        Processing…
                      </p>
                    </motion.div>
                  )}

                  {scanState === "found" && foundProduct && (
                    <motion.div
                      key="found"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-2 text-center px-4"
                    >
                      <div className="text-3xl">{foundProduct.emoji}</div>
                      <CheckCircle size={22} style={{ color: "#4ade80" }} />
                      <p className="text-sm font-semibold" style={{ color: "#fff" }}>
                        {foundProduct.name}
                      </p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                        Added to cart
                      </p>
                    </motion.div>
                  )}

                  {scanState === "not_found" && (
                    <motion.div
                      key="not_found"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <AlertCircle size={28} style={{ color: "#f87171" }} />
                      <p className="text-sm font-semibold" style={{ color: "#fff" }}>
                        Barcode not found
                      </p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                        Check the product database
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Manual input */}
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Enter barcode manually…"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{
                    background: "var(--bg)",
                    border: "1.5px solid var(--border)",
                    color: "var(--text)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--brand)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--border)")
                  }
                />
                <motion.button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-white"
                  style={{ background: "var(--brand)" }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!manualInput.trim()}
                >
                  Find
                </motion.button>
              </form>

              {/* Hint */}
              <p className="text-xs text-center" style={{ color: "var(--text-secondary)" }}>
                Try barcode{" "}
                <code
                  className="px-1.5 py-0.5 rounded text-xs"
                  style={{ background: "var(--brand-light)", color: "var(--brand-dark)" }}
                >
                  8901234560001
                </code>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
