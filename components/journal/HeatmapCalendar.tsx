"use client";

import { motion } from "framer-motion";
import type { JournalEntry } from "@/lib/types";

// Heatmap estilo GitHub das últimas ~13 semanas de check-ins.
const WEEKS = 13;
const DAYS = WEEKS * 7;

export function HeatmapCalendar({ entries }: { entries: JournalEntry[] }) {
  const done = new Set(entries.map((e) => e.date));
  const today = new Date();

  // Constrói os dias do mais antigo ao mais recente, alinhando a coluna final a hoje.
  const cells: { date: string; active: boolean }[] = [];
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    cells.push({ date: iso, active: done.has(iso) });
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-ink-faint">
        <span>13 semanas</span>
        <span>{entries.length} check-ins</span>
      </div>
      <div className="grid grid-flow-col grid-rows-7 gap-1">
        {cells.map((cell, i) => (
          <motion.div
            key={cell.date}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.001 }}
            title={cell.date}
            className={
              "aspect-square rounded-[3px] " +
              (cell.active ? "bg-gold shadow-[0_0_6px_rgba(232,184,75,0.5)]" : "bg-night-700/50")
            }
          />
        ))}
      </div>
      <div className="flex items-center justify-end gap-1.5 text-[10px] text-ink-faint">
        <span>menos</span>
        <span className="h-2.5 w-2.5 rounded-[3px] bg-night-700/50" />
        <span className="h-2.5 w-2.5 rounded-[3px] bg-gold/40" />
        <span className="h-2.5 w-2.5 rounded-[3px] bg-gold" />
        <span>mais</span>
      </div>
    </div>
  );
}
