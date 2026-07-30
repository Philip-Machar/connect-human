import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ATTENDEES, EVENT, TOP_MATCH, type Person } from "@/data/attendees";
import { useStore } from "@/lib/store";
import { PersonSheet } from "./PersonSheet";
import { ActionButton, Eyebrow } from "./primitives";

const ease = [0.22, 1, 0.36, 1] as const;

type Phase = "idle" | "emerging" | "focus";

/** Scattered constellation positions (% of stage), index 0 is the top match. */
const POS: { x: number; y: number; s: number }[] = [
  { x: 50, y: 44, s: 1 },
  { x: 20, y: 22, s: 0.72 },
  { x: 78, y: 20, s: 0.68 },
  { x: 33, y: 72, s: 0.74 },
  { x: 68, y: 74, s: 0.7 },
  { x: 11, y: 55, s: 0.6 },
  { x: 89, y: 52, s: 0.62 },
  { x: 46, y: 10, s: 0.56 },
  { x: 58, y: 90, s: 0.58 },
  { x: 27, y: 44, s: 0.5 },
  { x: 73, y: 42, s: 0.52 },
  { x: 88, y: 86, s: 0.46 },
];

/** Who appears, and together with whom. The top match (0) arrives late. */
const WAVES: number[][] = [
  [1],
  [2],
  [3, 4],
  [5],
  [7],
  [6, 8],
  [9],
  [10, 11],
  [0],
];
const GAP = 1050; // ms between waves — the whole reveal runs ~9.5s

export function Discover() {
  const { joinedEvent, profile } = useStore();
  const [phase, setPhase] = useState<Phase>("idle");
  const [shown, setShown] = useState<number[]>([]);
  const [pulse, setPulse] = useState(0);
  const [selected, setSelected] = useState<Person | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (phase !== "emerging") return;
    setShown([]);
    setPulse(0);
    const t: number[] = [];

    // two empty pulses first — nothing happens, and that's the point
    t.push(window.setTimeout(() => setPulse((p) => p + 1), 200));
    t.push(window.setTimeout(() => setPulse((p) => p + 1), 1250));

    WAVES.forEach((wave, i) => {
      const at = 2200 + i * GAP;
      t.push(window.setTimeout(() => setPulse((p) => p + 1), at - 420));
      t.push(window.setTimeout(() => setShown((s) => [...s, ...wave]), at));
    });

    t.push(
      window.setTimeout(() => setPhase("focus"), 2200 + WAVES.length * GAP + 900),
    );

    timers.current = t;
    return () => t.forEach(clearTimeout);
  }, [phase]);

  const restart = () => {
    timers.current.forEach(clearTimeout);
    setShown([]);
    setPhase("idle");
  };

  if (!joinedEvent) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center px-6 pb-40 sm:px-10">
        <Eyebrow>Discover</Eyebrow>
        <h2 className="display-lg mt-6 max-w-lg text-balance">
          Join an event to see who is in the room.
        </h2>
        <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-muted-foreground">
          Scan the code at the door and the room quietly opens up.
        </p>
      </div>
    );
  }

  const focus = phase === "focus";

  return (
    <div className="grain relative min-h-dvh overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div
            key="idle"
            className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center px-6 pb-40 sm:px-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, filter: "blur(14px)", transition: { duration: 0.8, ease } }}
            transition={{ duration: 0.8, ease }}
          >
            <Eyebrow>{EVENT.name}</Eyebrow>
            <h2 className="display-xl mt-7 max-w-2xl text-balance">
              {EVENT.attendees} people are here.
              <br />
              <span className="text-muted-foreground">A few of them matter to you.</span>
            </h2>
            <p className="mt-8 max-w-sm text-[0.95rem] leading-relaxed text-muted-foreground/80">
              We'll look around the room slowly. It takes a moment.
            </p>
            <div className="mt-14">
              <ActionButton variant="accent" className="px-9" onClick={() => setPhase("emerging")}>
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
            transition={{ duration: 0.9, ease }}
          >
            {/* pulses leaving the centre */}
            <AnimatePresence>
              {!focus && (
                <motion.span
                  key={pulse}
                  aria-hidden
                  className="pointer-events-none absolute top-[44%] left-1/2 size-[26vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.12]"
                  initial={{ scale: 0.08, opacity: 0.85 }}
                  animate={{ scale: 3.4, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2.6, ease: "easeOut" }}
                />
              )}
            </AnimatePresence>

            <div className="relative h-[78vh] min-h-[540px] w-full">
              {ATTENDEES.map((person, i) => {
                const base = POS[i];
                const isTop = i === 0;
                const visible = focus || shown.includes(i);

                return (
                  <motion.button
                    key={person.id}
                    onClick={() => visible && setSelected(person)}
                    className="focus-ring absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ left: `${base.x}%`, top: `${base.y}%` }}
                    initial={{ opacity: 0, filter: "blur(24px) brightness(0.05)", scale: 0.8 }}
                    animate={{
                      opacity: visible ? (focus ? (isTop ? 1 : 0.2) : 1) : 0,
                      filter: visible
                        ? focus && !isTop
                          ? "blur(3px) brightness(0.5)"
                          : "blur(0px) brightness(1)"
                        : "blur(24px) brightness(0.05)",
                      scale: focus ? (isTop ? 1.3 : base.s * 0.78) : visible ? base.s : 0.8,
                      top: focus && isTop ? "38%" : `${base.y}%`,
                    }}
                    whileHover={{ scale: focus && !isTop ? base.s * 0.88 : undefined }}
                    transition={{
                      opacity: { duration: 1.6, ease },
                      filter: { duration: 1.9, ease },
                      scale: { type: "spring", stiffness: 110, damping: 22 },
                      top: { type: "spring", stiffness: 80, damping: 22 },
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

                    {/* a soft ring lands the moment someone appears */}
                    {visible && !focus && (
                      <motion.span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -m-2 rounded-full border border-white/25"
                        initial={{ opacity: 0.8, scale: 1.5 }}
                        animate={{ opacity: 0, scale: 1 }}
                        transition={{ duration: 1.1, ease }}
                      />
                    )}
                    {focus && isTop && (
                      <motion.span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -m-3 rounded-full border border-primary/40"
                        animate={{ opacity: [0.5, 0.15, 0.5] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      />
                    )}
                  </motion.button>
                );
              })}

              {/* quiet counter while the room fills */}
              <AnimatePresence>
                {!focus && (
                  <motion.p
                    key="counter"
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[0.72rem] tracking-[0.2em] text-muted-foreground/50 uppercase"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    {shown.length === 0
                      ? "Listening to the room…"
                      : `${shown.length} nearby`}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {focus && (
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
                  <div className="mt-10 space-y-3">
                    {TOP_MATCH.why.map((line, i) => (
                      <motion.p
                        key={line}
                        className="text-[1rem] text-muted-foreground"
                        initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ delay: 1 + i * 0.55, duration: 0.8, ease }}
                      >
                        {line}
                      </motion.p>
                    ))}
                  </div>
                  <motion.div
                    className="mt-12 flex flex-wrap justify-center gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.7, duration: 0.8, ease }}
                  >
                    <ActionButton variant="accent" onClick={() => setSelected(TOP_MATCH)}>
                      Open {TOP_MATCH.firstName}'s profile
                    </ActionButton>
                    <ActionButton variant="ghost" onClick={restart}>
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
        {selected && <PersonSheet person={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
