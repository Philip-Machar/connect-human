import { motion } from "motion/react";
import { useEffect } from "react";
import type { Person } from "@/data/attendees";
import { useStore } from "@/lib/store";
import { Assistant } from "./Assistant";
import { ConnectionThread } from "./ConnectionThread";
import { Eyebrow, StaticChip } from "./primitives";

const ease = [0.22, 1, 0.36, 1] as const;

/** Apple-Photos style expansion: the portrait morphs, the rest unfolds around it. */
export function PersonSheet({
  person,
  onClose,
}: {
  person: Person;
  onClose: () => void;
}) {
  const { markMet } = useStore();

  useEffect(() => {
    const t = window.setTimeout(() => markMet(person.id), 1200);
    return () => clearTimeout(t);
  }, [person.id, markMet]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      className="grain fixed inset-0 z-40 overflow-y-auto bg-background/92 backdrop-blur-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease }}
    >
      <div className="mx-auto w-full max-w-5xl px-6 pt-10 pb-40 sm:px-10">
        <div className="flex items-center justify-between">
          <motion.p
            className="font-mono text-[0.7rem] tracking-[0.2em] text-muted-foreground/60 uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {person.mood || "In the room"}
          </motion.p>
          <button
            onClick={onClose}
            className="focus-ring rounded-full border border-border-strong px-4 py-2 text-xs tracking-wide text-muted-foreground transition-colors hover:text-foreground"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,340px)_1fr]">
          <div className="lg:sticky lg:top-10 lg:self-start">
            <motion.div
              layoutId={`portrait-${person.id}`}
              transition={{ type: "spring", stiffness: 190, damping: 26 }}
              className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] bg-surface"
            >
              <img
                src={person.photo}
                alt={person.name}
                className="size-full object-cover"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/85 to-transparent" />
              <motion.div
                className="absolute inset-x-0 bottom-0 p-6"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.35 }}
              >
                <p className="text-[0.75rem] tracking-[0.18em] text-muted-foreground uppercase">
                  {person.joinedAgo}
                </p>
                <p className="mt-1.5 text-[0.95rem]">{person.availability}</p>
              </motion.div>
            </motion.div>

            <Reveal delay={0.22}>
              <div className="glass-panel mt-4 flex flex-wrap gap-x-6 gap-y-2 p-5">
                {person.socials.map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-[0.9rem] text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
                  >
                    {s.handle}
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="space-y-4">
            <Reveal delay={0.05}>
              <div className="glass-panel p-8 sm:p-10">
                <h2 className="display-lg">{person.name}</h2>
                <p className="mt-3 text-[0.98rem] text-muted-foreground">
                  {person.role} · {person.company} · {person.age}
                </p>
                {person.note && (
                  <p className="mt-8 max-w-lg border-l border-primary/40 pl-5 text-[1.05rem] leading-relaxed text-foreground/85 italic">
                    “{person.note}”
                  </p>
                )}
                <p className="mt-8 max-w-xl text-[1.02rem] leading-relaxed text-foreground/80">
                  {person.bio}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.14}>
              <Panel title="What connects you">
                <ConnectionThread person={person} />
              </Panel>
            </Reveal>

            <Reveal delay={0.2}>
              <Panel title="Currently building">
                <p className="text-[1.05rem]">{person.project}</p>
                <p className="mt-3 max-w-lg text-[0.94rem] leading-relaxed text-muted-foreground">
                  {person.projectBlurb}
                </p>
              </Panel>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2">
              <Reveal delay={0.26}>
                <Panel title="Interests">
                  <div className="flex flex-wrap gap-2">
                    {person.interests.map((i) => (
                      <StaticChip key={i} label={i} />
                    ))}
                  </div>
                </Panel>
              </Reveal>
              <Reveal delay={0.3}>
                <Panel title="Skills">
                  <div className="flex flex-wrap gap-2">
                    {person.skills.map((i) => (
                      <StaticChip key={i} label={i} />
                    ))}
                  </div>
                </Panel>
              </Reveal>
            </div>

            {person.topics?.length ? (
              <Reveal delay={0.34}>
                <Panel title="Happy to talk about">
                  <div className="flex flex-wrap gap-2">
                    {person.topics.map((i) => (
                      <StaticChip key={i} label={i} tone="accent" />
                    ))}
                  </div>
                </Panel>
              </Reveal>
            ) : null}

            <Reveal delay={0.38}>
              <Panel title="Looking for">
                <p className="text-[1rem]">{person.lookingFor.join(" · ")}</p>
              </Panel>
            </Reveal>

            <Reveal delay={0.44}>
              <Assistant person={person} />
            </Reveal>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="surface-panel lift p-8">
      <Eyebrow>{title}</Eyebrow>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.75, ease, delay: 0.1 + delay }}
    >
      {children}
    </motion.div>
  );
}
