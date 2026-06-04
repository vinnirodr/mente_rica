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
import type { MindsetProfile } from "@/lib/types";

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const router = useRouter();
  const hydrated = useStore((s) => s.hydrated);
  const completed = useStore((s) => s.onboarding.completed);
  const savedStep = useStore((s) => s.onboarding.step);
  const setOnboardingStep = useStore((s) => s.setOnboardingStep);
  const setMindset = useStore((s) => s.setMindset);
  const setDmp = useStore((s) => s.setDmp);
  const setName = useStore((s) => s.setName);
  const setReminder = useStore((s) => s.setReminder);
  const completeOnboarding = useStore((s) => s.completeOnboarding);

  const [step, setStep] = useState(0);
  const [mindset, setMindsetResult] = useState<{ profile: MindsetProfile; description: string } | null>(
    null,
  );
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
            key={mindset && step === 1 ? "result" : step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="min-h-[70vh]"
          >
            {step === 0 && <WelcomeStep onNext={() => go(1)} />}

            {step === 1 && !mindset && (
              <MindsetQuiz
                onDone={(result) => {
                  setMindsetResult(result);
                  setMindset(result.profile);
                }}
              />
            )}

            {step === 1 && mindset && (
              <div className="flex min-h-full flex-col justify-center gap-6 py-8 text-center">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 16 }}
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gold-gradient shadow-glow"
                >
                  <Sparkles className="text-night" size={32} />
                </motion.div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-ink-faint">
                    Seu perfil de mentalidade
                  </p>
                  <h2 className="mt-1 font-display text-4xl gold-text">{mindset.profile}</h2>
                </div>
                <p className="text-ink-muted">{mindset.description}</p>
                <Button size="lg" className="mt-4 w-full" onClick={() => go(2)}>
                  Definir meu objetivo <ArrowRight size={18} />
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
