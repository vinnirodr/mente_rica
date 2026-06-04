"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CheckCircle2, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";
import { TopBar } from "@/components/shell/TopBar";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import { DmpHighlight } from "@/components/dashboard/DmpHighlight";
import { StreakCard } from "@/components/dashboard/StreakCard";
import { PRINCIPLES, getPrinciple } from "@/lib/mock/principles";
import { nextRecommendedAction } from "@/lib/mock/coach";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export default function DashboardPage() {
  const user = useStore((s) => s.user);
  const streak = useStore((s) => s.streak());
  const best = useStore((s) => s.bestStreak);
  const completed = useStore((s) => s.completedCount());
  const currentId = useStore((s) => s.currentPrincipleId());
  const hasCheckedIn = useStore((s) => s.hasCheckedInToday());

  const current = getPrinciple(currentId);
  const pct = (completed / PRINCIPLES.length) * 100;
  const firstName = user.name.split(" ")[0] || "viajante";

  return (
    <div>
      <TopBar title="MindRich" />
      <div className="space-y-5 px-5 pb-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm text-ink-faint">{greeting()},</p>
          <h1 className="font-display text-2xl">
            {firstName} <span className="text-gold">✦</span>
          </h1>
        </motion.div>

        <DmpHighlight dmp={user.dmp} />

        <StreakCard streak={streak} best={best} />

        {/* Próxima ação recomendada pela IA */}
        <Card glow className="space-y-3 border-gold/15">
          <div className="flex items-center gap-2 text-gold">
            <Sparkles size={18} />
            <span className="text-xs font-semibold uppercase tracking-widest">
              Próxima ação do Coach
            </span>
          </div>
          <p className="text-[15px] leading-relaxed text-ink">
            {hasCheckedIn
              ? nextRecommendedAction({ currentPrinciple: current, streak })
              : "Comece o dia com seu check-in. Um toque é tudo o que você precisa."}
          </p>
          <Link href={hasCheckedIn ? `/principles/${currentId}` : "/journal"}>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
              {hasCheckedIn ? "Continuar prática" : "Fazer check-in"} <ArrowRight size={16} />
            </span>
          </Link>
        </Card>

        {/* Progresso dos 13 princípios */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg">
              <BookOpen size={18} className="text-gold" /> Seus 13 Princípios
            </h2>
            <Badge tone="gold">
              {completed}/{PRINCIPLES.length}
            </Badge>
          </div>
          <Card className="space-y-3">
            <ProgressBar value={pct} showLabel />
            {current && (
              <Link
                href={`/principles/${current.id}`}
                className="flex items-center justify-between rounded-2xl bg-night-700/40 p-3 transition-colors hover:bg-night-700/70"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15 font-display text-gold">
                    {current.id}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{current.accessibleTitle}</p>
                    <p className="text-xs text-ink-faint">Seu foco agora</p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-ink-faint" />
              </Link>
            )}
            {completed === PRINCIPLES.length && (
              <div className="flex items-center gap-2 rounded-2xl bg-emerald-400/10 p-3 text-emerald-300">
                <CheckCircle2 size={18} />
                <span className="text-sm font-medium">
                  Você concluiu todos os princípios. Parabéns!
                </span>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
