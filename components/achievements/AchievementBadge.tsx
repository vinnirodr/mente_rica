"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  Crown,
  Flame,
  MessageCircle,
  PenLine,
  Scroll,
  Shield,
  Sparkles,
  Sunrise,
  Target,
} from "lucide-react";
import type { AchievementDef } from "@/lib/types";

const ICONS: Record<string, typeof Flame> = {
  Flame,
  Shield,
  BookOpen,
  Crown,
  PenLine,
  Scroll,
  MessageCircle,
  Brain,
  Sparkles,
  Target,
  Sunrise,
};

interface Props {
  achievement: AchievementDef;
  unlocked: boolean;
  progress: number;
  compact?: boolean;
}

export function AchievementBadge({ achievement, unlocked, progress, compact }: Props) {
  const Icon = ICONS[achievement.icon] ?? Sparkles;
  const pct = Math.min(progress / achievement.threshold, 1);
  const size = compact ? 56 : 72;
  const iconSize = compact ? 22 : 28;
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <motion.div
      initial={unlocked ? { scale: 0.8, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 16 }}
      className="flex flex-col items-center gap-1.5"
    >
      <div
        className={`relative flex items-center justify-center rounded-2xl ${
          unlocked
            ? "border border-gold/30 bg-gold/10 shadow-glow"
            : "border border-white/10 bg-white/5"
        }`}
        style={{ width: size, height: size }}
      >
        <Icon
          size={iconSize}
          className={unlocked ? "text-gold" : "text-ink-faint"}
        />
        {!unlocked && pct > 0 && pct < 1 && (
          <svg
            className="absolute inset-0"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="rgba(232,184,75,0.2)"
              strokeWidth={2}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#E8B84B"
              strokeWidth={2}
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - pct)}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </svg>
        )}
        {!unlocked && (
          <span className="absolute -bottom-1 -right-1 rounded-full bg-night-800 px-1.5 py-0.5 text-[10px] font-bold text-ink-faint">
            {Math.floor(pct * achievement.threshold)}/{achievement.threshold}
          </span>
        )}
      </div>
      <div className="text-center">
        <p
          className={`text-xs font-medium leading-tight ${
            unlocked ? "text-ink" : "text-ink-faint"
          } ${compact ? "max-w-[70px]" : "max-w-[90px]"}`}
        >
          {achievement.title}
        </p>
        {!compact && (
          <p className="mt-0.5 max-w-[100px] text-[10px] leading-tight text-ink-faint">
            {achievement.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
