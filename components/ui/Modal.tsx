"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

// Bottom-sheet modal (estilo mobile) usado para paywall e confirmações.
export function Modal({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-[91] mx-auto w-full max-w-md"
          >
            <div className="card-surface rounded-b-none rounded-t-3xl p-6 pb-8">
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/15" />
              {title && (
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-xl text-ink">{title}</h2>
                  <button onClick={onClose} className="text-ink-faint hover:text-ink" aria-label="Fechar">
                    <X size={20} />
                  </button>
                </div>
              )}
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
