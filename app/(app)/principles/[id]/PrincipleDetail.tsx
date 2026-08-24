"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Lightbulb, RotateCcw } from "lucide-react";
import { useStore } from "@/lib/store";
import { getPrinciple } from "@/lib/mock/principles";
import { generateFeedback } from "@/lib/mock/coach";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { Quote, randomQuote } from "@/components/ui/Quote";
import { AudioPlayer } from "@/components/principles/AudioPlayer";
import { ExerciseFlow } from "@/components/principles/ExerciseFlow";
import { AiFeedbackSkeleton, AiFeedbackView } from "@/components/principles/AiFeedback";
import type { AiFeedback } from "@/lib/types";

const MIN_CHARS = 50;
type Phase = "learn" | "exercise" | "reflect";

export default function PrincipleDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);
  const principle = getPrinciple(id);

  const stored = useStore((s) => s.progress[id]);
  const startPrinciple = useStore((s) => s.startPrinciple);
  const setReflectionStore = useStore((s) => s.setReflection);
  const setFeedbackStore = useStore((s) => s.setFeedback);
  const completePrinciple = useStore((s) => s.completePrinciple);

  const [phase, setPhase] = useState<Phase>(stored?.feedback ? "reflect" : "learn");
  const [reflection, setReflection] = useState(stored?.reflection ?? "");
  const [feedback, setFeedback] = useState<AiFeedback | undefined>(stored?.feedback);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (principle) startPrinciple(id);
  }, [id, principle, startPrinciple]);

  if (!principle) {
    return (
      <div className="px-5 py-10 text-center text-ink-muted">
        Princípio não encontrado.
        <div className="mt-4">
          <Button variant="secondary" onClick={() => router.push("/principles")}>
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const isCompleted = stored?.status === "completed";
  const tooShort = reflection.trim().length < MIN_CHARS;

  async function submitReflection() {
    if (tooShort) return;
    setLoading(true);
    setError(false);
    setReflectionStore(id, reflection.trim());
    track("ai_feedback_requested", { id });
    const t0 = Date.now();
    try {
      if (Math.random() < 0.12) throw new Error("mock failure");
      const fb = await generateFeedback(reflection.trim(), principle!);
      setFeedback(fb);
      setFeedbackStore(id, fb);
      track("ai_feedback_received", { id, latencyMs: Date.now() - t0 });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <header className="sticky top-0 z-30 flex items-center gap-3 px-5 py-4 backdrop-blur-md">
        <button
          onClick={() => router.push("/principles")}
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-night-800/60 text-ink-muted hover:text-ink"
          aria-label="Voltar"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <p className="text-xs uppercase tracking-widest text-gold">
            Passo {principle.id} · Hill: {principle.title}
          </p>
          <h1 className="font-display text-xl leading-none">{principle.accessibleTitle}</h1>
        </div>
      </header>

      <div className="space-y-6 px-5 pb-8">
        <div className="flex gap-1 rounded-2xl bg-night-800/60 p-1">
          {(["learn", "exercise", "reflect"] as Phase[]).map((p) => (
            <button
              key={p}
              onClick={() => setPhase(p)}
              className={
                "flex-1 rounded-xl py-2 text-sm font-medium transition-colors " +
                (phase === p ? "bg-gold text-night" : "text-ink-muted")
              }
            >
              {p === "learn" ? "Aprender" : p === "exercise" ? "Exercício" : "Reflexão"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            {phase === "learn" && (
              <>
                <p className="font-display text-2xl italic text-ink/90">{principle.subtitle}</p>
                <AudioPlayer title={principle.title} />
                <p className="leading-relaxed text-ink-muted">{principle.intro}</p>
                <div className="flex gap-3 rounded-2xl border border-gold/20 bg-gold/5 p-4">
                  <Lightbulb className="shrink-0 text-gold" size={20} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                      Dica prática
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-ink">{principle.tip}</p>
                  </div>
                </div>
                <Button className="w-full" size="lg" onClick={() => setPhase("exercise")}>
                  Ir para o exercício
                </Button>
              </>
            )}

            {phase === "exercise" && (
              <ExerciseFlow
                steps={principle.exercise}
                onComplete={() => setPhase("reflect")}
              />
            )}

            {phase === "reflect" && (
              <div className="space-y-4">
                <Quote>{randomQuote(principle.id)}</Quote>
                <Textarea
                  label="Sua reflexão pessoal"
                  placeholder="O que esse princípio despertou em você? Como vai aplicá-lo?"
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  hint={
                    tooShort
                      ? `Escreva ao menos ${MIN_CHARS} caracteres (${reflection.trim().length}/${MIN_CHARS}).`
                      : "Pronto para enviar ao seu coach."
                  }
                  disabled={loading}
                />

                {!feedback && (
                  <Button
                    className="w-full"
                    size="lg"
                    disabled={tooShort}
                    loading={loading}
                    onClick={submitReflection}
                  >
                    Enviar reflexão ao Coach
                  </Button>
                )}

                {loading && <AiFeedbackSkeleton />}

                {error && !loading && (
                  <div className="space-y-3 rounded-2xl border border-ember/30 bg-ember/10 p-4 text-center">
                    <p className="text-sm text-ink">
                      Não consegui falar com o coach agora. Seu texto está salvo.
                    </p>
                    <Button variant="secondary" onClick={submitReflection}>
                      <RotateCcw size={16} /> Tentar novamente
                    </Button>
                  </div>
                )}

                {feedback && !loading && (
                  <div className="space-y-4">
                    <AiFeedbackView feedback={feedback} />
                    {isCompleted ? (
                      <div className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-400/10 p-4 text-emerald-300">
                        <CheckCircle2 size={18} />
                        <span className="text-sm font-medium">Princípio concluído</span>
                      </div>
                    ) : (
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={() => {
                          completePrinciple(id);
                          router.push("/principles");
                        }}
                      >
                        <CheckCircle2 size={18} /> Concluir princípio
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
