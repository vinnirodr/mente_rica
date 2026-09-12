import type { Principle } from "@/lib/types";

/**
 * Sugestão de próxima ação exibida no dashboard. É regra determinística de
 * produto, não IA: roda instantaneamente, offline e sem custo por chamada.
 */
export function nextRecommendedAction(ctx: {
  currentPrinciple?: Principle;
  streak: number;
}): string {
  if (ctx.streak === 0) return "Faça seu primeiro check-in do dia e inicie sua sequência.";
  if (ctx.currentPrinciple) return `Avance no seu foco atual: "${ctx.currentPrinciple.accessibleTitle}".`;
  return "Releia seu grande objetivo e registre uma reflexão no diário.";
}
