"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface ChartBoxProps {
  height: number;
  children: (width: number, height: number) => ReactNode;
  className?: string;
}

/** Measures a stable pixel size before rendering Recharts (avoids width/height -1). */
export default function ChartBox({ height, children, className = "" }: ChartBoxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const { width, height: h } = el.getBoundingClientRect();
      if (width > 0 && h > 0) {
        setSize({ width: Math.floor(width), height: Math.floor(h) });
      }
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [height]);

  return (
    <div
      ref={ref}
      className={`w-full min-w-0 ${className}`}
      style={{ height, minHeight: height }}
    >
      {size.width > 0 ? children(size.width, size.height) : (
        <div
          className="w-full h-full rounded-xl animate-pulse"
          style={{ background: "var(--bg)" }}
        />
      )}
    </div>
  );
}
