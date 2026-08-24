// Eventos de analytics (PostHog) — seção 8.2 do escopo.
// No protótipo são no-ops tipados; basta plugar o cliente PostHog no futuro.

export type AnalyticsEvent =
  | { name: "onboarding_completed"; props: { durationMs: number; profile: string } }
  | { name: "principle_started"; props: { id: number } }
  | { name: "principle_completed"; props: { id: number } }
  | { name: "ai_feedback_requested"; props: { id: number } }
  | { name: "ai_feedback_received"; props: { id: number; latencyMs: number } }
  | { name: "journal_checkin_completed"; props: { streak: number } }
  | { name: "subscription_started"; props: { plan: string } }
  | { name: "paywall_seen"; props: { source: string } }
  | { name: "xp_earned"; props: { amount: number; reason: string; total: number } }
  | { name: "achievement_unlocked"; props: { id: string; title: string } }
  | { name: "level_up"; props: { level: string; xp: number } };

export function track<E extends AnalyticsEvent>(name: E["name"], props: E["props"]): void {
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", name, props);
  }
}
