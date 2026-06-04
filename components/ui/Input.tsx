"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/cn";

interface FieldProps {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & FieldProps
>(function Input({ label, error, hint, className, id, ...props }, ref) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={fieldId} className="text-sm font-medium text-ink-muted">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={fieldId}
        className={cn(
          "w-full h-12 rounded-2xl bg-night-800/80 border px-4 text-ink placeholder:text-ink-faint outline-none transition-colors",
          "focus:border-gold/60 focus:ring-2 focus:ring-gold/20",
          error ? "border-ember/70" : "border-white/10",
          className,
        )}
        aria-invalid={!!error}
        {...props}
      />
      {error ? (
        <p className="text-sm text-ember animate-fade-in">{error}</p>
      ) : hint ? (
        <p className="text-xs text-ink-faint">{hint}</p>
      ) : null}
    </div>
  );
});

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps
>(function Textarea({ label, error, hint, className, id, ...props }, ref) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={fieldId} className="text-sm font-medium text-ink-muted">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={fieldId}
        className={cn(
          "w-full min-h-[120px] rounded-2xl bg-night-800/80 border px-4 py-3 text-ink placeholder:text-ink-faint outline-none transition-colors resize-none leading-relaxed",
          "focus:border-gold/60 focus:ring-2 focus:ring-gold/20",
          error ? "border-ember/70" : "border-white/10",
          className,
        )}
        aria-invalid={!!error}
        {...props}
      />
      {error ? (
        <p className="text-sm text-ember animate-fade-in">{error}</p>
      ) : hint ? (
        <p className="text-xs text-ink-faint">{hint}</p>
      ) : null}
    </div>
  );
});
