"use client";

import { motion } from "framer-motion";
import { CalendarClock, Target } from "lucide-react";
import type { Dmp } from "@/lib/types";

function daysLeft(deadline: string): number {
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
}

export function DmpHighlight({ dmp }: { dmp?: Dmp }) {
  if (!dmp) return null;
  const left = daysLeft(dmp.deadline);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-night-700/80 to-night-800/80 p-6 shadow-glow"
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold/10 blur-2xl" />
      <div className="relative">
        <div className="mb-3 flex items-center gap-2 text-gold">
          <Target size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest">
            Meu Objetivo Principal
          </span>
        </div>
        <p className="font-display text-3xl font-semibold text-ink">
          {dmp.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{dmp.inExchange}</p>
        <div className="mt-4 flex items-center gap-2 text-sm text-ink-muted">
          <CalendarClock size={16} className="text-gold" />
          <span>
            {left > 0 ? (
              <>
                <span className="font-semibold text-ink">{left}</span> dias até{" "}
                {new Date(dmp.deadline).toLocaleDateString("pt-BR")}
              </>
            ) : (
              "Prazo alcançado — hora de redefinir seu objetivo"
            )}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
