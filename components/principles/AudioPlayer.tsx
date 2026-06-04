"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";

// Player de áudio MOCK (narração do princípio). Sem arquivo real — simula o progresso
// para demonstrar a UX do "texto + áudio narrado" do escopo.
export function AudioPlayer({ title, duration = 154 }: { title: string; duration?: number }) {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (playing) {
      timer.current = setInterval(() => {
        setElapsed((e) => {
          if (e + 1 >= duration) {
            setPlaying(false);
            return 0;
          }
          return e + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer.current);
  }, [playing, duration]);

  const pct = (elapsed / duration) * 100;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-night-800/60 p-3">
      <button
        onClick={() => setPlaying((p) => !p)}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-gradient text-night shadow-glow"
        aria-label={playing ? "Pausar" : "Reproduzir"}
      >
        {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">Narração · {title}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-night-700">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-gold"
              animate={{ width: `${pct}%` }}
              transition={{ ease: "linear", duration: 0.4 }}
            />
          </div>
          <span className="text-[11px] tabular-nums text-ink-faint">
            {fmt(elapsed)} / {fmt(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}
