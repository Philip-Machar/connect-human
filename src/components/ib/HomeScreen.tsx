import { motion } from "motion/react";
import { ATTENDEES, EVENT } from "@/data/attendees";
import { greeting, useStore } from "@/lib/store";
import { ActionButton, Eyebrow } from "./primitives";

const ease = [0.22, 1, 0.36, 1] as const;

export function HomeScreen({
  onJoin,
  onCreate,
}: {
  onJoin: () => void;
  onCreate: () => void;
}) {
  const { profile, joinedEvent, met, setTab } = useStore();
  const first = profile.name.split(" ")[0] || "there";
  const metPeople = ATTENDEES.filter((p) => met.includes(p.id));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease }}
      className="grain relative mx-auto w-full max-w-4xl px-6 pt-28 pb-40 sm:px-10"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 size-[46vmax] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 8%, transparent), transparent)",
        }}
        animate={{ opacity: [0.45, 0.8, 0.45] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.h1
        className="display-xl relative max-w-2xl text-balance"
        initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1, ease, delay: 0.1 }}
      >
        {greeting()},
        <br />
        <span className="text-muted-foreground">{first}.</span>
      </motion.h1>

      <motion.div
        className="glass-panel relative mt-16 overflow-hidden p-8 sm:p-10"
        initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.95, ease, delay: 0.35 }}
      >
        {joinedEvent ? (
          <>
            <div className="flex items-center gap-3">
              <motion.span
                className="block size-1.5 rounded-full bg-primary"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <p className="eyebrow">Active event</p>
            </div>
            <h2 className="display-md mt-6 max-w-xl text-balance">{EVENT.name}</h2>
            <p className="num mt-4 text-sm text-muted-foreground">
              {EVENT.city} · {EVENT.attendees} attendees
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ActionButton variant="accent" onClick={() => setTab("discover")}>
                Discover People
              </ActionButton>
              <ActionButton onClick={onCreate}>Create Event</ActionButton>
            </div>
          </>
        ) : (
          <>
            <Eyebrow>No active event</Eyebrow>
            <h2 className="display-md mt-6 max-w-lg text-balance">
              Nothing happening yet.
              <span className="text-muted-foreground"> Scan a code at the door.</span>
            </h2>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <ActionButton variant="accent" onClick={onJoin} className="px-9">
                Join Event
              </ActionButton>
              <ActionButton variant="quiet" onClick={onCreate}>
                Create Event
              </ActionButton>
            </div>
          </>
        )}
      </motion.div>

      <motion.div
        className="surface-panel lift mt-4 p-8"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease, delay: 0.55 }}
      >
        <div className="flex items-baseline justify-between">
          <p className="eyebrow">People you've met</p>
          <p className="num font-mono text-[0.75rem] text-muted-foreground/60">
            {String(metPeople.length).padStart(2, "0")}
          </p>
        </div>

        {metPeople.length ? (
          <div className="mt-7 divide-y divide-border">
            {metPeople.slice(0, 4).map((p, i) => (
              <motion.button
                key={p.id}
                onClick={() => setTab("people")}
                className="focus-ring flex w-full items-center gap-4 py-4 text-left"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.65 + i * 0.08 }}
                whileHover={{ x: 3 }}
              >
                <img
                  src={p.photo}
                  alt=""
                  loading="lazy"
                  className="size-10 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.94rem]">{p.name}</p>
                  <p className="truncate text-[0.8rem] text-muted-foreground">
                    {p.role} · {p.company}
                  </p>
                </div>
                <span className="text-[0.72rem] text-muted-foreground/50">
                  {p.thread[0]}
                </span>
              </motion.button>
            ))}
          </div>
        ) : (
          <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-muted-foreground/75">
            Nobody yet. Open someone's profile and they'll quietly show up here.
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
