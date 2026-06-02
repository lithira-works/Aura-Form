"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Smile,
  Eye,
  Heart,
  Droplets,
  Wind,
  Palette,
  Scissors,
} from "lucide-react";
import type { Category } from "@/lib/mock-data";
import { CATEGORIES } from "@/lib/mock-data";

interface CategoryFilterProps {
  active: Category;
  onChange: (cat: Category) => void;
  counts: Record<string, number>;
}

const ICONS: Record<Category, React.ReactNode> = {
  All: <Layers size={15} />,
  Face: <Smile size={15} />,
  Eyes: <Eye size={15} />,
  Lips: <Heart size={15} />,
  "Skin Care": <Droplets size={15} />,
  Fragrance: <Wind size={15} />,
  Nails: <Palette size={15} />,
  Tools: <Scissors size={15} />,
};

export default function CategoryFilter({
  active,
  onChange,
  counts,
}: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 px-6 py-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
      {CATEGORIES.map((cat) => {
        const isActive = cat === active;
        return (
          <motion.button
            key={cat}
            onClick={() => onChange(cat)}
            className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0"
            style={{
              background: isActive ? "var(--brand)" : "#ffffff",
              color: isActive ? "#ffffff" : "var(--text-secondary)",
              boxShadow: isActive ? "0 4px 14px rgba(242,167,185,0.4)" : "var(--shadow-sm)",
              border: isActive ? "none" : "1px solid var(--border)",
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            layout
          >
            <span className="opacity-80">{ICONS[cat]}</span>
            <span>{cat}</span>
            {counts[cat] !== undefined && (
              <AnimatePresence mode="wait">
                <motion.span
                  key={counts[cat]}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                  style={{
                    background: isActive ? "rgba(255,255,255,0.25)" : "var(--brand-light)",
                    color: isActive ? "#fff" : "var(--brand-dark)",
                  }}
                >
                  {counts[cat]}
                </motion.span>
              </AnimatePresence>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
