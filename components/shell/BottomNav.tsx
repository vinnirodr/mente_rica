"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, CalendarHeart, Home, MessageCircleHeart, User } from "lucide-react";
import { cn } from "@/lib/cn";

const ITEMS = [
  { href: "/dashboard", label: "Início", icon: Home },
  { href: "/principles", label: "Princípios", icon: BookOpen },
  { href: "/journal", label: "Diário", icon: CalendarHeart },
  { href: "/coach", label: "Coach", icon: MessageCircleHeart },
  { href: "/settings", label: "Perfil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-40 mt-auto">
      <div className="glass mx-3 mb-3 flex items-center justify-around rounded-3xl px-2 py-2">
        {ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-1 flex-col items-center gap-1 py-1.5"
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-2xl bg-gold/10"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <Icon
                size={22}
                className={cn(
                  "relative transition-colors",
                  active ? "text-gold" : "text-ink-faint",
                )}
              />
              <span
                className={cn(
                  "relative text-[10px] font-medium transition-colors",
                  active ? "text-gold" : "text-ink-faint",
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
