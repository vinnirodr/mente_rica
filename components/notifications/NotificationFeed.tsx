"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Award, Bell, BellOff, Flame, Sunrise, Moon, Unlock } from "lucide-react";
import type { AppNotification } from "@/lib/types";
import { cn } from "@/lib/cn";

const ICONS: Record<string, typeof Bell> = {
  morning_ritual: Sunrise,
  evening_reflection: Moon,
  streak_risk: Flame,
  principle_unlocked: Unlock,
  achievement: Award,
  system: Bell,
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} h`;
  return `${Math.floor(h / 24)} d`;
}

export function NotificationFeed({
  notifications,
  onRead,
}: {
  notifications: AppNotification[];
  onRead: (id: string) => void;
}) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center text-ink-faint">
        <BellOff size={28} />
        <p className="text-sm">Nenhuma notificação por aqui ainda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {notifications.map((n) => {
          const Icon = ICONS[n.kind] ?? Bell;
          const inner = (
            <motion.div
              layout
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              onClick={() => !n.read && onRead(n.id)}
              className={cn(
                "flex items-start gap-3 rounded-2xl border p-4 transition-colors",
                n.read
                  ? "border-white/5 bg-night-800/40"
                  : "border-gold/20 bg-gold/5",
              )}
            >
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  n.read ? "bg-white/5 text-ink-muted" : "bg-gold/15 text-gold",
                )}
              >
                <Icon size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-ink">{n.title}</p>
                  <span className="shrink-0 text-[11px] text-ink-faint">
                    {relativeTime(n.createdAt)}
                  </span>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">{n.body}</p>
              </div>
              {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold" />}
            </motion.div>
          );
          return n.href ? (
            <Link key={n.id} href={n.href} onClick={() => onRead(n.id)}>
              {inner}
            </Link>
          ) : (
            <div key={n.id}>{inner}</div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
