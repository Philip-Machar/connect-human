import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { EVENT } from "@/data/attendees";
import { ActionButton } from "./primitives";

const ease = [0.22, 1, 0.36, 1] as const;

type Phase = "scanning" | "locked" | "verifying" | "found";

export function Scanner({
  onClose,
  onJoined,
}: {
  onClose: () => void;
  onJoined: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [phase, setPhase] = useState<Phase>("scanning");

  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          void videoRef.current.play();
        }
        setHasCamera(true);
      })
      .catch(() => setHasCamera(false));
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setPhase("locked"), 2800),
      window.setTimeout(() => setPhase("verifying"), 3900),
      window.setTimeout(() => setPhase("found"), 6100),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const scanning = phase === "scanning";

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(12px)" }}
      transition={{ duration: 0.6, ease }}
    >
      {/* Feed */}
      <motion.div
        className="absolute inset-0"
        animate={{
          scale: phase === "found" ? 1.06 : 1,
          opacity: phase === "found" ? 0.12 : 0.5,
          filter: phase === "found" ? "blur(18px)" : "blur(0px)",
        }}
        transition={{ duration: 1.2, ease }}
      >
        <video
          ref={videoRef}
          muted
          playsInline
          className="size-full object-cover"
          style={{ display: hasCamera ? "block" : "none" }}
        />
        {!hasCamera && <SimulatedFeed />}
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_18%,#090909_78%)]" />

      {/* Focus ring */}
      <div className="absolute inset-0 grid place-items-center">
        <AnimatePresence>
          {phase !== "found" && (
            <motion.div
              className="relative grid size-[min(74vmin,460px)] place-items-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                x: phase === "locked" ? [0, -3, 3, -2, 2, 0] : 0,
              }}
              exit={{ scale: 1.6, opacity: 0, filter: "blur(14px)" }}
              transition={{
                scale: { duration: 0.9, ease },
                opacity: { duration: 0.6 },
                x: { duration: 0.42 },
              }}
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="absolute rounded-full border border-white/15"
                  style={{ width: "100%", height: "100%" }}
                  animate={
                    scanning
                      ? { scale: [0.42, 1], opacity: [0.55, 0] }
                      : { scale: 0.99, opacity: 0 }
                  }
                  transition={
                    scanning
                      ? {
                          duration: 3.2,
                          repeat: Infinity,
                          delay: i * 1.05,
                          ease: "easeOut",
                        }
                      : { duration: 0.8, ease }
                  }
                />
              ))}

              <motion.span
                className="absolute rounded-full"
                style={{ width: "56%", height: "56%" }}
                animate={{
                  borderWidth: 1,
                  borderColor:
                    phase === "scanning"
                      ? "rgba(255,255,255,0.22)"
                      : "color-mix(in oklab, var(--primary) 90%, transparent)",
                  borderStyle: "solid",
                  scale: phase === "scanning" ? [1, 1.02, 1] : 0.94,
                  boxShadow:
                    phase === "scanning"
                      ? "0 0 0px 0px rgba(0,0,0,0)"
                      : "0 0 60px -10px color-mix(in oklab, var(--primary) 65%, transparent)",
                }}
                transition={{
                  scale:
                    phase === "scanning"
                      ? { duration: 3.4, repeat: Infinity, ease: "easeInOut" }
                      : { type: "spring", stiffness: 260, damping: 22 },
                  default: { duration: 0.6, ease },
                }}
              />

              {/* corner ticks */}
              {[
                [-1, -1],
                [1, -1],
                [-1, 1],
                [1, 1],
              ].map(([sx, sy], i) => (
                <motion.span
                  key={i}
                  className="absolute size-4 border-white/30"
                  style={{
                    left: sx < 0 ? "20%" : undefined,
                    right: sx > 0 ? "20%" : undefined,
                    top: sy < 0 ? "20%" : undefined,
                    bottom: sy > 0 ? "20%" : undefined,
                    borderLeftWidth: sx < 0 ? 1 : 0,
                    borderRightWidth: sx > 0 ? 1 : 0,
                    borderTopWidth: sy < 0 ? 1 : 0,
                    borderBottomWidth: sy > 0 ? 1 : 0,
                  }}
                  animate={{
                    opacity: phase === "scanning" ? 0.7 : 0,
                    scale: phase === "scanning" ? 1 : 0.8,
                  }}
                  transition={{ duration: 0.6, ease }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Copy */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-16">
        <AnimatePresence mode="wait">
          {phase === "scanning" && (
            <Line key="a">Point at the event code</Line>
          )}
          {phase === "locked" && (
            <Line key="b" accent>
              Code captured
            </Line>
          )}
          {phase === "verifying" && <Line key="c">Verifying Event…</Line>}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {phase === "found" && (
          <motion.div
            className="absolute inset-0 grid place-items-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease }}
          >
            <div className="w-full max-w-lg text-center">
              <motion.p
                className="eyebrow"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.7, ease }}
              >
                Event found
              </motion.p>
              <motion.h2
                className="display-lg mt-6 text-balance"
                initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.25, duration: 0.9, ease }}
              >
                {EVENT.name}
              </motion.h2>
              <motion.p
                className="mt-5 text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                {EVENT.city} · {EVENT.attendees} attendees
              </motion.p>
              <motion.div
                className="mt-12 flex justify-center"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8, ease }}
              >
                <ActionButton variant="accent" className="px-10" onClick={onJoined}>
                  Join Event
                </ActionButton>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={onClose}
        className="focus-ring absolute top-6 right-6 rounded-full border border-border-strong px-4 py-2 text-xs tracking-wide text-muted-foreground transition-colors hover:text-foreground"
      >
        Close
      </button>
    </motion.div>
  );
}

function Line({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
      transition={{ duration: 0.55, ease }}
      className={
        accent
          ? "text-sm tracking-[0.16em] text-primary uppercase"
          : "text-sm tracking-[0.16em] text-muted-foreground uppercase"
      }
    >
      {children}
    </motion.p>
  );
}

function SimulatedFeed() {
  return (
    <div className="relative size-full bg-[#0d0d0d]">
      <motion.div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(120deg, #151515 0%, #0b0b0b 40%, #1a1a1a 70%, #0a0a0a 100%)",
        }}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 18, repeat: Infinity, repeatType: "reverse" }}
      />
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 3px)",
        }}
      />
      <div className="absolute inset-0 grid place-items-center">
        <div className="size-40 rounded-lg bg-white/[0.06]" />
      </div>
    </div>
  );
}
