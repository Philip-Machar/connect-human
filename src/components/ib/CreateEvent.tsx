import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { EVENT } from "@/data/attendees";
import { useStore, type CreatedEvent } from "@/lib/store";
import { AnimatedQr } from "./QrCode";
import { ActionButton } from "./primitives";

const ease = [0.22, 1, 0.36, 1] as const;

const steps: { key: keyof CreatedEvent; label: string; placeholder: string }[] = [
  { key: "name", label: "Event name", placeholder: "Matchmakers Hackathon" },
  { key: "venue", label: "Venue", placeholder: "Ihub, Senteu Plaza" },
  { key: "date", label: "Date", placeholder: "Sat, 8 Aug" },
  { key: "start", label: "Start time", placeholder: "09:00" },
  { key: "end", label: "End time", placeholder: "21:00" },
];

export function CreateEvent({ onClose }: { onClose: () => void }) {
  const { setCreatedEvent } = useStore();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [draft, setDraft] = useState<CreatedEvent>({
    name: "",
    venue: "",
    date: "",
    start: "",
    end: "",
  });

  const current = steps[step];
  const value = done ? "" : draft[current.key];
  const canAdvance = value.trim().length > 0;

  const next = () => {
    if (!canAdvance) return;
    if (step === steps.length - 1) {
      setCreatedEvent(draft);
      setDone(true);
      return;
    }
    setStep((s) => s + 1);
  };

  const copy = (label: string, text: string) => {
    void navigator.clipboard?.writeText(text).catch(() => undefined);
    setCopied(label);
    window.setTimeout(() => setCopied(null), 1600);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-background px-6 pt-10 pb-14 sm:px-10"
      initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: 20, filter: "blur(10px)" }}
      transition={{ duration: 0.6, ease }}
    >
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between">
        <p className="eyebrow">{done ? "Event live" : "New event"}</p>
        <button
          onClick={onClose}
          className="focus-ring rounded-full px-3 py-1.5 text-xs tracking-wide text-muted-foreground hover:text-foreground"
        >
          Close
        </button>
      </div>

      {!done && (
        <div className="mx-auto mt-8 flex w-full max-w-3xl gap-2">
          {steps.map((_, i) => (
            <motion.div
              key={i}
              className="h-px flex-1"
              animate={{
                backgroundColor:
                  i <= step ? "var(--primary)" : "color-mix(in oklab, white 10%, transparent)",
              }}
              transition={{ duration: 0.6, ease }}
            />
          ))}
        </div>
      )}

      <div className="mx-auto flex w-full max-w-3xl flex-1 items-center overflow-y-auto">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -22, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease }}
              className="w-full py-14"
            >
              <p className="eyebrow">
                Step {step + 1} of {steps.length}
              </p>
              <h2 className="display-lg mt-5">{current.label}</h2>
              <input
                autoFocus
                value={draft[current.key]}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, [current.key]: e.target.value }))
                }
                onKeyDown={(e) => e.key === "Enter" && next()}
                placeholder={current.placeholder}
                className="mt-12 w-full max-w-2xl border-b border-border-strong bg-transparent pb-4 text-2xl font-light tracking-[-0.02em] outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-primary sm:text-3xl"
              />
            </motion.div>
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease }}
              className="w-full py-14"
            >
              <h2 className="display-lg max-w-xl text-balance">{draft.name}</h2>
              <p className="mt-4 text-sm text-muted-foreground">
                {draft.venue} · {draft.date} · {draft.start} — {draft.end}
              </p>

              <div className="mt-12 flex flex-col gap-12 sm:flex-row sm:items-end">
                <AnimatedQr value={draft.name + EVENT.code} size={220} />

                <div className="space-y-7">
                  <Field label="Event code" value={EVENT.code} mono />
                  <Field label="Invite link" value={EVENT.link} mono />
                </div>
              </div>

              <div className="mt-14 flex flex-wrap gap-3">
                <ActionButton variant="accent" onClick={() => copy("qr", EVENT.link)}>
                  {copied === "qr" ? "Saved" : "Download QR"}
                </ActionButton>
                <ActionButton onClick={() => copy("share", EVENT.link)}>
                  {copied === "share" ? "Shared" : "Share"}
                </ActionButton>
                <ActionButton variant="ghost" onClick={() => copy("link", EVENT.link)}>
                  {copied === "link" ? "Copied" : "Copy invite link"}
                </ActionButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!done && (
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="focus-ring rounded-full px-2 py-2 text-sm text-muted-foreground hover:text-foreground"
            style={{ opacity: step === 0 ? 0 : 1, pointerEvents: step === 0 ? "none" : "auto" }}
          >
            Back
          </button>
          <motion.div animate={{ opacity: canAdvance ? 1 : 0.3 }} transition={{ duration: 0.4 }}>
            <ActionButton variant="accent" onClick={next} disabled={!canAdvance}>
              {step === steps.length - 1 ? "Create event" : "Continue"}
            </ActionButton>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <p className={`mt-2 text-xl ${mono ? "font-mono tracking-tight" : ""}`}>{value}</p>
    </div>
  );
}
