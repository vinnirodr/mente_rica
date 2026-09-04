"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import type { ExerciseStep } from "@/lib/types";

// Exercício guiado passo a passo. Ao concluir todos os passos, libera a etapa de
// reflexão final (que é submetida ao Coach IA).
export function ExerciseFlow({
  steps,
  initialNotes,
  onComplete,
}: {
  steps: ExerciseStep[];
  /** Respostas já salvas, para que o usuário retome o exercício sem reescrever. */
  initialNotes?: string[];
  onComplete: (notes: string[]) => void;
}) {
  const [current, setCurrent] = useState(0);
  const [notes, setNotes] = useState<string[]>(() =>
    steps.map((_, i) => initialNotes?.[i] ?? ""),
  );

  const step = steps[current];
  const isLast = current === steps.length - 1;
  const canAdvance = notes[current].trim().length > 0;

  function update(value: string) {
    setNotes((prev) => prev.map((n, i) => (i === current ? value : n)));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {steps.map((_, i) => (
          <span
            key={i}
            className={
              "h-1.5 flex-1 rounded-full transition-colors " +
              (i < current ? "bg-emerald-400/70" : i === current ? "bg-gold" : "bg-night-700")
            }
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-3"
        >
          <p className="text-xs uppercase tracking-widest text-ink-faint">
            Passo {current + 1} de {steps.length}
          </p>
          <p className="font-display text-xl leading-snug text-ink">{step.prompt}</p>
          {step.helper && <p className="text-sm text-ink-muted">{step.helper}</p>}
          <Textarea
            placeholder="Escreva aqui…"
            value={notes[current]}
            onChange={(e) => update(e.target.value)}
            className="min-h-[100px]"
          />
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-3">
        {current > 0 && (
          <Button variant="secondary" onClick={() => setCurrent((c) => c - 1)}>
            Voltar
          </Button>
        )}
        <Button
          className="flex-1"
          disabled={!canAdvance}
          onClick={() => {
            if (isLast) onComplete(notes);
            else setCurrent((c) => c + 1);
          }}
        >
          {isLast ? (
            <>
              Concluir exercício <Check size={18} />
            </>
          ) : (
            <>
              Próximo passo <ArrowRight size={18} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
