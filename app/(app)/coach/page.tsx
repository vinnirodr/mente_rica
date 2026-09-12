"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";
import { getPrinciple } from "@/lib/mock/principles";
import { CoachError, streamChatReply } from "@/lib/coach/api";
import { ChatBubble, TypingIndicator } from "@/components/coach/ChatBubble";
import type { ChatMessage } from "@/lib/types";

const SUGGESTIONS = [
  "Como começo meu objetivo hoje?",
  "Estou desanimado, e agora?",
  "Me ajude a planejar a semana",
];

export default function CoachPage() {
  const user = useStore((s) => s.user);
  const chat = useStore((s) => s.chat);
  const addChatMessage = useStore((s) => s.addChatMessage);
  const currentId = useStore((s) => s.currentPrincipleId());

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  /** Resposta parcial enquanto chega; só vai para o store quando completa. */
  const [streamed, setStreamed] = useState("");
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chat, typing, streamed]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    addChatMessage(userMsg);
    setInput("");
    setTyping(true);
    setStreamed("");
    setError(null);

    // O store ainda não refletiu a mensagem nova neste render, então monta o
    // histórico à mão para não enviar uma conversa defasada.
    const history = [...chat, userMsg].map((m) => ({ role: m.role, content: m.content }));

    try {
      const reply = await streamChatReply(
        {
          messages: history,
          principle: getPrinciple(currentId),
          name: user.name || undefined,
          dmp: user.dmp,
        },
        (chunk) => setStreamed((prev) => prev + chunk),
      );
      addChatMessage({
        id: `a-${Date.now()}`,
        role: "assistant",
        content: reply,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      setError(
        err instanceof CoachError
          ? err.message
          : "Não consegui falar com o coach agora. Tente de novo.",
      );
    } finally {
      setTyping(false);
      setStreamed("");
    }
  }

  return (
    <div className="flex h-[calc(100vh-76px)] flex-col">
      <header className="flex items-center gap-3 px-5 py-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-gradient text-night shadow-glow">
          <Sparkles size={22} />
        </span>
        <div>
          <h1 className="font-display text-xl leading-none">Coach IA</h1>
          <p className="text-xs text-emerald-300">● disponível 24/7</p>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 pb-4">
        {chat.length === 0 && (
          <div className="mt-6 space-y-4 text-center">
            <p className="font-display text-lg text-ink">
              Olá, {user.name.split(" ")[0] || "viajante"}. No que vamos trabalhar hoje?
            </p>
            <p className="mx-auto max-w-xs text-sm text-ink-muted">
              Direto, encorajador e focado em ação — pergunte qualquer coisa sobre seu
              objetivo e seus princípios.
            </p>
          </div>
        )}

        {chat.map((m) => (
          <ChatBubble key={m.id} message={m} />
        ))}

        {streamed && (
          <ChatBubble
            message={{
              id: "streaming",
              role: "assistant",
              content: streamed,
              createdAt: new Date().toISOString(),
            }}
          />
        )}

        <AnimatePresence>{typing && !streamed && <TypingIndicator />}</AnimatePresence>

        {error && (
          <div className="rounded-2xl border border-ember/30 bg-ember/10 p-4 text-center text-sm text-ink">
            {error}
          </div>
        )}
      </div>

      {chat.length === 0 && (
        <div className="flex flex-wrap gap-2 px-5 pb-3">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-white/10 bg-night-800/60 px-3 py-1.5 text-xs text-ink-muted transition-colors hover:border-gold/40 hover:text-ink"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="border-t border-white/5 px-4 py-3">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={1}
            placeholder="Escreva sua mensagem…"
            className="max-h-28 flex-1 resize-none rounded-2xl border border-white/10 bg-night-800/80 px-4 py-3 text-[15px] text-ink placeholder:text-ink-faint outline-none focus:border-gold/60"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || typing}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold-gradient text-night shadow-glow transition-opacity disabled:opacity-40"
            aria-label="Enviar"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
