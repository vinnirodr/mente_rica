"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PenLine } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

// Passo 5: compromisso com assinatura simbólica (também captura o nome do usuário)
// e apresenta o caminho personalizado — o primeiro passo recomendado pelo diagnóstico.
export function CommitmentStep({
  onFinish,
  firstStepTitle,
}: {
  onFinish: (name: string) => void;
  firstStepTitle?: string;
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string>();

  function finish() {
    if (name.trim().length < 2) {
      setError("Escreva seu nome para firmar o compromisso.");
      return;
    }
    onFinish(name.trim());
  }

  return (
    <div className="flex min-h-full flex-col gap-6 py-6">
      <div className="space-y-3 text-center">
        <motion.div
          initial={{ rotate: -8, scale: 0.7, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 16 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gold/15 text-gold"
        >
          <PenLine size={30} />
        </motion.div>
        <h2 className="font-display text-2xl leading-snug">Seu compromisso</h2>
        <p className="text-sm text-ink-muted">
          A decisão é o que separa o sonho da realização. Firme seu compromisso com a
          prática diária.
        </p>
      </div>

      <div className="card-surface space-y-4 p-5">
        <p className="font-display text-lg italic leading-relaxed text-ink/90">
          &ldquo;Eu me comprometo a praticar, refletir e agir todos os dias rumo ao meu
          objetivo principal — sem desculpas, com persistência.&rdquo;
        </p>
        <Input
          label="Assinatura"
          placeholder="Seu nome completo"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError(undefined);
          }}
          error={error}
        />
      </div>

      {firstStepTitle && (
        <div className="flex items-center gap-3 rounded-2xl border border-gold/20 bg-gold/5 px-4 py-3">
          <span className="text-gold">✦</span>
          <p className="text-sm text-ink-muted">
            Seu caminho começa em{" "}
            <span className="font-semibold text-ink">{firstStepTitle}</span>
          </p>
        </div>
      )}

      <Button size="lg" className="mt-auto w-full" onClick={finish}>
        Assinar e começar
      </Button>
    </div>
  );
}
