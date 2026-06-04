"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full border transition-colors",
        checked ? "bg-gold/90 border-gold" : "bg-night-700/80 border-white/10",
      )}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full shadow",
          checked ? "left-[22px] bg-night" : "left-0.5 bg-ink-muted",
        )}
      />
    </button>
  );
}
