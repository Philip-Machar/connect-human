import { motion } from "motion/react";
import { ATTENDEES, EVENT } from "@/data/attendees";
import { useStore } from "@/lib/store";
import { ActionButton, Eyebrow, StaticChip } from "./primitives";

const ease = [0.22, 1, 0.36, 1] as const;

export function ProfileScreen() {
  const { profile, joinedEvent, met, reset } = useStore();
  const metPeople = ATTENDEES.filter((p) => met.includes(p.id));

  return (
    <div className="mx-auto w-full max-w-4xl px-6 pt-24 pb-40 sm:px-10">
      <motion.div
        className="glass-panel grain relative overflow-hidden p-8 sm:p-12"
        initial={{ opacity: 0, y: 18, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease }}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-24 size-80 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 16%, transparent), transparent)",
          }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <Eyebrow>Your profile</Eyebrow>
        <h2 className="display-lg mt-6">{profile.name}</h2>
        <p className="mt-4 text-sm text-muted-foreground">
          {joinedEvent ? `Attending ${EVENT.name}` : "Not at an event right now"}
        </p>
        {profile.note && (
          <p className="mt-8 max-w-lg border-l border-primary/40 pl-5 text-[1.05rem] leading-relaxed text-foreground/85 italic">
            “{profile.note}”
          </p>
        )}
      </motion.div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Block title="Things I enjoy" delay={0.16}>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((i) => (
              <StaticChip key={i} label={i} />
            ))}
          </div>
        </Block>

        <Block title="Hoping to meet" delay={0.22}>
          <div className="flex flex-wrap gap-2">
            {profile.meeting.map((i) => (
              <StaticChip key={i} label={i} />
            ))}
          </div>
        </Block>

        <Block title="Happy to talk about" delay={0.28}>
          <div className="flex flex-wrap gap-2">
            {profile.topics.map((i) => (
              <StaticChip key={i} label={i} tone="accent" />
            ))}
          </div>
        </Block>

        <Block title="People you've met" delay={0.34}>
          {metPeople.length ? (
            <div className="flex flex-wrap items-center gap-2">
              {metPeople.map((p) => (
                <motion.img
                  key={p.id}
                  src={p.photo}
                  alt={p.name}
                  whileHover={{ scale: 1.08 }}
                  className="size-10 rounded-full object-cover ring-1 ring-white/10"
                />
              ))}
              <span className="ml-2 text-[0.85rem] text-muted-foreground">
                {metPeople.length} so far
              </span>
            </div>
          ) : (
            <p className="text-[0.9rem] text-muted-foreground/70">
              Nobody yet. The room is waiting.
            </p>
          )}
        </Block>
      </div>

      <motion.div
        className="surface-panel mt-4 p-8"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease, delay: 0.4 }}
      >
        <Eyebrow>Visibility</Eyebrow>
        <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
          Your profile is only visible to people at events you have joined. It
          disappears when the event ends.
        </p>
        <div className="mt-8">
          <ActionButton variant="quiet" onClick={reset}>
            Sign out
          </ActionButton>
        </div>
      </motion.div>
    </div>
  );
}

function Block({
  title,
  children,
  delay,
}: {
  title: string;
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      className="surface-panel lift p-7"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease, delay }}
    >
      <p className="eyebrow">{title}</p>
      <div className="mt-5">{children}</div>
    </motion.div>
  );
}
