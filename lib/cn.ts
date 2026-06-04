// Concatenador de classes minimalista (sem dependências externas).
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
