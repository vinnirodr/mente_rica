"use client";

import { useStore } from "@/lib/store";
import { ACHIEVEMENTS, CATEGORY_LABELS } from "@/lib/mock/achievements";
import { AchievementBadge } from "@/components/achievements/AchievementBadge";
import type { AchievementCategory, GamificationSnapshot } from "@/lib/types";

const CATEGORIES: AchievementCategory[] = ["streak", "principles", "journal", "coach", "special"];

export function AchievementGrid() {
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

  return (
    <div className="space-y-6">
      {CATEGORIES.map((cat) => {
        const items = ACHIEVEMENTS.filter((a) => a.category === cat);
        if (items.length === 0) return null;
        return (
          <div key={cat}>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-faint">
              {CATEGORY_LABELS[cat]}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {items.map((a) => (
                <AchievementBadge
                  key={a.id}
                  achievement={a}
                  unlocked={unlocked.includes(a.id)}
                  progress={a.checkProgress(snapshot)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
