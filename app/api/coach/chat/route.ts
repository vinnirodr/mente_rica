import { z } from "zod";
import { anthropic, apiErrorResponse, COACH_MODEL, hasApiKey } from "@/lib/coach/client";
import { buildContextBlock, COACH_SYSTEM, type CoachContext } from "@/lib/coach/prompt";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { MAX_HISTORY, MAX_HISTORY_ACCEPTED } from "@/lib/coach/limits";
import { getPrinciple } from "@/lib/mock/principles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LIMIT = 30;
const WINDOW_MS = 60 * 60 * 1000;

const BodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(MAX_HISTORY_ACCEPTED),
  principleId: z.number().int().min(1).max(13).optional(),
  name: z.string().max(120).optional(),
  dmp: z
    .object({
      value: z.number(),
      deadline: z.string().max(40),
      inExchange: z.string().max(1000),
      createdAt: z.string().max(40),
    })
    .optional(),
});

export async function POST(req: Request) {
  if (!hasApiKey()) {
    return Response.json({ error: "O coach ainda não está configurado." }, { status: 503 });
  }

  const limited = rateLimit(`chat:${clientKey(req)}`, LIMIT, WINDOW_MS);
  if (!limited.ok) {
    return Response.json(
      { error: "Você conversou bastante agora há pouco. Tente novamente mais tarde." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } },
    );
  }

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return Response.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const ctx: CoachContext = {
    name: body.name,
    dmp: body.dmp,
    principle: body.principleId ? getPrinciple(body.principleId) : undefined,
  };

  // A conversa precisa começar por uma mensagem do usuário.
  const history = body.messages.slice(-MAX_HISTORY);
  while (history.length && history[0]!.role !== "user") history.shift();
  if (history.length === 0) {
    return Response.json({ error: "Requisição inválida." }, { status: 400 });
  }

  try {
    const stream = anthropic().messages.stream({
      model: COACH_MODEL,
      max_tokens: 1200,
      output_config: { effort: "low" },
      system: [
        { type: "text", text: COACH_SYSTEM, cache_control: { type: "ephemeral" } },
        { type: "text", text: `Contexto sobre a pessoa:\n${buildContextBlock(ctx)}` },
      ],
      messages: history,
    });

    // Só responder 200 depois do primeiro trecho de texto. Se a chamada falhar
    // antes disso, o cliente precisa de um status de erro — senão ele guardaria
    // a mensagem de falha no histórico como se fosse resposta do coach.
    const iterator = stream[Symbol.asyncIterator]();
    let first: string | null = null;

    try {
      while (first === null) {
        const { value, done } = await iterator.next();
        if (done) break;
        if (value.type === "content_block_delta" && value.delta.type === "text_delta") {
          first = value.delta.text;
        }
      }
    } catch (err) {
      stream.abort();
      return apiErrorResponse(err);
    }

    if (first === null) {
      // Terminou sem texto algum: recusa do modelo ou resposta vazia.
      const final = await stream.finalMessage().catch(() => null);
      if (final?.stop_reason === "refusal") {
        return Response.json(
          { error: "Não consigo responder a isso. Tente reformular sua pergunta." },
          { status: 422 },
        );
      }
      return Response.json({ error: "O coach não respondeu. Tente de novo." }, { status: 502 });
    }

    const firstChunk = first;

    // Texto puro em vez de SSE: o cliente só precisa dos deltas para exibir.
    const body = new ReadableStream<Uint8Array>({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          controller.enqueue(encoder.encode(firstChunk));
          while (true) {
            const { value, done } = await iterator.next();
            if (done) break;
            if (value.type === "content_block_delta" && value.delta.type === "text_delta") {
              controller.enqueue(encoder.encode(value.delta.text));
            }
          }
        } catch (err) {
          // Aqui o usuário já viu parte da resposta e o status já foi 200, então
          // o melhor possível é avisar no próprio texto.
          console.error("Erro durante o streaming do coach", err);
          controller.enqueue(
            encoder.encode("\n\n[A conexão com o coach caiu no meio da resposta.]"),
          );
        } finally {
          controller.close();
        }
      },
      cancel() {
        stream.abort();
      },
    });

    return new Response(body, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        // Impede buffering em proxies, que anularia o efeito do streaming.
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    return apiErrorResponse(err);
  }
}
