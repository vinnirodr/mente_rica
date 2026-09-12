import type { AiFeedback, ChatMessage, Dmp, Principle } from "@/lib/types";
import { MAX_HISTORY } from "@/lib/coach/limits";

/** Erro com mensagem já pronta para exibir ao usuário. */
export class CoachError extends Error {}

async function readError(res: Response): Promise<never> {
  let message = "Não consegui falar com o coach agora.";
  try {
    const data = await res.json();
    if (typeof data?.error === "string") message = data.error;
  } catch {
    // resposta sem JSON — mantém a mensagem padrão
  }
  throw new CoachError(message);
}

/** Envia a reflexão e devolve o feedback estruturado (alinhamento/lacuna/ação). */
export async function requestFeedback(input: {
  reflection: string;
  principleId: number;
  name?: string;
  dmp?: Dmp;
  exerciseNotes?: string[];
}): Promise<AiFeedback> {
  const res = await fetch("/api/coach/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) await readError(res);
  return (await res.json()) as AiFeedback;
}

/**
 * Conversa com o coach. Chama `onDelta` a cada pedaço recebido, para que a
 * resposta apareça enquanto é gerada, e devolve o texto completo no fim.
 */
export async function streamChatReply(
  input: {
    messages: Pick<ChatMessage, "role" | "content">[];
    principle?: Principle;
    name?: string;
    dmp?: Dmp;
  },
  onDelta: (chunk: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const res = await fetch("/api/coach/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({
      // Corta aqui: a conversa inteira fica salva no aparelho, mas enviá-la toda
      // encareceria cada mensagem e, acima do teto aceito, travaria o chat.
      messages: input.messages
        .slice(-MAX_HISTORY)
        .map((m) => ({ role: m.role, content: m.content })),
      principleId: input.principle?.id,
      name: input.name,
      dmp: input.dmp,
    }),
  });

  if (!res.ok) await readError(res);
  if (!res.body) throw new CoachError("Não consegui falar com o coach agora.");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    if (chunk) {
      full += chunk;
      onDelta(chunk);
    }
  }

  if (!full.trim()) throw new CoachError("O coach não respondeu. Tente de novo.");
  return full;
}
