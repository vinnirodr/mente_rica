// Tipos de domínio compartilhados do MindRich.
// Espelham o "Modelo de Dados Principal" (seção 5.2 do escopo) para que a troca
// dos mocks por Supabase no futuro seja apenas a substituição da camada de dados.

export type Plan = "free" | "pro" | "team";

export interface UserProfile {
  name: string;
  email: string;
  plan: Plan;
  mindsetProfile?: MindsetProfile;
  diagnosis?: Diagnosis;
  dmp?: Dmp;
}

/**
 * "Seu Grande Objetivo" na UI — o objetivo principal do usuário. Conceito do
 * Definite Major Purpose (Princípio 1 de Hill), apresentado em linguagem acessível.
 */
export interface Dmp {
  value: number; // valor financeiro alvo (R$)
  deadline: string; // ISO date
  inExchange: string; // o que dará em troca
  createdAt: string;
}

export type MindsetProfile = "Sonhador" | "Construtor" | "Executor" | "Estrategista";

/** Identificador dos bloqueios que o diagnóstico inicial mede. */
export type BlockId =
  | "clareza"
  | "confianca"
  | "decisao"
  | "consistencia"
  | "foco"
  | "rede";

export interface Block {
  id: BlockId;
  label: string; // rótulo acessível do bloqueio
  principleId: number; // princípio que ataca esse bloqueio
}

/** Resultado do diagnóstico de mentalidade e bloqueios (onboarding). */
export interface Diagnosis {
  topBlocks: BlockId[]; // bloqueios mais pontuados (ordenados)
  recommendedPrincipleId: number; // por onde começar
}

export type PrincipleStatus = "locked" | "not_started" | "in_progress" | "completed";

export interface Principle {
  id: number; // 1..13
  accessibleTitle: string; // título em linguagem acessível (principal na UI)
  title: string; // nome clássico de Hill (etiqueta/subtítulo)
  subtitle: string;
  intro: string; // paráfrase própria — sem texto literal do livro
  tip: string;
  exercise: ExerciseStep[];
  checkinQuestions: string[]; // alimentam o diário quando este é o princípio atual
}

export interface ExerciseStep {
  prompt: string;
  helper?: string;
}

export interface PrincipleProgress {
  status: Exclude<PrincipleStatus, "locked">;
  /** Respostas do exercício guiado, uma por passo (mesma ordem de `Principle.exercise`). */
  exerciseNotes?: string[];
  reflection?: string;
  feedback?: AiFeedback;
  completedAt?: string;
}

/** Retorno estruturado do Coach IA em cada reflexão (critério 4.2). */
export interface AiFeedback {
  alignment: string; // 1 ponto de alinhamento
  gap: string; // 1 lacuna identificada
  action: string; // 1 ação concreta
}

export interface JournalEntry {
  date: string; // ISO date (YYYY-MM-DD)
  answers: string[]; // respostas às 3 perguntas dinâmicas
  reflection: string;
  principleId: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export type ReminderKind =
  | "morning_ritual"
  | "evening_reflection"
  | "streak_risk"
  | "principle_unlocked";

export interface ReminderPref {
  kind: ReminderKind;
  enabled: boolean;
  time: string; // "HH:MM"
}

export interface AppNotification {
  id: string;
  kind: ReminderKind | "system" | "achievement";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href?: string;
}

// ─── Gamificação ───

export type AchievementCategory = "streak" | "principles" | "journal" | "coach" | "special";

export interface GamificationSnapshot {
  streak: number;
  bestStreak: number;
  completedPrinciples: number;
  journalEntries: number;
  chatMessages: number;
  hasDmp: boolean;
  hasFeedback: boolean;
  onboardingCompleted: boolean;
}

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  threshold: number;
  checkProgress: (s: GamificationSnapshot) => number;
}

export type LevelId = "iniciante" | "praticante" | "dedicado" | "estrategista" | "mestre" | "lenda";

export interface LevelDef {
  id: LevelId;
  label: string;
  minXp: number;
}
