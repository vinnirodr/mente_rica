import Anthropic from "@anthropic-ai/sdk";

/**
 * Cliente da Claude API. Só existe no servidor — a chave nunca chega ao
 * navegador. Foi exatamente por isso que o app saiu do static export.
 */
let cached: Anthropic | null = null;

export function anthropic(): Anthropic {
  if (!cached) cached = new Anthropic();
  return cached;
}

export function hasApiKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

/**
 * Modelo único para as duas rotas. Trocar por "claude-sonnet-5" reduz o custo
 * (entrada 2,00 e saída 10,00 por milhão de tokens, contra 5,00 e 25,00 do
 * Opus 5) ao custo de respostas menos afiadas.
 */
export const COACH_MODEL = "claude-opus-5";

/** Traduz falhas da API em mensagem em português e status HTTP adequado. */
export function apiErrorResponse(err: unknown): Response {
  if (err instanceof Anthropic.RateLimitError) {
    return Response.json(
      { error: "O coach está sobrecarregado agora. Tente de novo em instantes." },
      { status: 503 },
    );
  }
  if (err instanceof Anthropic.AuthenticationError) {
    console.error("ANTHROPIC_API_KEY inválida ou ausente", err);
    return Response.json({ error: "O coach está indisponível." }, { status: 503 });
  }
  if (err instanceof Anthropic.APIError) {
    console.error("Erro da Claude API", err.status, err.message);
    return Response.json({ error: "Não consegui falar com o coach agora." }, { status: 502 });
  }
  console.error("Erro inesperado na rota do coach", err);
  return Response.json({ error: "Não consegui falar com o coach agora." }, { status: 500 });
}
