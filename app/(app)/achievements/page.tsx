"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Award, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { ACHIEVEMENTS } from "@/lib/mock/achievements";
import { AchievementGrid } from "@/components/achievements/AchievementGrid";

export default function AchievementsPage() {
  const xp = useStore((s) => s.xp);
  const level = useStore((s) => s.level());
  const unlocked = useStore((s) => s.unlockedAchievements);
  const nextLvl = useStore((s) => s.nextLevel());

  const progress = nextLvl
    ? ((xp - level.minXp) / (nextLvl.minXp - level.minXp)) * 100
    : 100;

  return (
    <div>
      <header className="flex items-center gap-3 px-5 pt-6 pb-2">
        <Link href="/dashboard" className="text-ink-faint">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="font-display text-xl">Conquistas</h1>
      </header>

      <div className="space-y-6 px-5 pb-8">
        {/* Summary card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-surface space-y-4 border border-gold/15 p-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15">
                <Shield size={24} className="text-gold" />
              </div>
              <div>
                <p className="font-display text-xl font-semibold text-ink">{level.label}</p>
                <p className="text-xs text-ink-faint">Nível atual</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-gold">
                <Zap size={16} />
                <span className="font-display text-xl font-semibold">{xp.toLocaleString("pt-BR")}</span>
              </div>
              <p className="text-xs text-ink-faint">XP total</p>
            </div>
          </div>

          {nextLvl && (
            <div>
              <div className="flex items-center justify-between text-xs text-ink-faint">
                <span>{level.label}</span>
                <span>{nextLvl.label}</span>
              </div>
              <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-night-700/60">
                <motion.div
                  className="h-full rounded-full bg-gold-gradient"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 rounded-xl bg-gold/10 py-2">
            <Award size={16} className="text-gold" />
            <span className="text-sm font-semibold text-gold">
              {unlocked.length}/{ACHIEVEMENTS.length} conquistas
            </span>
          </div>
        </motion.div>

        <AchievementGrid />
      </div>
    </div>
  );
}
