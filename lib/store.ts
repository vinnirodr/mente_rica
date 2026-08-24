"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AiFeedback,
  AppNotification,
  ChatMessage,
  Diagnosis,
  Dmp,
  GamificationSnapshot,
  JournalEntry,
  LevelDef,
  MindsetProfile,
  Plan,
  PrincipleProgress,
  ReminderKind,
  ReminderPref,
  UserProfile,
} from "@/lib/types";
import { PRINCIPLES } from "@/lib/mock/principles";
import { ACHIEVEMENTS, getLevel, getNextLevel } from "@/lib/mock/achievements";
import { DEFAULT_REMINDERS, seedJournal, seedNotifications } from "@/lib/mock/seed";
import { track } from "@/lib/analytics";

interface OnboardingState {
  completed: boolean;
  step: number;
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
  setDiagnosis: (diagnosis: Diagnosis) => void;
  recommendedPrincipleId: () => number;
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

  // Gamificação
  xp: number;
  unlockedAchievements: string[];
  addXp: (amount: number, reason: string) => void;
  checkAchievements: () => void;
  level: () => LevelDef;
  nextLevel: () => LevelDef | null;
  xpToNextLevel: () => number;

  resetAll: () => void;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function computeStreak(entries: JournalEntry[]): number {
  if (entries.length === 0) return 0;
  const dates = new Set(entries.map((e) => e.date));
  let streak = 0;
  const cursor = new Date();
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
  plan: "pro",
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
      xp: 0,
      unlockedAchievements: [],

      setOnboardingStep: (step) =>
        set((s) => ({ onboarding: { ...s.onboarding, step } })),
      setName: (name) => set((s) => ({ user: { ...s.user, name } })),
      setMindset: (profile) => set((s) => ({ user: { ...s.user, mindsetProfile: profile } })),
      setDiagnosis: (diagnosis) => set((s) => ({ user: { ...s.user, diagnosis } })),
      recommendedPrincipleId: () => get().user.diagnosis?.recommendedPrincipleId ?? 1,

      setDmp: (dmp) => {
        set((s) => ({ user: { ...s.user, dmp } }));
        get().checkAchievements();
      },

      completeOnboarding: (durationMs) => {
        const { progress } = get();
        const startId = get().recommendedPrincipleId();
        const seededJournal = seedJournal();
        set((s) => ({
          onboarding: { completed: true, step: 5 },
          progress: progress[startId]
            ? progress
            : { ...progress, [startId]: { status: "in_progress" } },
          journal: s.journal.length ? s.journal : seededJournal,
          notifications: s.notifications.length ? s.notifications : seedNotifications(),
          bestStreak: Math.max(s.bestStreak, computeStreak(seededJournal)),
        }));
        track("onboarding_completed", {
          durationMs,
          profile: get().user.mindsetProfile ?? "Construtor",
        });
        get().checkAchievements();
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
      setFeedback: (id, feedback) => {
        set((s) => ({
          progress: {
            ...s.progress,
            [id]: { ...(s.progress[id] ?? { status: "in_progress" }), status: "in_progress", feedback },
          },
        }));
        get().addXp(100, "ai_feedback");
      },
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
        const next = PRINCIPLES.find((p) => p.id === id + 1);
        if (next) {
          get().pushNotification({
            kind: "principle_unlocked",
            title: `Novo passo liberado: ${next.accessibleTitle}`,
            body: "Você concluiu o passo anterior. Continue sua jornada de prática.",
            href: `/principles/${next.id}`,
          });
        }
        get().addXp(200, "principle_completed");
      },

      unlockedCount: () => {
        const { progress } = get();
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
        const recommended = get().recommendedPrincipleId();
        if (progress[recommended]?.status !== "completed") return recommended;
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
        get().addXp(50, "checkin");
        const currentStreak = get().streak();
        if (currentStreak === 7) get().addXp(300, "streak_7");
        if (currentStreak === 30) get().addXp(500, "streak_30");
        if (currentStreak === 90) get().addXp(1000, "streak_90");
      },
      hasCheckedInToday: () => get().journal.some((e) => e.date === todayIso()),

      addChatMessage: (msg) => {
        set((s) => ({ chat: [...s.chat, msg] }));
        if (msg.role === "user") get().checkAchievements();
      },
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

      // ─── Gamificação ───

      addXp: (amount, reason) => {
        const prevXp = get().xp;
        const prevLevel = getLevel(prevXp);
        set((s) => ({ xp: s.xp + amount }));
        const newXp = get().xp;
        const newLevel = getLevel(newXp);
        track("xp_earned", { amount, reason, total: newXp });
        if (newLevel.id !== prevLevel.id) {
          track("level_up", { level: newLevel.label, xp: newXp });
          get().pushNotification({
            kind: "achievement",
            title: `Nível alcançado: ${newLevel.label}`,
            body: `Você atingiu ${newXp} XP e subiu de nível!`,
            href: "/achievements",
          });
        }
        get().checkAchievements();
      },

      checkAchievements: () => {
        const state = get();
        const snapshot: GamificationSnapshot = {
          streak: state.streak(),
          bestStreak: state.bestStreak,
          completedPrinciples: state.completedCount(),
          journalEntries: state.journal.length,
          chatMessages: state.chat.filter((m) => m.role === "user").length,
          hasDmp: !!state.user.dmp,
          hasFeedback: Object.values(state.progress).some((p) => p?.feedback),
          onboardingCompleted: state.onboarding.completed,
        };
        const newUnlocks: string[] = [];
        for (const a of ACHIEVEMENTS) {
          if (state.unlockedAchievements.includes(a.id)) continue;
          if (a.checkProgress(snapshot) >= a.threshold) {
            newUnlocks.push(a.id);
          }
        }
        if (newUnlocks.length > 0) {
          set((s) => ({
            unlockedAchievements: [...s.unlockedAchievements, ...newUnlocks],
          }));
          for (const id of newUnlocks) {
            const a = ACHIEVEMENTS.find((x) => x.id === id)!;
            track("achievement_unlocked", { id: a.id, title: a.title });
            get().pushNotification({
              kind: "achievement",
              title: `Conquista: ${a.title}`,
              body: a.description,
              href: "/achievements",
            });
          }
        }
      },

      level: () => getLevel(get().xp),
      nextLevel: () => getNextLevel(get().xp),
      xpToNextLevel: () => {
        const next = getNextLevel(get().xp);
        return next ? next.minXp - get().xp : 0;
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
          xp: 0,
          unlockedAchievements: [],
        }),
    }),
    {
      name: "mindrich-store",
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);
