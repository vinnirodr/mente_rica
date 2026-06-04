"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";

export function TopBar({ title }: { title?: string }) {
  const unread = useStore((s) => s.notifications.filter((n) => !n.read).length);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-5 py-4 backdrop-blur-md">
      <span className="font-display text-xl">{title ?? "MindRich"}</span>
      <Link
        href="/notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-night-800/60 text-ink-muted transition-colors hover:text-ink"
        aria-label="Notificações"
      >
        <Bell size={20} />
        {unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-ember px-1 text-[10px] font-bold text-white"
          >
            {unread}
          </motion.span>
        )}
      </Link>
    </header>
  );
}
