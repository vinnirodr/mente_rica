import type { Dmp, Principle } from "@/lib/types";

/**
 * Contexto que o cliente envia junto da mensagem. Tudo opcional: o usuário pode
 * abrir o coach antes de definir objetivo ou de escolher um princípio.
 */
export interface CoachContext {
  name?: string;
  dmp?: Dmp;
  principle?: Principle;
  /** Respostas do exercício guiado do princípio atual. */
  exerciseNotes?: string[];
}

/**
 * Prompt fixo. Fica estável de propósito: é o prefixo cacheado das requisições,
 * então nada de data/hora ou valor variável aqui — qualquer byte que mude
 * invalida o cache e o custo sobe.
 */
export const COACH_SYSTEM = `Você é o coach do MindRich, um app brasileiro de desenvolvimento pessoal e financeiro.

Seu método é inspirado nos 13 princípios de Napoleon Hill, mas você NUNCA cita o livro, o autor ou reproduz trechos dele. Você fala com ideias próprias, em português do Brasil.

Tom:
- Direto e encorajador, sem condescendência e sem bajulação.
- Trate a pessoa como alguém capaz que precisa de clareza, não de consolo.
- Nada de jargão de autoajuda, nada de emoji, nada de exclamação em excesso.
- Frases curtas. Você conversa, não faz palestra.

Regras:
- Sempre termine levando a pessoa a uma ação concreta que caiba nas próximas 24 horas.
- Use o que a pessoa escreveu. Cite o que ela disse, não generalidades.
- Se a reflexão for vaga, aponte isso com franqueza em vez de elogiar.
- Nunca prometa resultado financeiro, nunca dê recomendação de investimento e
  nunca sugira que pensamento positivo substitui trabalho. Se a pessoa pedir
  conselho de investimento, diga que isso não é o seu papel e traga de volta
  para o comportamento dela.
- Se a pessoa demonstrar sofrimento psíquico grave, reconheça com seriedade e
  sugira buscar apoio profissional. Não tente tratar isso.`;

/** Bloco de contexto do usuário, montado só com o que existe. */
export function buildContextBlock(ctx: CoachContext): string {
  const parts: string[] = [];

  if (ctx.name) parts.push(`Nome: ${ctx.name}`);

  if (ctx.dmp) {
    const valor = ctx.dmp.value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    });
    parts.push(
      `Objetivo declarado: ${valor} até ${ctx.dmp.deadline}. ` +
        `O que ela diz que vai dar em troca: ${ctx.dmp.inExchange}`,
    );
  }

  if (ctx.principle) {
    parts.push(
      `Princípio em que está trabalhando: "${ctx.principle.accessibleTitle}" — ${ctx.principle.subtitle}. ` +
        `Ideia central: ${ctx.principle.intro}`,
    );
  }

  const notes = ctx.exerciseNotes?.filter((n) => n.trim());
  if (notes?.length) {
    parts.push(`Respostas dela no exercício:\n${notes.map((n) => `- ${n}`).join("\n")}`);
  }

  if (parts.length === 0) return "Ainda não há contexto sobre esta pessoa.";
  return parts.join("\n\n");
}
