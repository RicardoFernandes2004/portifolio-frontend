"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";

interface FieldShellProps {
  label: string;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  required?: boolean;
}

export function FieldShell({
  label,
  hint,
  error,
  children,
  required,
}: FieldShellProps) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neon-cyan">
        {label}
        {required && <span className="text-neon-magenta">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="font-mono text-[11px] text-fg-muted">{hint}</p>
      )}
      {error && <p className="font-mono text-[11px] text-neon-red">{error}</p>}
    </div>
  );
}

export const TextInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...rest }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full bg-bg-deep/80 border border-border focus:border-neon-cyan focus:shadow-neon-cyan outline-none px-3 py-2.5 font-mono text-sm cyber-clip-sm transition-all placeholder:text-fg-muted",
      className,
    )}
    {...rest}
  />
));
TextInput.displayName = "TextInput";

export const TextAreaInput = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...rest }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full bg-bg-deep/80 border border-border focus:border-neon-cyan focus:shadow-neon-cyan outline-none px-3 py-2.5 font-mono text-sm cyber-clip-sm transition-all min-h-[120px] placeholder:text-fg-muted",
      className,
    )}
    {...rest}
  />
));
TextAreaInput.displayName = "TextAreaInput";

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string | number; label: string }>;
}

export const SelectInput = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, ...rest }, ref) => (
    <select
      ref={ref}
      className={cn(
        "w-full bg-bg-deep/80 border border-border focus:border-neon-cyan focus:shadow-neon-cyan outline-none px-3 py-2.5 font-mono text-sm cyber-clip-sm transition-all",
        className,
      )}
      {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  ),
);
SelectInput.displayName = "SelectInput";
