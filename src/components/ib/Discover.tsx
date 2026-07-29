import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ATTENDEES, EVENT, TOP_MATCH, type Person } from "@/data/attendees";
import { useStore } from "@/lib/store";
import { PersonSheet } from "./PersonSheet";
import { ActionButton } from "./primitives";

const ease = [0.22, 1, 0.36, 1] as const;

type Phase = "idle" | "emerging" | "focus";

/** Scattered constellation positions (% of stage), index 0 is the top match. */
const POS: { x: number; y: number; s: number }[] = [
  { x: 50, y: 46, s: 1 },
  { x: 20, y: 22, s: 0.72 },
  { x: 78, y: 20, s: 0.68 },
  { x: 33, y: 72, s: 0.74 },
  { x: 68, y: 74, s: 0.7 },
  { x: 12, y: 55, s: 0.6 },
  { x: 88, y: 52, s: 0.62 },
  { x: 46, y: 12, s: 0.56 },
  { x: 58, y: 88, s: 0.58 },
  { x: 27, y: 44, s: 0.5 },
  { x: 73, y: 42, s: 0.52 },
  { x: 88, y: 84, s: 0.46 },
];

export function Discover() {
  const { joinedEvent, profile } = useStore();
  const [phase, setPhase] = useState<Phase>("idle");
  const [selected, setSelected] = useState<Person | null>(null);

  useEffect(() => {
    if (phase !== "emerging") return;
    const t = window.setTimeout(() => setPhase("focus"), 5200);
    return () => clearTimeout(t);
  }, [phase]);

  if (!joinedEvent) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center px-6 pb-40 sm:px-10">
        <p className="eyebrow">Discover</p>
        <h2 className="display-lg mt-5 max-w-lg text-balance">
          Join an event to see who is in the room.
        </h2>
      </div>
    );
  }

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div
            key="idle"
            className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center px-6 pb-40 sm:px-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, filter: "blur(12px)", transition: { duration: 0.7, ease } }}
            transition={{ duration: 0.8, ease }}
          >
            <p className="eyebrow">{EVENT.name}</p>
            <h2 className="display-xl mt-6 max-w-2xl text-balance">
              {EVENT.attendees} people are here.
              <br />
              <span className="text-muted-foreground">A few of them matter to you.</span>
            </h2>
            <div className="mt-16">
              <ActionButton
                variant="accent"
                className="px-9"
                onClick={() => setPhase("emerging")}
              >
                Discover People
              </ActionButton>
            </div>
          </motion.div>
        )}

        {phase !== "idle" && (
          <motion.div
            key="stage"
            className="relative min-h-dvh"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease }}
          >
            {/* the pulse that reveals the room */}
            {phase === "emerging" &&
              [0, 1].map((i) => (
                <motion.span
                  key={i}
                  aria-hidden
                  className="pointer-events-none absolute top-[46%] left-1/2 size-[40vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
                  initial={{ scale: 0.05, opacity: 0.7 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 4.2, delay: i * 1.4, ease: "easeOut" }}
                />
              ))}

            <div className="relative h-[78vh] min-h-[520px] w-full">
              {ATTENDEES.map((person, i) => {
                const base = POS[i];
                const isTop = i === 0;
                const focus = phase === "focus";
                const delay = 0.35 + Math.hypot(base.x - 50, base.y - 46) * 0.035;

                return (
                  <motion.button
                    key={person.id}
                    onClick={() => setSelected(person)}
                    className="focus-ring absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ left: `${base.x}%`, top: `${base.y}%` }}
                    initial={{ opacity: 0, filter: "blur(22px) brightness(0.05)", scale: 0.85 }}
                    animate={{
                      opacity: focus ? (isTop ? 1 : 0.22) : 1,
                      filter: focus
                        ? isTop
                          ? "blur(0px) brightness(1)"
                          : "blur(3px) brightness(0.55)"
                        : "blur(0px) brightness(1)",
                      scale: focus ? (isTop ? 1.25 : base.s * 0.8) : base.s,
                      top: focus && isTop ? "40%" : `${base.y}%`,
                    }}
                    whileHover={{ scale: focus && !isTop ? base.s * 0.9 : undefined }}
                    transition={{
                      opacity: { duration: 2.2, delay: focus ? 0 : delay, ease },
                      filter: { duration: 2.6, delay: focus ? 0 : delay, ease },
                      scale: { type: "spring", stiffness: 120, damping: 24, delay: focus ? 0 : delay },
                      top: { type: "spring", stiffness: 90, damping: 22 },
                    }}
                  >
                    <motion.div
                      layoutId={`portrait-${person.id}`}
                      className="size-28 overflow-hidden rounded-full ring-1 ring-white/10 sm:size-36"
                    >
                      <img
                        src={person.photo}
                        alt={person.name}
                        loading="lazy"
                        className="size-full object-cover"
                      />
                    </motion.div>
                    {phase === "focus" && isTop && (
                      <motion.span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -m-3 rounded-full border border-primary/40"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: [0.5, 0.15, 0.5], scale: 1 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {phase === "focus" && (
                <motion.div
                  key="verdict"
                  className="relative z-10 mx-auto -mt-24 w-full max-w-2xl px-6 pb-44 text-center sm:px-10"
                  initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 1, ease, delay: 0.5 }}
                >
                  <h2 className="display-md text-balance">
                    We think you should meet {TOP_MATCH.firstName}.
                  </h2>
                  <div className="mt-8 space-y-2">
                    {TOP_MATCH.why.map((line, i) => (
                      <motion.p
                        key={line}
                        className="text-[1rem] text-muted-foreground"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 + i * 0.5, duration: 0.8, ease }}
                      >
                        {line}
                      </motion.p>
                    ))}
                  </div>
                  <motion.div
                    className="mt-12 flex flex-wrap justify-center gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.6, duration: 0.8, ease }}
                  >
                    <ActionButton variant="accent" onClick={() => setSelected(TOP_MATCH)}>
                      Open {TOP_MATCH.firstName}'s profile
                    </ActionButton>
                    <ActionButton variant="ghost" onClick={() => setPhase("idle")}>
                      Scan the room again
                    </ActionButton>
                  </motion.div>
                  <motion.p
                    className="mt-14 text-[0.8rem] text-muted-foreground/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.2, duration: 1 }}
                  >
                    {profile.name.split(" ")[0] || "You"} · {ATTENDEES.length - 1} others
                    quietly worth meeting
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selected && (
          <PersonSheet person={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
