"use client";

import Link from "next/link";
import { Award, ChevronRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { ACHIEVEMENTS } from "@/lib/mock/achievements";
import { AchievementBadge } from "@/components/achievements/AchievementBadge";
import type { GamificationSnapshot } from "@/lib/types";

export function RecentAchievements() {
  const unlocked = useStore((s) => s.unlockedAchievements);
  const streak = useStore((s) => s.streak());
  const bestStreak = useStore((s) => s.bestStreak);
  const completedPrinciples = useStore((s) => s.completedCount());
  const journalEntries = useStore((s) => s.journal.length);
  const chatMessages = useStore((s) => s.chat.filter((m) => m.role === "user").length);
  const hasDmp = useStore((s) => !!s.user.dmp);
  const hasFeedback = useStore((s) => Object.values(s.progress).some((p) => p?.feedback));
  const onboardingCompleted = useStore((s) => s.onboarding.completed);

  const snapshot: GamificationSnapshot = {
    streak,
    bestStreak,
    completedPrinciples,
    journalEntries,
    chatMessages,
    hasDmp,
    hasFeedback,
    onboardingCompleted,
  };

  const recent = [...unlocked].reverse().slice(0, 3);
  const recentDefs = recent
    .map((id) => ACHIEVEMENTS.find((a) => a.id === id))
    .filter(Boolean);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award size={18} className="text-gold" />
          <h3 className="text-sm font-semibold text-ink">Conquistas</h3>
          <span className="rounded-full bg-gold/15 px-2 py-0.5 text-xs font-bold text-gold">
            {unlocked.length}/{ACHIEVEMENTS.length}
          </span>
        </div>
        <Link
          href="/achievements"
          className="flex items-center gap-0.5 text-xs font-medium text-gold"
        >
          Ver todas <ChevronRight size={14} />
        </Link>
      </div>

      {recentDefs.length > 0 ? (
        <div className="flex justify-center gap-5">
          {recentDefs.map((a) => (
            <AchievementBadge
              key={a!.id}
              achievement={a!}
              unlocked
              progress={a!.threshold}
              compact
            />
          ))}
        </div>
      ) : (
        <div className="card-surface p-4 text-center">
          <p className="text-sm text-ink-muted">
            Complete ações para desbloquear conquistas
          </p>
        </div>
      )}
    </div>
  );
}
