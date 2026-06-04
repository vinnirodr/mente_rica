"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

const PROBLEMS = [
  "Sabe que pode mais, mas não sabe por onde começar?",
  "Já tentou mudar de vida financeira e travou no meio do caminho?",
  "Falta um sistema e alguém que acompanhe sua evolução?",
];

export function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex min-h-full flex-col justify-center gap-8 py-8">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gold-gradient shadow-glow"
      >
        <Sparkles className="text-night" size={34} />
      </motion.div>

      <div className="space-y-3 text-center">
        <h1 className="font-display text-4xl leading-tight">
          Mude sua mentalidade.{" "}
          <span className="gold-text">Mude seus resultados.</span>
        </h1>
        <p className="text-ink-muted">
          O <span className="text-ink">MindRich</span> é seu sistema pessoal de transformação
          financeira e mental — com um coach por IA que te acompanha todos os dias.
        </p>
      </div>

      <div className="space-y-2.5">
        {PROBLEMS.map((p, i) => (
          <motion.div
            key={p}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.1 }}
            className="flex items-start gap-3 rounded-2xl border border-white/10 bg-night-800/50 px-4 py-3"
          >
            <span className="mt-0.5 text-gold">✦</span>
            <p className="text-sm text-ink-muted">{p}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-2">
        <Button size="lg" className="w-full" onClick={onNext}>
          Descobrir meu ponto de partida
        </Button>
        <p className="mt-3 text-center text-xs text-ink-faint">
          Diagnóstico gratuito · leva menos de 2 minutos
        </p>
      </div>
    </div>
  );
}
