"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  interactive?: boolean;
  glow?: boolean;
  children?: React.ReactNode;
}

export function Card({ className, interactive, glow, children, ...props }: CardProps) {
  return (
    <motion.div
      whileTap={interactive ? { scale: 0.985 } : undefined}
      className={cn(
        "card-surface p-5",
        interactive && "cursor-pointer transition-colors hover:border-white/10 hover:bg-night-800/80",
        glow && "shadow-glow",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
