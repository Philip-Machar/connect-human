import { motion } from "motion/react";
import type { Person } from "@/data/attendees";
import { Assistant } from "./Assistant";
import { ConnectionThread } from "./ConnectionThread";
import { StaticChip } from "./primitives";

const ease = [0.22, 1, 0.36, 1] as const;

/** Apple-Photos style expansion: the portrait morphs, the rest unfolds around it. */
export function PersonSheet({
  person,
  onClose,
}: {
  person: Person;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-40 overflow-y-auto bg-background/92 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease }}
    >
      <div className="mx-auto w-full max-w-5xl px-6 pt-10 pb-40 sm:px-10">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="focus-ring rounded-full border border-border-strong px-4 py-2 text-xs tracking-wide text-muted-foreground transition-colors hover:text-foreground"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-12 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-16">
          <div>
            <motion.div
              layoutId={`portrait-${person.id}`}
              transition={{ type: "spring", stiffness: 190, damping: 26 }}
              className="aspect-[4/5] w-full overflow-hidden rounded-3xl bg-surface"
            >
              <img
                src={person.photo}
                alt={person.name}
                className="size-full object-cover"
              />
            </motion.div>

            <Reveal delay={0.15}>
              <div className="mt-8">
                <p className="eyebrow">Availability</p>
                <p className="mt-2 text-[0.95rem]">{person.availability}</p>
              </div>
            </Reveal>

            <Reveal delay={0.22}>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
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

          <div>
            <Reveal delay={0.05}>
              <h2 className="display-lg">{person.name}</h2>
              <p className="mt-3 text-[0.98rem] text-muted-foreground">
                {person.role} · {person.company} · {person.age}
              </p>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-8 max-w-xl text-[1.05rem] leading-relaxed text-foreground/85">
                {person.bio}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <Section title="Currently building">
                <p className="text-[1rem]">{person.project}</p>
                <p className="mt-2 max-w-lg text-[0.92rem] leading-relaxed text-muted-foreground">
                  {person.projectBlurb}
                </p>
              </Section>
            </Reveal>

            <div className="mt-12 grid gap-10 sm:grid-cols-2">
              <Reveal delay={0.24}>
                <Section title="Interests">
                  <div className="flex flex-wrap gap-2">
                    {person.interests.map((i) => (
                      <StaticChip key={i} label={i} />
                    ))}
                  </div>
                </Section>
              </Reveal>
              <Reveal delay={0.28}>
                <Section title="Skills">
                  <div className="flex flex-wrap gap-2">
                    {person.skills.map((i) => (
                      <StaticChip key={i} label={i} />
                    ))}
                  </div>
                </Section>
              </Reveal>
            </div>

            <Reveal delay={0.32}>
              <Section title="Looking for">
                <p className="text-[1rem]">{person.lookingFor.join(" · ")}</p>
              </Section>
            </Reveal>

            <Reveal delay={0.38}>
              <Section title="What connects you">
                <div className="mt-2">
                  <ConnectionThread person={person} />
                </div>
              </Section>
            </Reveal>

            <Reveal delay={0.44}>
              <div className="mt-12 max-w-xl">
                <Assistant person={person} />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-14">
      <p className="eyebrow">{title}</p>
      <div className="mt-4">{children}</div>
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
