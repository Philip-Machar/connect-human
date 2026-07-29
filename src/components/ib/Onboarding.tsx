import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { INTEREST_OPTIONS, LOOKING_FOR_OPTIONS } from "@/data/attendees";
import { useStore, type Profile } from "@/lib/store";
import { ActionButton, Chip } from "./primitives";

const ease = [0.22, 1, 0.36, 1] as const;

const questions = ["What's your name?", "Choose your interests", "What are you looking for?", "What are you building?"];

export function Onboarding() {
  const { completeOnboarding } = useStore();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [profile, setProfile] = useState<Profile>({
    name: "",
    interests: [],
    lookingFor: [],
    project: "",
  });

  const toggle = (key: "interests" | "lookingFor", v: string) =>
    setProfile((p) => ({
      ...p,
      [key]: p[key].includes(v) ? p[key].filter((x) => x !== v) : [...p[key], v],
    }));

  const canAdvance =
    (step === 0 && profile.name.trim().length > 1) ||
    (step === 1 && profile.interests.length > 0) ||
    (step === 2 && profile.lookingFor.length > 0) ||
    (step === 3 && profile.project.trim().length > 2);

  const next = () => {
    if (!canAdvance) return;
    if (step === 3) {
      completeOnboarding({ ...profile, name: profile.name.trim() });
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

  return (
    <div className="relative flex min-h-dvh flex-col px-6 pt-10 pb-12 sm:px-10">
      <div className="mx-auto flex w-full max-w-3xl items-center gap-2">
        {questions.map((_, i) => (
          <motion.div
            key={i}
            className="h-px flex-1 origin-left bg-border"
            animate={{
              backgroundColor:
                i <= step ? "var(--primary)" : "color-mix(in oklab, white 10%, transparent)",
            }}
            transition={{ duration: 0.6, ease }}
          />
        ))}
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-1 items-center">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, y: dir * 24, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: dir * -24, filter: "blur(10px)" }}
            transition={{ duration: 0.65, ease }}
            className="w-full py-16"
          >
            <p className="eyebrow">Step {step + 1} of 4</p>
            <h2 className="display-lg mt-5 max-w-xl text-balance">{questions[step]}</h2>

            <div className="mt-12">
              {step === 0 && (
                <input
                  autoFocus
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && next()}
                  placeholder="Philip"
                  className="w-full max-w-xl border-b border-border-strong bg-transparent pb-4 text-3xl font-light tracking-[-0.02em] outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-primary sm:text-4xl"
                />
              )}

              {step === 1 && (
                <div className="flex max-w-2xl flex-wrap gap-3">
                  {INTEREST_OPTIONS.map((o, i) => (
                    <motion.div
                      key={o}
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.06 * i, duration: 0.5, ease }}
                    >
                      <Chip
                        label={o}
                        selected={profile.interests.includes(o)}
                        onClick={() => toggle("interests", o)}
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="flex max-w-2xl flex-wrap gap-3">
                  {LOOKING_FOR_OPTIONS.map((o, i) => (
                    <motion.div
                      key={o}
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.06 * i, duration: 0.5, ease }}
                    >
                      <Chip
                        label={o}
                        selected={profile.lookingFor.includes(o)}
                        onClick={() => toggle("lookingFor", o)}
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              {step === 3 && (
                <input
                  autoFocus
                  value={profile.project}
                  onChange={(e) => setProfile((p) => ({ ...p, project: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && next()}
                  placeholder="An AI notetaker for field researchers"
                  className="w-full max-w-2xl border-b border-border-strong bg-transparent pb-4 text-2xl font-light tracking-[-0.02em] outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-primary sm:text-3xl"
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mx-auto flex w-full max-w-3xl items-center justify-between">
        <button
          onClick={back}
          className="focus-ring rounded-full px-2 py-2 text-sm text-muted-foreground transition-opacity hover:text-foreground"
          style={{ opacity: step === 0 ? 0 : 1, pointerEvents: step === 0 ? "none" : "auto" }}
        >
          Back
        </button>
        <motion.div animate={{ opacity: canAdvance ? 1 : 0.3 }} transition={{ duration: 0.4 }}>
          <ActionButton variant="accent" onClick={next} disabled={!canAdvance}>
            {step === 3 ? "Create profile" : "Continue"}
          </ActionButton>
        </motion.div>
      </div>
    </div>
  );
}
