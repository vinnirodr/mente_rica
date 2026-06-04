"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AiFeedback,
  AppNotification,
  ChatMessage,
  Dmp,
  JournalEntry,
  MindsetProfile,
  Plan,
  PrincipleProgress,
  ReminderKind,
  ReminderPref,
  UserProfile,
} from "@/lib/types";
import { PRINCIPLES } from "@/lib/mock/principles";
import { DEFAULT_REMINDERS, seedJournal, seedNotifications } from "@/lib/mock/seed";
import { track } from "@/lib/analytics";

interface OnboardingState {
  completed: boolean;
  step: number; // último passo alcançado (retomada — US-04)
}

interface MindRichState {
  hydrated: boolean;
  setHydrated: () => void;

  user: UserProfile;
  onboarding: OnboardingState;

  progress: Record<number, PrincipleProgress | undefined>;
  journal: JournalEntry[];
  chat: ChatMessage[];
  reminders: ReminderPref[];
  notifications: AppNotification[];

  // Onboarding
  setOnboardingStep: (step: number) => void;
  setName: (name: string) => void;
  setMindset: (profile: MindsetProfile) => void;
  setDmp: (dmp: Dmp) => void;
  completeOnboarding: (durationMs: number) => void;

  // Princípios / prática
  startPrinciple: (id: number) => void;
  setReflection: (id: number, text: string) => void;
  setFeedback: (id: number, feedback: AiFeedback) => void;
  completePrinciple: (id: number) => void;
  unlockedCount: () => number;
  currentPrincipleId: () => number;
  completedCount: () => number;

  // Diário
  streak: () => number;
  bestStreak: number;
  addJournalEntry: (entry: JournalEntry) => void;
  hasCheckedInToday: () => boolean;

  // Coach
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;

  // Notificações
  setReminder: (kind: ReminderKind, patch: Partial<ReminderPref>) => void;
  pushNotification: (n: Omit<AppNotification, "id" | "createdAt" | "read">) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  unreadCount: () => number;

  // Assinatura
  setPlan: (plan: Plan) => void;

  resetAll: () => void;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Calcula a sequência de dias consecutivos com check-in, terminando hoje ou ontem. */
function computeStreak(entries: JournalEntry[]): number {
  if (entries.length === 0) return 0;
  const dates = new Set(entries.map((e) => e.date));
  let streak = 0;
  const cursor = new Date();
  // Permite que a sequência conte se houve check-in hoje OU ontem (ainda "viva").
  if (!dates.has(cursor.toISOString().slice(0, 10))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!dates.has(cursor.toISOString().slice(0, 10))) return 0;
  }
  while (dates.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

const INITIAL_USER: UserProfile = {
  name: "",
  email: "",
  plan: "pro", // protótipo abre como Pro para demonstrar todas as features; alternável em Configurações
};

export const useStore = create<MindRichState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),

      user: INITIAL_USER,
      onboarding: { completed: false, step: 0 },

      progress: {},
      journal: [],
      chat: [],
      reminders: DEFAULT_REMINDERS,
      notifications: [],
      bestStreak: 0,

      setOnboardingStep: (step) =>
        set((s) => ({ onboarding: { ...s.onboarding, step } })),
      setName: (name) => set((s) => ({ user: { ...s.user, name } })),
      setMindset: (profile) => set((s) => ({ user: { ...s.user, mindsetProfile: profile } })),
      setDmp: (dmp) => set((s) => ({ user: { ...s.user, dmp } })),

      completeOnboarding: (durationMs) => {
        const { progress } = get();
        // Garante que o primeiro princípio esteja iniciado e popula dados de exemplo.
        const seededJournal = seedJournal();
        set((s) => ({
          onboarding: { completed: true, step: 5 },
          progress: progress[1] ? progress : { ...progress, 1: { status: "in_progress" } },
          journal: s.journal.length ? s.journal : seededJournal,
          notifications: s.notifications.length ? s.notifications : seedNotifications(),
          bestStreak: Math.max(s.bestStreak, computeStreak(seededJournal)),
        }));
        track("onboarding_completed", {
          durationMs,
          profile: get().user.mindsetProfile ?? "Construtor",
        });
      },

      startPrinciple: (id) => {
        if (get().progress[id]) return;
        set((s) => ({ progress: { ...s.progress, [id]: { status: "in_progress" } } }));
        track("principle_started", { id });
      },
      setReflection: (id, text) =>
        set((s) => ({
          progress: {
            ...s.progress,
            [id]: { ...(s.progress[id] ?? { status: "in_progress" }), reflection: text },
          },
        })),
      setFeedback: (id, feedback) =>
        set((s) => ({
          progress: {
            ...s.progress,
            [id]: { ...(s.progress[id] ?? { status: "in_progress" }), status: "in_progress", feedback },
          },
        })),
      completePrinciple: (id) => {
        set((s) => ({
          progress: {
            ...s.progress,
            [id]: {
              ...(s.progress[id] ?? { status: "in_progress" }),
              status: "completed",
              completedAt: new Date().toISOString(),
            },
          },
        }));
        track("principle_completed", { id });
        // Desbloqueio progressivo → notifica o próximo princípio.
        const next = PRINCIPLES.find((p) => p.id === id + 1);
        if (next) {
          get().pushNotification({
            kind: "principle_unlocked",
            title: `Princípio ${next.id} desbloqueado: ${next.title}`,
            body: "Você concluiu o princípio anterior. Continue sua jornada de prática.",
            href: `/principles/${next.id}`,
          });
        }
      },

      unlockedCount: () => {
        const { progress } = get();
        // Princípios 1–3 sempre disponíveis; demais liberam ao concluir o anterior.
        let unlocked = 3;
        for (let id = 3; id < 13; id++) {
          if (progress[id]?.status === "completed") unlocked = Math.max(unlocked, id + 1);
        }
        return Math.min(unlocked, 13);
      },
      currentPrincipleId: () => {
        const { progress } = get();
        const inProgress = PRINCIPLES.find((p) => progress[p.id]?.status === "in_progress");
        if (inProgress) return inProgress.id;
        const firstNotDone = PRINCIPLES.find((p) => progress[p.id]?.status !== "completed");
        return firstNotDone?.id ?? 13;
      },
      completedCount: () =>
        Object.values(get().progress).filter((p) => p?.status === "completed").length,

      streak: () => computeStreak(get().journal),
      addJournalEntry: (entry) => {
        set((s) => {
          const journal = [...s.journal.filter((e) => e.date !== entry.date), entry].sort(
            (a, b) => a.date.localeCompare(b.date),
          );
          const newStreak = computeStreak(journal);
          return { journal, bestStreak: Math.max(s.bestStreak, newStreak) };
        });
        track("journal_checkin_completed", { streak: get().streak() });
      },
      hasCheckedInToday: () => get().journal.some((e) => e.date === todayIso()),

      addChatMessage: (msg) => set((s) => ({ chat: [...s.chat, msg] })),
      clearChat: () => set({ chat: [] }),

      setReminder: (kind, patch) =>
        set((s) => ({
          reminders: s.reminders.map((r) => (r.kind === kind ? { ...r, ...patch } : r)),
        })),
      pushNotification: (n) =>
        set((s) => ({
          notifications: [
            {
              ...n,
              id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              createdAt: new Date().toISOString(),
              read: false,
            },
            ...s.notifications,
          ],
        })),
      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      markAllRead: () =>
        set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      unreadCount: () => get().notifications.filter((n) => !n.read).length,

      setPlan: (plan) => {
        set((s) => ({ user: { ...s.user, plan } }));
        if (plan !== "free") track("subscription_started", { plan });
      },

      resetAll: () =>
        set({
          user: INITIAL_USER,
          onboarding: { completed: false, step: 0 },
          progress: {},
          journal: [],
          chat: [],
          reminders: DEFAULT_REMINDERS,
          notifications: [],
          bestStreak: 0,
        }),
    }),
    {
      name: "mindrich-store",
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);
