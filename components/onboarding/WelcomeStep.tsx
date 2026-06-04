"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Quote } from "@/components/ui/Quote";

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
          Bem-vindo ao <span className="gold-text">MindRich</span>
        </h1>
        <p className="text-ink-muted">
          Você já tem os ensinamentos. Aqui, vamos transformá-los em prática diária —
          do conhecimento à mudança real.
        </p>
      </div>

      <Quote className="mx-2">
        O ponto de partida de toda conquista é o desejo.
      </Quote>

      <div className="mt-2">
        <Button size="lg" className="w-full" onClick={onNext}>
          Começar minha jornada
        </Button>
        <p className="mt-3 text-center text-xs text-ink-faint">Leva menos de 2 minutos</p>
      </div>
    </div>
  );
}
