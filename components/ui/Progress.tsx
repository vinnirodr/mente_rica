"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export function ProgressBar({
  value,
  className,
  showLabel,
}: {
  value: number; // 0..100
  className?: string;
  showLabel?: boolean;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-night-700/60">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gold-gradient"
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
      {showLabel && (
        <span className="w-10 text-right text-sm font-semibold tabular-nums text-gold">
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
}

export function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <motion.span
          key={i}
          animate={{
            width: i === current ? 24 : 8,
            backgroundColor: i <= current ? "#E8B84B" : "rgba(255,255,255,0.15)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="h-2 rounded-full"
        />
      ))}
    </div>
  );
}
