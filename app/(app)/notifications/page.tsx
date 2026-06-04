"use client";

import { useState } from "react";
import { ArrowLeft, CheckCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { NotificationFeed } from "@/components/notifications/NotificationFeed";
import { ReminderScheduler } from "@/components/notifications/ReminderScheduler";

type Tab = "feed" | "settings";

export default function NotificationsPage() {
  const router = useRouter();
  const notifications = useStore((s) => s.notifications);
  const markRead = useStore((s) => s.markNotificationRead);
  const markAllRead = useStore((s) => s.markAllRead);
  const unread = useStore((s) => s.unreadCount());
  const [tab, setTab] = useState<Tab>("feed");

  return (
    <div>
      <header className="sticky top-0 z-30 flex items-center justify-between px-5 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-night-800/60 text-ink-muted hover:text-ink"
            aria-label="Voltar"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-display text-xl">Notificações</h1>
        </div>
        {tab === "feed" && unread > 0 && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-1.5 text-sm text-gold"
          >
            <CheckCheck size={16} /> Marcar lidas
          </button>
        )}
      </header>

      <div className="space-y-5 px-5 pb-6">
        <div className="flex gap-1 rounded-2xl bg-night-800/60 p-1">
          <button
            onClick={() => setTab("feed")}
            className={
              "flex-1 rounded-xl py-2 text-sm font-medium transition-colors " +
              (tab === "feed" ? "bg-gold text-night" : "text-ink-muted")
            }
          >
            Caixa de entrada{unread > 0 ? ` (${unread})` : ""}
          </button>
          <button
            onClick={() => setTab("settings")}
            className={
              "flex-1 rounded-xl py-2 text-sm font-medium transition-colors " +
              (tab === "settings" ? "bg-gold text-night" : "text-ink-muted")
            }
          >
            Lembretes
          </button>
        </div>

        {tab === "feed" ? (
          <NotificationFeed notifications={notifications} onRead={markRead} />
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-night-800/50 p-4">
              <p className="text-sm leading-relaxed text-ink-muted">
                As notificações push são o canal principal do MindRich. Configure seus
                rituais — toque em <span className="text-gold">Testar agora</span> para ver
                como o lembrete chega.
              </p>
            </div>
            <ReminderScheduler />
          </div>
        )}
      </div>
    </div>
  );
}
