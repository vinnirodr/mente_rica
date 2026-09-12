import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { anthropic, apiErrorResponse, COACH_MODEL, hasApiKey } from "@/lib/coach/client";
import { buildContextBlock, COACH_SYSTEM, type CoachContext } from "@/lib/coach/prompt";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { getPrinciple } from "@/lib/mock/principles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_REFLECTION_CHARS = 4000;
const LIMIT = 10;
const WINDOW_MS = 60 * 60 * 1000;

/** Espelha AiFeedback em lib/types.ts — o contrato que a UI já consome. */
const FeedbackSchema = z.object({
  alignment: z.string().describe("Um ponto concreto em que a pessoa acertou, citando o que ela escreveu. Uma ou duas frases."),
  gap: z.string().describe("A lacuna mais importante do que ela escreveu, dita com franqueza. Uma ou duas frases."),
  action: z.string().describe("Uma única ação concreta para as próximas 24 horas. Uma frase, no imperativo."),
});

const BodySchema = z.object({
  reflection: z.string().min(1).max(MAX_REFLECTION_CHARS),
  principleId: z.number().int().min(1).max(13),
  name: z.string().max(120).optional(),
  dmp: z
    .object({
      value: z.number(),
      deadline: z.string().max(40),
      inExchange: z.string().max(1000),
      createdAt: z.string().max(40),
    })
    .optional(),
  exerciseNotes: z.array(z.string().max(2000)).max(10).optional(),
});

export async function POST(req: Request) {
  if (!hasApiKey()) {
    return Response.json({ error: "O coach ainda não está configurado." }, { status: 503 });
  }

  const limited = rateLimit(`feedback:${clientKey(req)}`, LIMIT, WINDOW_MS);
  if (!limited.ok) {
    return Response.json(
      { error: "Você enviou muitas reflexões seguidas. Tente novamente mais tarde." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } },
    );
  }

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return Response.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const principle = getPrinciple(body.principleId);
  if (!principle) {
    return Response.json({ error: "Princípio não encontrado." }, { status: 400 });
  }

  const ctx: CoachContext = {
    name: body.name,
    dmp: body.dmp,
    principle,
    exerciseNotes: body.exerciseNotes,
  };

  try {
    const response = await anthropic().messages.parse({
      model: COACH_MODEL,
      max_tokens: 1500,
      // Resposta curta e conversacional: esforço alto aqui só encareceria.
      output_config: { effort: "medium", format: zodOutputFormat(FeedbackSchema) },
      system: [
        // Prefixo estável = cache. O contexto variável vai na mensagem.
        { type: "text", text: COACH_SYSTEM, cache_control: { type: "ephemeral" } },
      ],
      messages: [
        {
          role: "user",
          content:
            `Contexto sobre a pessoa:\n${buildContextBlock(ctx)}\n\n` +
            `Ela acabou de escrever esta reflexão sobre o princípio "${principle.accessibleTitle}":\n\n` +
            `"""\n${body.reflection}\n"""\n\n` +
            `Responda com um alinhamento, uma lacuna e uma ação, conforme o formato pedido.`,
        },
      ],
    });

    if (response.stop_reason === "refusal") {
      console.warn("Coach recusou a requisição", response.stop_details);
      return Response.json(
        { error: "Não consigo responder a esse conteúdo. Tente reescrever sua reflexão." },
        { status: 422 },
      );
    }

    if (!response.parsed_output) {
      console.error("Resposta do coach não pôde ser interpretada", response.stop_reason);
      return Response.json({ error: "Não consegui falar com o coach agora." }, { status: 502 });
    }

    return Response.json(response.parsed_output);
  } catch (err) {
    return apiErrorResponse(err);
  }
}
