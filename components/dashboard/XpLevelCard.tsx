"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Zap } from "lucide-react";
import { useStore } from "@/lib/store";

export function XpLevelCard() {
  const xp = useStore((s) => s.xp);
  const level = useStore((s) => s.level());
  const nextLvl = useStore((s) => s.nextLevel());
  const xpToNext = useStore((s) => s.xpToNextLevel());

  const progress = nextLvl
    ? ((xp - level.minXp) / (nextLvl.minXp - level.minXp)) * 100
    : 100;

  const prevXp = useRef(xp);
  const [delta, setDelta] = useState(0);

  useEffect(() => {
    if (xp > prevXp.current) {
      setDelta(xp - prevXp.current);
      const t = setTimeout(() => setDelta(0), 1500);
      prevXp.current = xp;
      return () => clearTimeout(t);
    }
    prevXp.current = xp;
  }, [xp]);

  return (
    <div className="grid grid-cols-2 gap-3">
      <motion.div whileTap={{ scale: 0.98 }} className="card-surface flex flex-col gap-1 p-4">
        <div className="flex items-center gap-1.5 text-gold">
          <Shield size={18} />
          <span className="text-xs font-medium text-ink-muted">Nível</span>
        </div>
        <p className="font-display text-2xl font-semibold text-ink">{level.label}</p>
      </motion.div>
      <motion.div whileTap={{ scale: 0.98 }} className="card-surface relative flex flex-col gap-1 p-4">
        <div className="flex items-center gap-1.5 text-gold">
          <Zap size={18} />
          <span className="text-xs font-medium text-ink-muted">XP Total</span>
        </div>
        <p className="font-display text-3xl font-semibold text-ink">
          {xp.toLocaleString("pt-BR")}
        </p>
        <AnimatePresence>
          {delta > 0 && (
            <motion.span
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -24 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute right-4 top-3 text-sm font-bold text-gold"
            >
              +{delta} XP
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      {nextLvl && (
        <div className="col-span-2">
          <div className="flex items-center justify-between text-xs text-ink-faint">
            <span>{level.label}</span>
            <span>{xpToNext.toLocaleString("pt-BR")} XP para {nextLvl.label}</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-night-700/60">
            <motion.div
              className="h-full rounded-full bg-gold-gradient"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
