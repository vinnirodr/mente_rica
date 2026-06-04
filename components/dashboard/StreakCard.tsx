"use client";

import { motion } from "framer-motion";
import { Flame, Trophy } from "lucide-react";

export function StreakCard({ streak, best }: { streak: number; best: number }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="card-surface flex flex-col gap-1 p-4"
      >
        <div className="flex items-center gap-1.5 text-ember">
          <Flame size={18} />
          <span className="text-xs font-medium text-ink-muted">Sequência</span>
        </div>
        <p className="font-display text-3xl font-semibold text-ink">
          {streak}
          <span className="ml-1 text-sm font-normal text-ink-faint">dias</span>
        </p>
      </motion.div>
      <motion.div whileTap={{ scale: 0.98 }} className="card-surface flex flex-col gap-1 p-4">
        <div className="flex items-center gap-1.5 text-gold">
          <Trophy size={18} />
          <span className="text-xs font-medium text-ink-muted">Recorde</span>
        </div>
        <p className="font-display text-3xl font-semibold text-ink">
          {best}
          <span className="ml-1 text-sm font-normal text-ink-faint">dias</span>
        </p>
      </motion.div>
    </div>
  );
}
