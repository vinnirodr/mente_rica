"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";
import { FullScreenLoader } from "@/components/ui/Loader";
import { StepDots } from "@/components/ui/Progress";
import { Button } from "@/components/ui/Button";
import { WelcomeStep } from "@/components/onboarding/WelcomeStep";
import { MindsetQuiz } from "@/components/onboarding/MindsetQuiz";
import { DmpForm } from "@/components/onboarding/DmpForm";
import { ReminderTimeStep } from "@/components/onboarding/ReminderTimeStep";
import { CommitmentStep } from "@/components/onboarding/CommitmentStep";
import { BLOCKS, type DiagnosisResult } from "@/lib/mock/quiz";
import { getPrinciple } from "@/lib/mock/principles";

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const router = useRouter();
  const hydrated = useStore((s) => s.hydrated);
  const completed = useStore((s) => s.onboarding.completed);
  const savedStep = useStore((s) => s.onboarding.step);
  const setOnboardingStep = useStore((s) => s.setOnboardingStep);
  const setMindset = useStore((s) => s.setMindset);
  const setDiagnosis = useStore((s) => s.setDiagnosis);
  const setDmp = useStore((s) => s.setDmp);
  const setName = useStore((s) => s.setName);
  const setReminder = useStore((s) => s.setReminder);
  const completeOnboarding = useStore((s) => s.completeOnboarding);

  const [step, setStep] = useState(0);
  const [diagnosis, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const startedAt = useRef<number>(Date.now());

  // Retomada (US-04): ao hidratar, salta para o passo onde o usuário parou.
  useEffect(() => {
    if (!hydrated) return;
    if (completed) {
      router.replace("/dashboard");
      return;
    }
    setStep(savedStep);
  }, [hydrated, completed, savedStep, router]);

  function go(next: number) {
    setStep(next);
    setOnboardingStep(next);
  }

  if (!hydrated) return <FullScreenLoader />;

  return (
    <div className="app-shell flex flex-col px-5">
      <header className="flex items-center justify-between pt-6">
        <span className="flex items-center gap-2 font-display text-lg">
          <Sparkles size={18} className="text-gold" /> MindRich
        </span>
        {step > 0 && <StepDots total={TOTAL_STEPS} current={step} />}
      </header>

      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={diagnosis && step === 1 ? "result" : step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="min-h-[70vh]"
          >
            {step === 0 && <WelcomeStep onNext={() => go(1)} />}

            {step === 1 && !diagnosis && (
              <MindsetQuiz
                onDone={(result) => {
                  setDiagnosisResult(result);
                  setMindset(result.profile);
                  setDiagnosis({
                    topBlocks: result.topBlocks,
                    recommendedPrincipleId: result.recommendedPrincipleId,
                  });
                }}
              />
            )}

            {step === 1 && diagnosis && (
              <div className="flex min-h-full flex-col justify-center gap-5 py-8">
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 16 }}
                    className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gold-gradient shadow-glow"
                  >
                    <Sparkles className="text-night" size={32} />
                  </motion.div>
                  <p className="mt-4 text-xs uppercase tracking-widest text-ink-faint">
                    Seu perfil de mentalidade
                  </p>
                  <h2 className="mt-1 font-display text-4xl gold-text">{diagnosis.profile}</h2>
                  <p className="mt-2 text-sm text-ink-muted">{diagnosis.description}</p>
                </div>

                {/* Principais bloqueios identificados */}
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-widest text-ink-faint">
                    Seus principais bloqueios
                  </p>
                  {diagnosis.topBlocks.map((id, i) => (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-night-800/50 px-4 py-3"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ember/15 text-xs font-bold text-ember">
                        {i + 1}
                      </span>
                      <span className="text-sm text-ink">{BLOCKS[id].label}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Comece por aqui — princípio recomendado */}
                <div className="rounded-3xl border border-gold/25 bg-gold/5 p-5 shadow-glow">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                    Comece por aqui
                  </p>
                  <p className="mt-1 font-display text-2xl text-ink">
                    {getPrinciple(diagnosis.recommendedPrincipleId)?.accessibleTitle}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {diagnosis.insight}
                  </p>
                </div>

                <Button size="lg" className="mt-1 w-full" onClick={() => go(2)}>
                  Definir meu grande objetivo <ArrowRight size={18} />
                </Button>
              </div>
            )}

            {step === 2 && (
              <DmpForm
                onSubmit={(dmp) => {
                  setDmp(dmp);
                  go(3);
                }}
              />
            )}

            {step === 3 && (
              <ReminderTimeStep
                onNext={(prefs) => {
                  prefs.forEach((p) => setReminder(p.kind, { time: p.time, enabled: p.enabled }));
                  go(4);
                }}
              />
            )}

            {step === 4 && (
              <CommitmentStep
                firstStepTitle={
                  getPrinciple(diagnosis?.recommendedPrincipleId ?? 1)?.accessibleTitle
                }
                onFinish={(name) => {
                  setName(name);
                  completeOnboarding(Date.now() - startedAt.current);
                  router.replace("/dashboard");
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
