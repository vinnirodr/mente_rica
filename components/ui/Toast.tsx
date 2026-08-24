"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award, Bell, X } from "lucide-react";
import { useStore } from "@/lib/store";
import type { AppNotification } from "@/lib/types";

// Viewport global de toasts. Observa a lista de notificações do store e, sempre que
// uma nova entra (ex.: um lembrete disparado pelo agendador simulado), exibe um
// toast in-app — demonstrando o canal de push como o usuário o veria no celular.

const TOAST_TTL = 5000;

export function ToastViewport() {
  const notifications = useStore((s) => s.notifications);
  const hydrated = useStore((s) => s.hydrated);
  const [active, setActive] = useState<AppNotification[]>([]);
  const seen = useRef<Set<string>>(new Set());
  const primed = useRef(false);

  useEffect(() => {
    if (!hydrated) return;
    // Na primeira hidratação, marca tudo como já visto para não "estourar" toasts antigos.
    if (!primed.current) {
      notifications.forEach((n) => seen.current.add(n.id));
      primed.current = true;
      return;
    }
    const fresh = notifications.filter((n) => !seen.current.has(n.id));
    if (fresh.length === 0) return;
    fresh.forEach((n) => seen.current.add(n.id));
    setActive((prev) => [...fresh, ...prev].slice(0, 3));
    fresh.forEach((n) => {
      setTimeout(() => setActive((prev) => prev.filter((t) => t.id !== n.id)), TOAST_TTL);
    });
  }, [notifications, hydrated]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex justify-center px-3 pt-3">
      <div className="w-full max-w-md space-y-2">
        <AnimatePresence initial={false}>
          {active.map((n) => (
            <motion.div
              key={n.id}
              layout
              initial={{ opacity: 0, y: -24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 360, damping: 28 }}
              className="pointer-events-auto card-surface flex items-start gap-3 p-4 shadow-glow"
            >
              <div
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  n.kind === "achievement"
                    ? "bg-gold-gradient text-night shadow-glow"
                    : "bg-gold/15 text-gold"
                }`}
              >
                {n.kind === "achievement" ? <Award size={18} /> : <Bell size={18} />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{n.title}</p>
                <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-ink-muted">
                  {n.body}
                </p>
              </div>
              <button
                onClick={() => setActive((prev) => prev.filter((t) => t.id !== n.id))}
                className="text-ink-faint transition-colors hover:text-ink"
                aria-label="Dispensar"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
