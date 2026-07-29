import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Person } from "@/data/attendees";

const ease = [0.22, 1, 0.36, 1] as const;

export function Assistant({ person }: { person: Person }) {
  const lines = [
    `Ask ${person.firstName} what inspired her ${person.project.split("—")[0].trim()} project.`,
    person.interests.includes("Anime")
      ? "You also both enjoy Attack on Titan."
      : `You both care about ${person.interests[0].toLowerCase()}.`,
    "That would be a natural conversation starter.",
  ];

  const [shown, setShown] = useState(-1);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setShown(0), 1600),
      window.setTimeout(() => setShown(1), 3400),
      window.setTimeout(() => setShown(2), 5100),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="surface-panel px-6 py-6">
      <div className="flex items-center gap-3">
        <motion.span
          className="block size-1.5 rounded-full bg-primary"
          animate={{ opacity: shown < 2 ? [0.25, 1, 0.25] : 1 }}
          transition={{ duration: 2, repeat: shown < 2 ? Infinity : 0, ease: "easeInOut" }}
        />
        <p className="eyebrow">Assistant</p>
      </div>

      <div className="mt-5 min-h-24 space-y-3">
        <AnimatePresence mode="wait">
          {shown < 0 && (
            <motion.p
              key="thinking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              exit={{ opacity: 0, filter: "blur(6px)" }}
              transition={{ duration: 0.6 }}
              className="text-[0.95rem] text-muted-foreground"
            >
              Thinking…
            </motion.p>
          )}
        </AnimatePresence>

        {lines.map((line, i) =>
          shown >= i ? (
            <motion.p
              key={line}
              initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
              animate={{ opacity: i === shown ? 1 : 0.45, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, ease }}
              className="text-[0.98rem] leading-relaxed"
            >
              {line}
            </motion.p>
          ) : null,
        )}
      </div>
    </div>
  );
}
