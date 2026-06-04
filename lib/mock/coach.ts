import type { AiFeedback, Dmp, Principle } from "@/lib/types";

// Simulador do Coach IA. Substitui a Claude API por templates com tom "Napoleon Hill"
// (direto, encorajador, sem condescendência). A interface assíncrona com delay imita
// a latência real para que a UX de loading/typing seja fiel — trocar por fetch à API
// depois é transparente para os componentes.

function delay<T>(value: T, ms: number): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

const ALIGNMENTS = [
  "Você demonstrou clareza sobre o que deseja — esse é o ponto de partida de toda realização.",
  "Há uma fé verdadeira no seu texto. Quem acredita já está a meio caminho.",
  "Percebo decisão na sua escrita. Quem decide com firmeza comanda o próprio destino.",
  "Sua reflexão revela persistência — exatamente a qualidade que separa quem chega de quem desiste.",
];

const GAPS = [
  "Falta traduzir a intenção em um prazo concreto. Um desejo sem data é apenas um desejo.",
  "Você descreveu o 'o quê', mas o 'como' ainda está vago. O plano é a ponte para o resultado.",
  "Noto hesitação no compromisso. O que você está disposto a abrir mão em troca?",
  "A emoção poderia ser mais intensa. É ela que move o subconsciente a trabalhar por você.",
];

const ACTIONS = [
  "Hoje, escreva seu objetivo no presente e leia em voz alta antes de dormir.",
  "Defina o menor próximo passo possível e execute-o nas próximas 24 horas.",
  "Marque no calendário um marco mensurável para os próximos 30 dias.",
  "Identifique uma pessoa que pode te apoiar e envie uma mensagem ainda hoje.",
];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

/** Gera o feedback estruturado (alinhamento/lacuna/ação) de uma reflexão. */
export function generateFeedback(reflection: string, principle: Principle): Promise<AiFeedback> {
  const seed = reflection.length + principle.id;
  return delay(
    {
      alignment: pick(ALIGNMENTS, seed),
      gap: pick(GAPS, seed + 1),
      action: pick(ACTIONS, seed + 2),
    },
    1800,
  );
}

/** Resposta livre do chat do coach, referenciando perfil/DMP/princípio quando houver. */
export function generateChatReply(
  userMessage: string,
  ctx: { dmp?: Dmp; currentPrinciple?: Principle; name?: string },
): Promise<string> {
  const name = ctx.name?.split(" ")[0] ?? "amigo";
  const lower = userMessage.toLowerCase();

  let body: string;
  if (lower.includes("desanim") || lower.includes("difícil") || lower.includes("dificil") || lower.includes("cansad")) {
    body = `Toda mente que realiza algo grande passou pelo ponto onde você está agora, ${name}. A persistência não é ausência de cansaço — é a continuidade do esforço apesar dele.`;
  } else if (lower.includes("objetivo") || lower.includes("meta") || lower.includes("dmp")) {
    body = ctx.dmp
      ? `Seu objetivo de R$ ${ctx.dmp.value.toLocaleString("pt-BR")} até ${new Date(ctx.dmp.deadline).toLocaleDateString("pt-BR")} é definido — e isso já te coloca à frente da maioria. Agora a pergunta é: o que você fará hoje por ele?`
      : `Antes de tudo, ${name}, precisamos de um objetivo definido: valor, prazo e o que você dará em troca. Vamos cravar isso agora?`;
  } else if (ctx.currentPrinciple) {
    body = `No princípio de ${ctx.currentPrinciple.title}, o segredo está na prática diária, não na compreensão intelectual. ${ctx.currentPrinciple.tip}`;
  } else {
    body = `Lembre-se, ${name}: o ponto de partida de toda riqueza é um estado mental definido. Diga-me com clareza o que você quer, e eu te ajudo a construir o caminho.`;
  }

  const action = pick(ACTIONS, userMessage.length);
  return delay(`${body}\n\nSua próxima ação: ${action}`, 1400);
}

export function nextRecommendedAction(ctx: { currentPrinciple?: Principle; streak: number }): string {
  if (ctx.streak === 0) return "Faça seu primeiro check-in do dia e inicie sua sequência.";
  if (ctx.currentPrinciple) return `Avance no exercício do princípio "${ctx.currentPrinciple.title}".`;
  return "Releia seu objetivo principal e registre uma reflexão no diário.";
}
