import type { AchievementDef, LevelDef } from "@/lib/types";

export const ACHIEVEMENTS: AchievementDef[] = [
  // Streak
  {
    id: "streak-1",
    title: "Primeira Faísca",
    description: "Complete 1 dia de sequência",
    category: "streak",
    icon: "Flame",
    threshold: 1,
    checkProgress: (s) => s.bestStreak,
  },
  {
    id: "streak-7",
    title: "Chama Constante",
    description: "Mantenha 7 dias seguidos de check-in",
    category: "streak",
    icon: "Flame",
    threshold: 7,
    checkProgress: (s) => s.bestStreak,
  },
  {
    id: "streak-30",
    title: "Fogo Sagrado",
    description: "30 dias consecutivos de prática",
    category: "streak",
    icon: "Flame",
    threshold: 30,
    checkProgress: (s) => s.bestStreak,
  },
  {
    id: "streak-90",
    title: "Inquebrantável",
    description: "90 dias sem falhar — persistência pura",
    category: "streak",
    icon: "Shield",
    threshold: 90,
    checkProgress: (s) => s.bestStreak,
  },
  // Princípios
  {
    id: "principles-1",
    title: "Primeiro Passo",
    description: "Complete seu primeiro princípio",
    category: "principles",
    icon: "BookOpen",
    threshold: 1,
    checkProgress: (s) => s.completedPrinciples,
  },
  {
    id: "principles-7",
    title: "Metade do Caminho",
    description: "Complete 7 dos 13 princípios",
    category: "principles",
    icon: "BookOpen",
    threshold: 7,
    checkProgress: (s) => s.completedPrinciples,
  },
  {
    id: "principles-13",
    title: "Mestre dos 13",
    description: "Domine todos os 13 princípios",
    category: "principles",
    icon: "Crown",
    threshold: 13,
    checkProgress: (s) => s.completedPrinciples,
  },
  // Diário
  {
    id: "journal-1",
    title: "Voz Interior",
    description: "Faça seu primeiro check-in no diário",
    category: "journal",
    icon: "PenLine",
    threshold: 1,
    checkProgress: (s) => s.journalEntries,
  },
  {
    id: "journal-10",
    title: "Escritor Dedicado",
    description: "Registre 10 entradas no diário",
    category: "journal",
    icon: "PenLine",
    threshold: 10,
    checkProgress: (s) => s.journalEntries,
  },
  {
    id: "journal-30",
    title: "Cronista",
    description: "30 registros — sua história está sendo escrita",
    category: "journal",
    icon: "Scroll",
    threshold: 30,
    checkProgress: (s) => s.journalEntries,
  },
  // Coach
  {
    id: "coach-1",
    title: "Buscador",
    description: "Converse com o Coach IA pela primeira vez",
    category: "coach",
    icon: "MessageCircle",
    threshold: 1,
    checkProgress: (s) => s.chatMessages,
  },
  {
    id: "coach-10",
    title: "Mente Aberta",
    description: "Troque 10 mensagens com o Coach",
    category: "coach",
    icon: "Brain",
    threshold: 10,
    checkProgress: (s) => s.chatMessages,
  },
  {
    id: "feedback-1",
    title: "Reflexão Profunda",
    description: "Receba seu primeiro feedback da IA",
    category: "coach",
    icon: "Sparkles",
    threshold: 1,
    checkProgress: (s) => (s.hasFeedback ? 1 : 0),
  },
  // Especial
  {
    id: "special-dmp",
    title: "Grande Objetivo",
    description: "Defina seu propósito definitivo",
    category: "special",
    icon: "Target",
    threshold: 1,
    checkProgress: (s) => (s.hasDmp ? 1 : 0),
  },
  {
    id: "special-onboarding",
    title: "Despertar",
    description: "Complete o diagnóstico e comece a jornada",
    category: "special",
    icon: "Sunrise",
    threshold: 1,
    checkProgress: (s) => (s.onboardingCompleted ? 1 : 0),
  },
];

export const LEVELS: LevelDef[] = [
  { id: "iniciante", label: "Iniciante", minXp: 0 },
  { id: "praticante", label: "Praticante", minXp: 500 },
  { id: "dedicado", label: "Dedicado", minXp: 1500 },
  { id: "estrategista", label: "Estrategista", minXp: 3500 },
  { id: "mestre", label: "Mestre", minXp: 6000 },
  { id: "lenda", label: "Lenda", minXp: 10000 },
];

export function getLevel(xp: number): LevelDef {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getNextLevel(xp: number): LevelDef | null {
  const current = getLevel(xp);
  const idx = LEVELS.indexOf(current);
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
}

export function getAchievement(id: string): AchievementDef | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

export const CATEGORY_LABELS: Record<AchievementDef["category"], string> = {
  streak: "Sequência",
  principles: "Princípios",
  journal: "Diário",
  coach: "Coach",
  special: "Especial",
};
