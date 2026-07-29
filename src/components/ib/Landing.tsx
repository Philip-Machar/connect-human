import { motion } from "motion/react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { ActionButton } from "./primitives";

const ease = [0.22, 1, 0.36, 1] as const;

const providers = [
  { id: "google", label: "Continue with Google" },
  { id: "apple", label: "Continue with Apple" },
  { id: "phone", label: "Continue with Phone" },
];

export function Landing() {
  const { signIn } = useStore();
  const [pending, setPending] = useState<string | null>(null);

  const go = (id: string) => {
    if (pending) return;
    setPending(id);
    window.setTimeout(signIn, 1100);
  };

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6">
      {/* one slow breathing ring — the product's heartbeat */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute size-[70vmin] rounded-full border border-white/[0.05]"
        animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.15, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute size-[40vmin] rounded-full border border-white/[0.06]"
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.1, 0.6] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      />

      <motion.div
        className="relative flex w-full max-w-md flex-col items-center text-center"
        initial="hidden"
        animate={pending ? "leaving" : "shown"}
        variants={{
          hidden: {},
          shown: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
          leaving: { opacity: 0, filter: "blur(10px)", transition: { duration: 0.7, ease } },
        }}
      >
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 14, filter: "blur(12px)" },
            shown: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.1, ease } },
          }}
          className="text-[clamp(1.9rem,5.5vw,2.9rem)] font-medium tracking-[0.34em] text-foreground"
        >
          ICEBREAKER
        </motion.h1>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 10 },
            shown: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
          }}
          className="mt-6 text-[0.98rem] leading-relaxed text-muted-foreground"
        >
          Find common ground before saying hello.
        </motion.p>

        <motion.div
          className="mt-16 flex w-full flex-col gap-3"
          variants={{
            hidden: {},
            shown: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } },
          }}
        >
          {providers.map((p) => (
            <motion.div
              key={p.id}
              variants={{
                hidden: { opacity: 0, y: 12 },
                shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
              }}
            >
              <ActionButton
                variant={p.id === "google" ? "accent" : "outline"}
                className="w-full"
                onClick={() => go(p.id)}
              >
                {p.label}
              </ActionButton>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.p
        className="absolute bottom-10 text-[0.7rem] tracking-[0.18em] text-muted-foreground/50 uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: pending ? 0 : 1 }}
        transition={{ duration: 1.2, delay: 1 }}
      >
        Nairobi · 175 people are already here
      </motion.p>
    </div>
  );
}
