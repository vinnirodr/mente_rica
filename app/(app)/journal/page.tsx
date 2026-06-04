"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Flame, Search } from "lucide-react";
import { useStore } from "@/lib/store";
import { getPrinciple } from "@/lib/mock/principles";
import { TopBar } from "@/components/shell/TopBar";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { HeatmapCalendar } from "@/components/journal/HeatmapCalendar";
import { CheckinForm } from "@/components/journal/CheckinForm";

export default function JournalPage() {
  const journal = useStore((s) => s.journal);
  const streak = useStore((s) => s.streak());
  const currentId = useStore((s) => s.currentPrincipleId());
  const hasCheckedIn = useStore((s) => s.hasCheckedInToday());
  const addJournalEntry = useStore((s) => s.addJournalEntry);

  const [query, setQuery] = useState("");
  const principle = getPrinciple(currentId)!;

  const history = useMemo(() => {
    const sorted = [...journal].sort((a, b) => b.date.localeCompare(a.date));
    if (!query.trim()) return sorted;
    const q = query.toLowerCase();
    return sorted.filter(
      (e) => e.reflection.toLowerCase().includes(q) || e.answers.join(" ").toLowerCase().includes(q),
    );
  }, [journal, query]);

  return (
    <div>
      <TopBar title="Diário" />
      <div className="space-y-5 px-5 pb-6">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg">Consistência</h2>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-ember">
              <Flame size={16} /> {streak} dias
            </span>
          </div>
          <HeatmapCalendar entries={journal} />
        </Card>

        <AnimatePresence mode="wait">
          {hasCheckedIn ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5 text-emerald-300"
            >
              <CheckCircle2 size={22} />
              <div>
                <p className="font-semibold">Check-in de hoje concluído</p>
                <p className="text-sm text-emerald-300/80">Volte amanhã para manter a sequência.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <h2 className="mb-4 font-display text-lg">Check-in de hoje</h2>
                <CheckinForm
                  principle={principle}
                  onSubmit={(answers, reflection) =>
                    addJournalEntry({
                      date: new Date().toISOString().slice(0, 10),
                      answers,
                      reflection,
                      principleId: currentId,
                    })
                  }
                />
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg">Histórico</h2>
          </div>
          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
            />
            <Input
              placeholder="Buscar nas suas reflexões…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-11"
            />
          </div>

          {history.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-faint">
              {query ? "Nada encontrado." : "Seus check-ins aparecerão aqui."}
            </p>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => (
                <Card key={entry.date} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-ink">
                      {new Date(entry.date + "T12:00:00").toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                      })}
                    </span>
                    <span className="text-xs text-gold">
                      {getPrinciple(entry.principleId)?.title}
                    </span>
                  </div>
                  {entry.reflection ? (
                    <p className="text-sm leading-relaxed text-ink-muted">{entry.reflection}</p>
                  ) : (
                    <p className="text-sm italic text-ink-faint">Check-in rápido registrado.</p>
                  )}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {entry.answers.map((a, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-night-700/50 px-2.5 py-0.5 text-xs text-ink-muted"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
