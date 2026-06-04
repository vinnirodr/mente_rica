"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { REMINDER_META } from "@/lib/mock/seed";
import type { ReminderKind } from "@/lib/types";

// Passo 4: escolha de horários dos lembretes. Alimenta o sistema de notificações.
const FOCUS: ReminderKind[] = ["morning_ritual", "evening_reflection"];

export function ReminderTimeStep({
  onNext,
}: {
  onNext: (prefs: { kind: ReminderKind; time: string; enabled: boolean }[]) => void;
}) {
  const [state, setState] = useState<Record<string, { time: string; enabled: boolean }>>({
    morning_ritual: { time: "07:00", enabled: true },
    evening_reflection: { time: "21:30", enabled: true },
  });

  return (
    <div className="flex min-h-full flex-col gap-6 py-6">
      <div className="space-y-3">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 text-gold"
        >
          <Bell size={26} />
        </motion.div>
        <h2 className="font-display text-2xl leading-snug">Seus rituais diários</h2>
        <p className="text-sm text-ink-muted">
          O livro fala de rituais de manhã e noite. Escolha quando o MindRich vai te
          lembrar de praticar — você pode ajustar depois.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {FOCUS.map((kind) => {
          const meta = REMINDER_META[kind];
          const s = state[kind];
          return (
            <div
              key={kind}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-night-800/60 p-4"
            >
              <span className="text-2xl">{meta.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">{meta.label}</p>
                <input
                  type="time"
                  value={s.time}
                  disabled={!s.enabled}
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, [kind]: { ...prev[kind], time: e.target.value } }))
                  }
                  className="mt-1 rounded-lg bg-transparent text-lg font-semibold tabular-nums text-gold outline-none disabled:opacity-40"
                />
              </div>
              <Switch
                checked={s.enabled}
                onChange={(v) =>
                  setState((prev) => ({ ...prev, [kind]: { ...prev[kind], enabled: v } }))
                }
                label={meta.label}
              />
            </div>
          );
        })}
      </div>

      <Button
        size="lg"
        className="mt-auto w-full"
        onClick={() =>
          onNext(
            FOCUS.map((kind) => ({ kind, time: state[kind].time, enabled: state[kind].enabled })),
          )
        }
      >
        Definir lembretes
      </Button>
    </div>
  );
}
