import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  INTEREST_OPTIONS,
  MEETING_OPTIONS,
  NOTE_PLACEHOLDERS,
  TOPIC_OPTIONS,
} from "@/data/attendees";
import { useStore, type Profile } from "@/lib/store";
import { ActionButton, ChipField } from "./primitives";

const ease = [0.22, 1, 0.36, 1] as const;

const QUESTIONS = [
  { q: "What's your name?", aside: "So people know who said hello." },
  { q: "What are you into lately?", aside: "Pick a few. Add your own." },
  { q: "Who are you hoping to meet today?", aside: "Be honest. It works better." },
  { q: "What would you enjoy talking about?", aside: "This is what breaks the ice." },
  { q: "Anything people should know before saying hello?", aside: "Optional, but it helps." },
];

export function Onboarding() {
  const { completeOnboarding } = useStore();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [profile, setProfile] = useState<Profile>({
    name: "",
    interests: [],
    meeting: [],
    topics: [],
    note: "",
  });

  const placeholder = useMemo(
    () => NOTE_PLACEHOLDERS[Math.floor(Math.random() * NOTE_PLACEHOLDERS.length)],
    [],
  );

  const canAdvance =
    (step === 0 && profile.name.trim().length > 1) ||
    (step === 1 && profile.interests.length > 0) ||
    (step === 2 && profile.meeting.length > 0) ||
    (step === 3 && profile.topics.length > 0) ||
    step === 4;

  const last = step === QUESTIONS.length - 1;

  const next = () => {
    if (!canAdvance) return;
    if (last) {
      completeOnboarding({
        ...profile,
        name: profile.name.trim(),
        note: profile.note.trim(),
      });
      return;
    }
    setDir(1);
    setStep((s) => s + 1);
  };

  const back = () => {
    if (step === 0) return;
    setDir(-1);
    setStep((s) => s - 1);
  };

  const progress = (step + (canAdvance ? 1 : 0.35)) / QUESTIONS.length;

  return (
    <div className="grain relative flex min-h-dvh flex-col overflow-hidden px-6 pt-10 pb-12 sm:px-10">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 size-[70vmax] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 9%, transparent), transparent)",
        }}
        animate={{ opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* progress */}
      <div className="relative mx-auto w-full max-w-3xl">
        <div className="flex items-center justify-between">
          <p className="eyebrow">
            {String(step + 1).padStart(2, "0")} — {QUESTIONS.length}
          </p>
          <p className="font-mono text-[0.7rem] text-muted-foreground/60">
            {Math.round(progress * 100)}%
          </p>
        </div>
        <div className="mt-3 h-px w-full bg-border">
          <motion.div
            className="h-px origin-left bg-primary"
            animate={{ scaleX: progress }}
            initial={{ scaleX: 0 }}
            transition={{ duration: 0.9, ease }}
          />
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-3xl flex-1 items-center">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, y: dir * 26, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: dir * -26, filter: "blur(12px)" }}
            transition={{ duration: 0.65, ease }}
            className="w-full py-14"
          >
            <motion.h2
              className="display-lg max-w-xl text-balance"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.05 }}
            >
              {QUESTIONS[step].q}
            </motion.h2>
            <motion.p
              className="mt-4 text-[0.95rem] text-muted-foreground/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.25 }}
            >
              {QUESTIONS[step].aside}
            </motion.p>

            <div className="mt-14">
              {step === 0 && (
                <input
                  autoFocus
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && next()}
                  placeholder="Philip"
                  className="w-full max-w-xl border-b border-border-strong bg-transparent pb-4 text-3xl font-light tracking-[-0.02em] outline-none transition-colors placeholder:text-muted-foreground/30 focus:border-primary sm:text-5xl"
                />
              )}

              {step === 1 && (
                <ChipField
                  options={INTEREST_OPTIONS}
                  value={profile.interests}
                  onChange={(interests) => setProfile((p) => ({ ...p, interests }))}
                  placeholder="Something else you're into…"
                />
              )}

              {step === 2 && (
                <ChipField
                  options={MEETING_OPTIONS}
                  value={profile.meeting}
                  onChange={(meeting) => setProfile((p) => ({ ...p, meeting }))}
                  placeholder="Someone else entirely…"
                />
              )}

              {step === 3 && (
                <ChipField
                  options={TOPIC_OPTIONS}
                  value={profile.topics}
                  onChange={(topics) => setProfile((p) => ({ ...p, topics }))}
                  placeholder="Add a topic…"
                />
              )}

              {step === 4 && (
                <div className="max-w-2xl">
                  <textarea
                    autoFocus
                    rows={3}
                    value={profile.note}
                    onChange={(e) => setProfile((p) => ({ ...p, note: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full resize-none border-b border-border-strong bg-transparent pb-4 text-2xl leading-snug font-light tracking-[-0.02em] outline-none transition-colors placeholder:text-muted-foreground/30 focus:border-primary"
                  />
                  <div className="mt-8 flex flex-wrap gap-2">
                    {NOTE_PLACEHOLDERS.map((n) => (
                      <button
                        key={n}
                        onClick={() => setProfile((p) => ({ ...p, note: n }))}
                        className="focus-ring rounded-full border border-border px-3.5 py-1.5 text-[0.8rem] text-muted-foreground/70 transition-colors hover:border-border-strong hover:text-foreground"
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative mx-auto flex w-full max-w-3xl items-center justify-between">
        <button
          onClick={back}
          className="focus-ring rounded-full px-2 py-2 text-sm text-muted-foreground transition-opacity hover:text-foreground"
          style={{ opacity: step === 0 ? 0 : 1, pointerEvents: step === 0 ? "none" : "auto" }}
        >
          Back
        </button>
        <motion.div animate={{ opacity: canAdvance ? 1 : 0.3 }} transition={{ duration: 0.4 }}>
          <ActionButton variant="accent" onClick={next} disabled={!canAdvance}>
            {last ? "Enter Icebreaker" : "Continue"}
          </ActionButton>
        </motion.div>
      </div>
    </div>
  );
}
