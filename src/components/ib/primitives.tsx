import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "accent" | "outline" | "ghost" | "quiet";

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
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98, y: 0 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className={cn(
        "focus-ring group relative inline-flex h-13 items-center justify-center gap-3 overflow-hidden rounded-full px-7 text-[0.95rem] font-medium tracking-[-0.01em] transition-colors duration-300",
        variant === "accent" &&
          "bg-primary text-primary-foreground shadow-[0_10px_30px_-12px_var(--primary)] hover:bg-primary/90",
        variant === "outline" &&
          "border border-border-strong bg-white/[0.02] text-foreground hover:border-primary/50 hover:bg-white/[0.05]",
        variant === "quiet" &&
          "border border-border bg-transparent text-muted-foreground hover:border-border-strong hover:text-foreground",
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
      <circle cx="12" cy="12" r="3" fill={active ? "var(--primary)" : "currentColor"} />
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeOpacity="0.45" />
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeOpacity="0.18" />
    </svg>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-border", className)} />;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="block h-px w-6 bg-border-strong" />
      <p className="eyebrow">{children}</p>
    </div>
  );
}

export function Chip({
  label,
  selected,
  onClick,
  onRemove,
}: {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      layout
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 400, damping: 26 }}
      className={cn(
        "focus-ring relative inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition-colors duration-300",
        selected
          ? "border-primary/60 bg-primary/[0.14] text-primary"
          : "border-border-strong bg-white/[0.015] text-muted-foreground hover:border-foreground/25 hover:text-foreground",
      )}
    >
      {selected && (
        <motion.span
          layoutId={`chipdot-${label}`}
          className="block size-1.5 rounded-full bg-primary"
        />
      )}
      {label}
      {onRemove && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="-mr-1 grid size-4 place-items-center rounded-full text-primary/70 hover:text-primary"
        >
          <X className="size-3" />
        </span>
      )}
    </motion.button>
  );
}

export function StaticChip({ label, tone }: { label: string; tone?: "accent" }) {
  return (
    <span
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-[0.8rem]",
        tone === "accent"
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-border bg-white/[0.02] text-muted-foreground",
      )}
    >
      {label}
    </span>
  );
}

/**
 * Suggested chips plus free typing. Custom answers become chips as you type.
 */
export function ChipField({
  options,
  value,
  onChange,
  placeholder = "Type your own…",
}: {
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  const toggle = (v: string) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);

  const commit = () => {
    const v = draft.trim();
    if (!v) return;
    if (!value.some((x) => x.toLowerCase() === v.toLowerCase())) onChange([...value, v]);
    setDraft("");
  };

  const custom = value.filter(
    (v) => !options.some((o) => o.toLowerCase() === v.toLowerCase()),
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2.5">
        {options.map((o, i) => (
          <motion.div
            key={o}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.03 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Chip label={o} selected={value.includes(o)} onClick={() => toggle(o)} />
          </motion.div>
        ))}
        <AnimatePresence>
          {custom.map((c) => (
            <motion.div
              key={c}
              layout
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
            >
              <Chip label={c} selected onRemove={() => toggle(c)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex max-w-lg items-center gap-3 border-b border-border pb-3 transition-colors focus-within:border-primary/60">
        <span className="text-muted-foreground/40">+</span>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commit();
            }
            if (e.key === "Backspace" && !draft && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={commit}
          placeholder={placeholder}
          className="w-full bg-transparent text-[1.05rem] font-light outline-none placeholder:text-muted-foreground/35"
        />
      </div>
    </div>
  );
}
