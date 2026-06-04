import type { AppNotification, JournalEntry, ReminderPref } from "@/lib/types";

// Dados de exemplo para que o protótipo já abra "vivo" após o onboarding.

export function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export const DEFAULT_REMINDERS: ReminderPref[] = [
  { kind: "morning_ritual", enabled: true, time: "07:00" },
  { kind: "evening_reflection", enabled: true, time: "21:30" },
  { kind: "streak_risk", enabled: true, time: "20:00" },
  { kind: "principle_unlocked", enabled: true, time: "09:00" },
];

export const REMINDER_META: Record<
  ReminderPref["kind"],
  { label: string; description: string; emoji: string }
> = {
  morning_ritual: {
    label: "Ritual da manhã",
    description: "Visualize seu objetivo e leia seu DMP ao acordar.",
    emoji: "🌅",
  },
  evening_reflection: {
    label: "Reflexão da noite",
    description: "Registre o dia e entregue uma pergunta ao subconsciente.",
    emoji: "🌙",
  },
  streak_risk: {
    label: "Risco de perder a sequência",
    description: "Aviso quando faltar pouco para o dia acabar sem check-in.",
    emoji: "🔥",
  },
  principle_unlocked: {
    label: "Novo princípio desbloqueado",
    description: "Saiba na hora quando um novo princípio ficar disponível.",
    emoji: "🔓",
  },
};

export function seedJournal(): JournalEntry[] {
  return [
    {
      date: isoDaysAgo(2),
      answers: ["Sim", "Reli meu objetivo logo cedo", "Determinação"],
      reflection: "Comecei o dia relendo meu propósito. Senti mais foco nas decisões.",
      principleId: 1,
    },
    {
      date: isoDaysAgo(1),
      answers: ["Sim", "Dei um passo no plano", "Confiança"],
      reflection: "Avancei em uma tarefa que vinha adiando. Pequeno passo, grande alívio.",
      principleId: 1,
    },
  ];
}

export function seedNotifications(): AppNotification[] {
  return [
    {
      id: "seed-welcome",
      kind: "system",
      title: "Bem-vindo ao MindRich",
      body: "Sua jornada de prática começa agora. Vamos transformar conhecimento em ação.",
      createdAt: new Date().toISOString(),
      read: false,
      href: "/dashboard",
    },
  ];
}
