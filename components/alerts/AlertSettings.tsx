"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings2, Save, RotateCcw, CheckCircle } from "lucide-react";
import { CATEGORIES } from "@/lib/mock-data";
import type { AlertThreshold } from "@/lib/alerts-data";
import { DEFAULT_THRESHOLDS } from "@/lib/alerts-data";

interface AlertSettingsProps {
  thresholds: AlertThreshold;
  onChange: (t: AlertThreshold) => void;
}

function NumInput({
  value,
  onChange,
  min,
  max,
  label,
  sublabel,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  label: string;
  sublabel?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
        {label}
      </label>
      <div className="flex items-center gap-2">
        <motion.button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold flex-shrink-0"
          style={{ background: "var(--brand-light)", color: "var(--brand-dark)" }}
          whileTap={{ scale: 0.85 }}
        >
          −
        </motion.button>
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Math.min(max, Math.max(min, parseInt(e.target.value) || 0)))}
          className="w-16 text-center py-2 rounded-xl text-sm font-bold outline-none"
          style={{
            background: "var(--bg)",
            border: "1.5px solid var(--border)",
            color: "var(--text)",
          }}
        />
        <motion.button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold flex-shrink-0"
          style={{ background: "var(--brand)", color: "#fff" }}
          whileTap={{ scale: 0.85 }}
        >
          +
        </motion.button>
      </div>
      {sublabel && (
        <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
          {sublabel}
        </p>
      )}
    </div>
  );
}

export default function AlertSettings({ thresholds, onChange }: AlertSettingsProps) {
  const [saved, setSaved] = useState(false);
  const [local, setLocal] = useState<AlertThreshold>({ ...thresholds });

  const update = (partial: Partial<AlertThreshold>) =>
    setLocal((t) => ({ ...t, ...partial }));

  const setCategoryOverride = (cat: string, val: number) =>
    setLocal((t) => ({
      ...t,
      categoryOverrides: { ...t.categoryOverrides, [cat]: val },
    }));

  const handleSave = () => {
    onChange(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setLocal({ ...DEFAULT_THRESHOLDS });
    onChange(DEFAULT_THRESHOLDS);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "#ffffff",
        boxShadow: "var(--shadow-md)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-4 border-b"
        style={{ borderColor: "var(--border)", background: "var(--bg)" }}
      >
        <Settings2 size={16} style={{ color: "var(--brand-dark)" }} />
        <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>
          Alert Thresholds & Settings
        </p>
      </div>

      <div className="p-5 space-y-6">
        {/* Expiry windows */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--text-secondary)" }}>
            Expiry Alert Windows
          </p>
          <div className="grid grid-cols-2 gap-6">
            <NumInput
              label="Critical — days before expiry"
              sublabel="Items shown with red tag"
              value={local.expiryCriticalDays}
              min={1}
              max={60}
              onChange={(v) => update({ expiryCriticalDays: v })}
            />
            <NumInput
              label="Warning window — days before expiry"
              sublabel="Items shown in alerts dashboard"
              value={local.expiryWarningDays}
              min={30}
              max={180}
              onChange={(v) => update({ expiryWarningDays: v })}
            />
          </div>

          {/* Visual preview */}
          <div className="flex items-center gap-2 mt-4 px-4 py-3 rounded-xl" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
            <div className="flex-1 h-3 rounded-full overflow-hidden relative" style={{ background: "#f3f4f6" }}>
              <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${(local.expiryCriticalDays / local.expiryWarningDays) * 100}%`, background: "#FF3B30" }} />
              <div className="absolute inset-y-0 rounded-full" style={{ left: `${(local.expiryCriticalDays / local.expiryWarningDays) * 100}%`, right: "30%", background: "#FF9F0A" }} />
              <div className="absolute inset-y-0 right-0 rounded-full" style={{ width: "30%", background: "#ca8a04" }} />
            </div>
            <div className="flex items-center gap-3 text-[10px] font-medium flex-shrink-0">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: "#FF3B30" }} /> &lt;{local.expiryCriticalDays}d</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: "#FF9F0A" }} /> &lt;60d</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: "#ca8a04" }} /> &lt;{local.expiryWarningDays}d</span>
            </div>
          </div>
        </div>

        <div style={{ height: "1px", background: "var(--border)" }} />

        {/* Global stock threshold */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--text-secondary)" }}>
            Stock Alert Thresholds
          </p>
          <div className="flex items-start gap-6">
            <NumInput
              label="Global Low-Stock Threshold"
              sublabel="Applied when no category override is set"
              value={local.globalThreshold}
              min={1}
              max={50}
              onChange={(v) => update({ globalThreshold: v })}
            />
          </div>
        </div>

        {/* Per-category overrides */}
        <div>
          <p className="text-xs font-medium mb-3" style={{ color: "var(--text-secondary)" }}>
            Category-specific overrides
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.filter((c) => c !== "All").map((cat) => (
              <div key={cat} className="flex flex-col gap-1.5 p-3 rounded-xl" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                <label className="text-xs font-semibold" style={{ color: "var(--text)" }}>
                  {cat}
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      setCategoryOverride(
                        cat,
                        Math.max(1, (local.categoryOverrides[cat] ?? local.globalThreshold) - 1)
                      )
                    }
                    className="w-7 h-7 rounded-lg text-sm font-bold flex items-center justify-center"
                    style={{ background: "var(--brand-light)", color: "var(--brand-dark)" }}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={local.categoryOverrides[cat] ?? local.globalThreshold}
                    onChange={(e) =>
                      setCategoryOverride(cat, parseInt(e.target.value) || 1)
                    }
                    className="flex-1 text-center py-1.5 rounded-lg text-sm font-bold outline-none"
                    style={{ background: "white", border: "1px solid var(--border)", color: "var(--text)" }}
                  />
                  <button
                    onClick={() =>
                      setCategoryOverride(
                        cat,
                        Math.min(100, (local.categoryOverrides[cat] ?? local.globalThreshold) + 1)
                      )
                    }
                    className="w-7 h-7 rounded-lg text-sm font-bold flex items-center justify-center"
                    style={{ background: "var(--brand)", color: "#fff" }}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <motion.button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
            style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <RotateCcw size={13} /> Reset to Defaults
          </motion.button>
          <motion.button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{
              background: saved
                ? "#16a34a"
                : "linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)",
              boxShadow: "0 4px 12px rgba(242,167,185,0.35)",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {saved ? (
              <><CheckCircle size={14} /> Saved!</>
            ) : (
              <><Save size={14} /> Save Settings</>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
