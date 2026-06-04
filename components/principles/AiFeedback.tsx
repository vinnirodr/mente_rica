"use client";

import { motion } from "framer-motion";
import { Compass, Sparkles, Target } from "lucide-react";
import type { AiFeedback as AiFeedbackType } from "@/lib/types";

// Renderiza o feedback estruturado do Coach IA (alinhamento / lacuna / ação) — crit. 4.2.
const ROWS = [
  { key: "alignment", label: "Alinhamento", icon: Sparkles, tone: "text-emerald-300 bg-emerald-400/10" },
  { key: "gap", label: "Lacuna", icon: Compass, tone: "text-gold bg-gold/10" },
  { key: "action", label: "Próxima ação", icon: Target, tone: "text-ember bg-ember/10" },
] as const;

export function AiFeedbackView({ feedback }: { feedback: AiFeedbackType }) {
  return (
    <div className="space-y-3">
      {ROWS.map((row, i) => {
        const Icon = row.icon;
        return (
          <motion.div
            key={row.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-surface flex gap-3 p-4"
          >
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${row.tone}`}>
              <Icon size={18} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint">
                {row.label}
              </p>
              <p className="mt-0.5 text-sm leading-relaxed text-ink">{feedback[row.key]}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function AiFeedbackSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="card-surface flex gap-3 p-4">
          <div className="skeleton h-9 w-9 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-3 w-24" />
            <div className="skeleton h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
