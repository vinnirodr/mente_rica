"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import type { Dmp } from "@/lib/types";

// US-03 / Critério 4.1: valor, prazo e contrapartida com validação INLINE,
// sem sair da tela quando algum campo obrigatório estiver vazio.

function formatCurrency(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  const number = Number(digits) / 100;
  return number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function parseCurrency(masked: string): number {
  return Number(masked.replace(/\D/g, "")) / 100;
}

export function DmpForm({ onSubmit }: { onSubmit: (dmp: Dmp) => void }) {
  const [valueMasked, setValueMasked] = useState("");
  const [deadline, setDeadline] = useState("");
  const [inExchange, setInExchange] = useState("");
  const [errors, setErrors] = useState<{ value?: string; deadline?: string; inExchange?: string }>(
    {},
  );

  const minDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  function handleSubmit() {
    const next: typeof errors = {};
    const value = parseCurrency(valueMasked);
    if (!value || value <= 0) next.value = "Defina um valor financeiro maior que zero.";
    if (!deadline) next.deadline = "Escolha um prazo para sua conquista.";
    if (inExchange.trim().length < 10)
      next.inExchange = "Descreva com pelo menos 10 caracteres o que você dará em troca.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSubmit({ value, deadline, inExchange: inExchange.trim(), createdAt: new Date().toISOString() });
  }

  return (
    <div className="flex min-h-full flex-col gap-6 py-6">
      <div className="space-y-3">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 text-gold"
        >
          <Target size={26} />
        </motion.div>
        <h2 className="font-display text-2xl leading-snug">Seu Grande Objetivo</h2>
        <p className="text-sm text-ink-muted">
          É o destino que guia toda a sua jornada: <span className="text-gold">quanto</span> você
          quer, <span className="text-gold">até quando</span> e o que está disposto a dar em troca.
          Quanto mais específico, mais sua mente trabalha por ele.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Input
          label="Valor financeiro alvo"
          inputMode="numeric"
          placeholder="R$ 0,00"
          value={valueMasked}
          onChange={(e) => setValueMasked(formatCurrency(e.target.value))}
          error={errors.value}
        />
        <Input
          label="Prazo"
          type="date"
          min={minDate}
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          error={errors.deadline}
        />
        <Textarea
          label="O que darei em troca"
          placeholder="Que serviço, valor ou esforço entregarei para merecer essa conquista?"
          value={inExchange}
          onChange={(e) => setInExchange(e.target.value)}
          error={errors.inExchange}
          hint="Princípio da reciprocidade: nada se recebe sem dar algo equivalente."
        />
      </div>

      <Button size="lg" className="mt-auto w-full" onClick={handleSubmit}>
        Confirmar meu objetivo
      </Button>
    </div>
  );
}
