/**
 * Limitador por janela fixa, em memória.
 *
 * LIMITAÇÃO IMPORTANTE: na Vercel cada instância serverless tem a própria
 * memória, então o teto real é `limit × instâncias ativas`, e o contador zera a
 * cada instância nova. Isso freia uso acidental e abuso casual, mas NÃO é
 * proteção real contra alguém determinado a torrar a cota da API.
 *
 * A proteção de verdade é exigir conta (Fase 4) e contar por usuário num banco
 * compartilhado. Até lá, isto somado ao teto de max_tokens é o que segura.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/** Evita que o Map cresça sem limite em instâncias de vida longa. */
function evictExpired(now: number): void {
  if (buckets.size < 5000) return;
  const expired: string[] = [];
  buckets.forEach((b, key) => {
    if (b.resetAt <= now) expired.push(key);
  });
  expired.forEach((key) => buckets.delete(key));
}

export interface RateLimitResult {
  ok: boolean;
  /** Segundos até a janela reabrir. Só faz sentido quando `ok` é false. */
  retryAfter: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  evictExpired(now);

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  if (bucket.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { ok: true, retryAfter: 0 };
}

/**
 * Identifica o chamador. Sem login, o melhor disponível é o IP que a Vercel
 * coloca em x-forwarded-for — o primeiro item é o cliente.
 */
export function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "desconhecido";
}
