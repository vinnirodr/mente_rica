import { cn } from "@/lib/cn";

// Citações no espírito de Napoleon Hill — paráfrases próprias usadas em momentos de
// motivação contextual (princípio de UX: aparecer em hesitação/saída).
export const HILL_QUOTES = [
  "Tudo que a mente consegue conceber e acreditar, ela pode alcançar.",
  "A persistência é para o caráter do homem o que o carbono é para o aço.",
  "O ponto de partida de toda conquista é o desejo.",
  "A indecisão é o primeiro inimigo da realização.",
  "Pensamentos são coisas — e coisas poderosas quando misturados a um propósito definido.",
  "Não espere. O momento nunca será 'o certo'.",
  "Uma meta é um sonho com prazo.",
];

export function randomQuote(seed?: number): string {
  const i = seed != null ? seed % HILL_QUOTES.length : Math.floor(Math.random() * HILL_QUOTES.length);
  return HILL_QUOTES[i];
}

export function Quote({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <figure className={cn("relative", className)}>
      <span className="absolute -left-1 -top-4 select-none font-display text-5xl leading-none text-gold/30">
        &ldquo;
      </span>
      <blockquote className="font-display text-lg italic leading-relaxed text-ink/90">
        {children}
      </blockquote>
      <figcaption className="mt-2 text-xs uppercase tracking-widest text-ink-faint">
        no espírito de Napoleon Hill
      </figcaption>
    </figure>
  );
}
