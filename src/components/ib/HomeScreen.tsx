import { motion } from "motion/react";
import { EVENT } from "@/data/attendees";
import { greeting, useStore } from "@/lib/store";
import { ActionButton } from "./primitives";

const ease = [0.22, 1, 0.36, 1] as const;

export function HomeScreen({
  onJoin,
  onCreate,
}: {
  onJoin: () => void;
  onCreate: () => void;
}) {
  const { profile, joinedEvent, setTab } = useStore();
  const first = profile.name.split(" ")[0] || "there";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease }}
      className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col justify-center px-6 pt-24 pb-40 sm:px-10"
    >
      <motion.h1
        className="display-xl max-w-2xl text-balance"
        initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1, ease, delay: 0.1 }}
      >
        {greeting()},
        <br />
        <span className="text-muted-foreground">{first}.</span>
      </motion.h1>

      <motion.div
        className="mt-28"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease, delay: 0.45 }}
      >
        {joinedEvent ? (
          <>
            <p className="eyebrow">Active event</p>
            <h2 className="display-md mt-4 max-w-xl text-balance">{EVENT.name}</h2>
            <p className="mt-3 text-sm text-muted-foreground">
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
            <p className="eyebrow">No active event</p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <ActionButton variant="accent" onClick={onJoin} className="px-9">
                Join Event
              </ActionButton>
              <ActionButton variant="ghost" onClick={onCreate}>
                Create Event
              </ActionButton>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
