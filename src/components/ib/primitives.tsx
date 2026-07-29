import { motion } from "motion/react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "accent" | "outline" | "ghost";

export function ActionButton({
  children,
  variant = "outline",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={cn(
        "focus-ring inline-flex h-13 items-center justify-center gap-3 rounded-full px-7 text-[0.95rem] font-medium tracking-[-0.01em] transition-colors duration-300",
        variant === "accent" &&
          "bg-primary text-primary-foreground hover:bg-primary/90",
        variant === "outline" &&
          "border border-border-strong bg-transparent text-foreground hover:border-primary/60 hover:text-primary",
        variant === "ghost" && "text-muted-foreground hover:text-foreground",
        className,
      )}
      {...(props as Record<string, unknown>)}
    >
      {children}
    </motion.button>
  );
}

export function Mark({ size = 22, active = true }: { size?: number; active?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="3"
        fill={active ? "var(--primary)" : "currentColor"}
      />
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeOpacity="0.45" />
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeOpacity="0.18" />
    </svg>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-border", className)} />;
}

export function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      layout
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      className={cn(
        "focus-ring rounded-full border px-5 py-2.5 text-sm transition-colors duration-300",
        selected
          ? "border-primary/70 bg-primary/12 text-primary"
          : "border-border-strong text-muted-foreground hover:border-foreground/30 hover:text-foreground",
      )}
    >
      {label}
    </motion.button>
  );
}

export function StaticChip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-border px-3.5 py-1.5 text-[0.8rem] text-muted-foreground">
      {label}
    </span>
  );
}
