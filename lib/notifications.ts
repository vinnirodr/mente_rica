"use client";

import { REMINDER_META } from "@/lib/mock/seed";
import type { ReminderKind } from "@/lib/types";
import { useStore } from "@/lib/store";

// Agendador de lembretes SIMULADO. No produto real isso vira Firebase Cloud Messaging
// (push), mas aqui demonstramos a UX completa do canal principal: o lembrete vira uma
// notificação in-app no horário escolhido. A interface (`fireReminder`) permanece a
// mesma — trocar o transporte por FCM depois não afeta os componentes.

const REMINDER_BODIES: Record<ReminderKind, { title: string; body: string; href: string }> = {
  morning_ritual: {
    title: "🌅 Ritual da manhã",
    body: "Bom dia! Releia seu objetivo principal e visualize sua conquista por 5 minutos.",
    href: "/dashboard",
  },
  evening_reflection: {
    title: "🌙 Reflexão da noite",
    body: "Como foi seu dia? Faça seu check-in e entregue uma pergunta ao subconsciente.",
    href: "/journal",
  },
  streak_risk: {
    title: "🔥 Sua sequência está em risco",
    body: "Faltam poucas horas para o dia acabar. Faça seu check-in e mantenha o ritmo.",
    href: "/journal",
  },
  principle_unlocked: {
    title: "🔓 Continue sua jornada",
    body: "Há um princípio esperando sua prática. Cada passo te aproxima do seu objetivo.",
    href: "/principles",
  },
};

/** Dispara imediatamente um lembrete como notificação in-app (botão "testar agora"). */
export function fireReminder(kind: ReminderKind): void {
  const meta = REMINDER_BODIES[kind];
  useStore.getState().pushNotification({
    kind,
    title: meta.title,
    body: meta.body,
    href: meta.href,
  });
}

export function reminderLabel(kind: ReminderKind): string {
  return REMINDER_META[kind].label;
}
