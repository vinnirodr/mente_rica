import { cn } from "@/lib/cn";

type Tone = "gold" | "muted" | "ember" | "success";

const tones: Record<Tone, string> = {
  gold: "bg-gold/15 text-gold border-gold/20",
  muted: "bg-white/5 text-ink-muted border-white/10",
  ember: "bg-ember/15 text-ember border-ember/20",
  success: "bg-emerald-400/15 text-emerald-300 border-emerald-400/20",
};

export function Badge({
  tone = "muted",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
