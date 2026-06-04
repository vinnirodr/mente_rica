"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Principle, PrincipleStatus } from "@/lib/types";

const STATUS_STYLE: Record<PrincipleStatus, string> = {
  locked: "border-white/5 bg-night-800/40 opacity-60",
  not_started: "border-white/10 bg-night-800/60",
  in_progress: "border-gold/40 bg-night-800/80 shadow-glow",
  completed: "border-emerald-400/30 bg-night-800/70",
};

export function PrincipleCard({
  principle,
  status,
  index,
}: {
  principle: Principle;
  status: PrincipleStatus;
  index: number;
}) {
  const locked = status === "locked";
  const body = (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      whileTap={locked ? undefined : { scale: 0.97 }}
      className={cn(
        "relative flex aspect-[4/5] flex-col justify-between rounded-3xl border p-4 transition-colors",
        STATUS_STYLE[status],
        !locked && "hover:border-gold/40",
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-2xl font-display text-lg",
            status === "completed"
              ? "bg-emerald-400/15 text-emerald-300"
              : status === "in_progress"
                ? "bg-gold/15 text-gold"
                : "bg-white/5 text-ink-muted",
          )}
        >
          {principle.id}
        </span>
        {status === "completed" && (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
            <Check size={14} />
          </span>
        )}
        {locked && <Lock size={16} className="text-ink-faint" />}
        {status === "in_progress" && (
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-gold" />
        )}
      </div>
      <div>
        <p className="font-display text-base leading-tight text-ink">{principle.title}</p>
        <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-ink-faint">
          {principle.subtitle}
        </p>
      </div>
    </motion.div>
  );

  if (locked) return body;
  return <Link href={`/principles/${principle.id}`}>{body}</Link>;
}
