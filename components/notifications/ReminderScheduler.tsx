"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useStore } from "@/lib/store";
import { REMINDER_META } from "@/lib/mock/seed";
import { fireReminder } from "@/lib/notifications";
import { Switch } from "@/components/ui/Switch";

// Preferências de lembrete: tipo, horário, on/off e "testar agora" (dispara o
// lembrete imediatamente como notificação in-app — simula o push do FCM).
export function ReminderScheduler() {
  const reminders = useStore((s) => s.reminders);
  const setReminder = useStore((s) => s.setReminder);

  return (
    <div className="space-y-3">
      {reminders.map((r) => {
        const meta = REMINDER_META[r.kind];
        const hasTime = r.kind === "morning_ritual" || r.kind === "evening_reflection";
        return (
          <motion.div
            key={r.kind}
            layout
            className="card-surface space-y-3 p-4"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{meta.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">{meta.label}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">
                  {meta.description}
                </p>
              </div>
              <Switch
                checked={r.enabled}
                onChange={(v) => setReminder(r.kind, { enabled: v })}
                label={meta.label}
              />
            </div>

            {r.enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center justify-between gap-2 border-t border-white/5 pt-3"
              >
                {hasTime ? (
                  <label className="flex items-center gap-2 text-sm text-ink-muted">
                    Horário
                    <input
                      type="time"
                      value={r.time}
                      onChange={(e) => setReminder(r.kind, { time: e.target.value })}
                      className="rounded-lg bg-night-700/60 px-2 py-1 font-semibold tabular-nums text-gold outline-none"
                    />
                  </label>
                ) : (
                  <span className="text-xs text-ink-faint">Disparado automaticamente</span>
                )}
                <button
                  onClick={() => fireReminder(r.kind)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold transition-colors hover:bg-gold/20"
                >
                  <Send size={13} /> Testar agora
                </button>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
