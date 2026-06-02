"use client";

import { useEffect, useRef, useCallback } from "react";

interface UseBarcodeOptions {
  onScan: (barcode: string) => void;
  /** Minimum length to be treated as a valid barcode scan */
  minLength?: number;
  /** Max ms between keystrokes to be considered a scanner (not manual typing) */
  maxKeystrokeGap?: number;
}

/**
 * Listens for rapid-fire keystrokes ending in Enter — the signature of a USB/Bluetooth
 * barcode scanner. Fires onScan with the accumulated code.
 */
export function useBarcode({
  onScan,
  minLength = 8,
  maxKeystrokeGap = 50,
}: UseBarcodeOptions) {
  const buffer = useRef<string>("");
  const lastKeyTime = useRef<number>(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const now = Date.now();
      const gap = now - lastKeyTime.current;
      lastKeyTime.current = now;

      // Reset if gap is too large (manual typing, not scanner)
      if (gap > maxKeystrokeGap && buffer.current.length > 0) {
        buffer.current = "";
      }

      if (e.key === "Enter") {
        const code = buffer.current.trim();
        if (code.length >= minLength) {
          onScan(code);
        }
        buffer.current = "";
        return;
      }

      // Ignore modifier keys
      if (e.key.length === 1) {
        buffer.current += e.key;
      }
    },
    [onScan, minLength, maxKeystrokeGap]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
