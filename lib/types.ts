// Tipos de domínio compartilhados do MindRich.
// Espelham o "Modelo de Dados Principal" (seção 5.2 do escopo) para que a troca
// dos mocks por Supabase no futuro seja apenas a substituição da camada de dados.

export type Plan = "free" | "pro" | "team";

export interface UserProfile {
  name: string;
  email: string;
  plan: Plan;
  mindsetProfile?: MindsetProfile;
  dmp?: Dmp;
}

/** Definite Major Purpose — o objetivo principal do usuário (Princípio 1). */
export interface Dmp {
  value: number; // valor financeiro alvo (R$)
  deadline: string; // ISO date
  inExchange: string; // o que dará em troca
  createdAt: string;
}

export type MindsetProfile = "Sonhador" | "Construtor" | "Executor" | "Estrategista";

export type PrincipleStatus = "locked" | "not_started" | "in_progress" | "completed";

export interface Principle {
  id: number; // 1..13
  title: string;
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
