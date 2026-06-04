"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import type { Principle } from "@/lib/types";

// Check-in diário com 3 perguntas que rotacionam conforme o princípio atual,
// mais um campo livre de reflexão.
export function CheckinForm({
  principle,
  onSubmit,
}: {
  principle: Principle;
  onSubmit: (answers: string[], reflection: string) => void;
}) {
  const questions = principle.checkinQuestions;
  const [answers, setAnswers] = useState<string[]>(() => questions.map(() => ""));
  const [reflection, setReflection] = useState("");

  const allAnswered = answers.every((a) => a.trim().length > 0);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-gold/15 bg-gold/5 px-4 py-3">
        <p className="text-xs uppercase tracking-widest text-gold">
          Foco de hoje · {principle.title}
        </p>
      </div>

      {questions.map((q, i) => (
        <div key={q} className="space-y-2">
          <p className="text-sm font-medium text-ink">{q}</p>
          <div className="flex flex-wrap gap-2">
            {["Sim", "Mais ou menos", "Ainda não"].map((opt) => (
              <motion.button
                key={opt}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setAnswers((prev) => prev.map((a, idx) => (idx === i ? opt : a)))
                }
                className={
                  "rounded-full border px-4 py-2 text-sm transition-colors " +
                  (answers[i] === opt
                    ? "border-gold bg-gold/15 text-gold"
                    : "border-white/10 text-ink-muted hover:border-white/20")
                }
              >
                {answers[i] === opt && <Check size={14} className="mr-1 inline" />}
                {opt}
              </motion.button>
            ))}
          </div>
        </div>
      ))}

      <Textarea
        label="Reflexão livre (opcional)"
        placeholder="Como foi seu dia rumo ao seu objetivo?"
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
      />

      <Button
        size="lg"
        className="w-full"
        disabled={!allAnswered}
        onClick={() => onSubmit(answers, reflection.trim())}
      >
        Registrar check-in
      </Button>
    </div>
  );
}
