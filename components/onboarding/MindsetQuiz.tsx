"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { QUIZ, scoreQuiz, type DiagnosisResult, type QuizOption } from "@/lib/mock/quiz";

export function MindsetQuiz({ onDone }: { onDone: (result: DiagnosisResult) => void }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizOption[]>([]);
  const q = QUIZ[index];
  const progress = (index / QUIZ.length) * 100;

  function choose(opt: QuizOption) {
    const next = [...answers, opt];
    setAnswers(next);
    if (index + 1 < QUIZ.length) {
      setTimeout(() => setIndex(index + 1), 180);
    } else {
      onDone(scoreQuiz(next));
    }
  }

  return (
    <div className="flex min-h-full flex-col gap-6 py-6">
      <div>
        <p className="mb-2 text-xs uppercase tracking-widest text-ink-faint">
          Diagnóstico de mentalidade e bloqueios · {index + 1}/{QUIZ.length}
        </p>
        <div className="h-1.5 overflow-hidden rounded-full bg-night-700/60">
          <motion.div
            className="h-full rounded-full bg-gold-gradient"
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 140, damping: 22 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="flex flex-1 flex-col gap-5"
        >
          <h2 className="font-display text-2xl leading-snug">{q.question}</h2>
          <div className="flex flex-col gap-3">
            {q.options.map((opt) => (
              <motion.button
                key={opt.label}
                whileTap={{ scale: 0.98 }}
                onClick={() => choose(opt)}
                className="group flex items-center justify-between rounded-2xl border border-white/10 bg-night-800/60 px-4 py-4 text-left transition-colors hover:border-gold/40 hover:bg-night-800"
              >
                <span className="text-[15px] text-ink">{opt.label}</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/15 text-transparent transition-colors group-hover:border-gold group-hover:text-gold">
                  <Check size={14} />
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
