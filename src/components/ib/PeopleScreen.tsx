import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ATTENDEES, EVENT, type Person } from "@/data/attendees";
import { useStore } from "@/lib/store";
import { PersonSheet } from "./PersonSheet";

const ease = [0.22, 1, 0.36, 1] as const;

export function PeopleScreen() {
  const { joinedEvent } = useStore();
  const [selected, setSelected] = useState<Person | null>(null);

  if (!joinedEvent) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center px-6 pb-40 sm:px-10">
        <p className="eyebrow">People</p>
        <h2 className="display-lg mt-5 max-w-lg text-balance">
          The room is empty until you join an event.
        </h2>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 pt-24 pb-40 sm:px-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
      >
        <p className="eyebrow">In the room</p>
        <h2 className="display-lg mt-5">{EVENT.attendees} people.</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Twelve near you right now.
        </p>
      </motion.div>

      <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
        {ATTENDEES.map((person, i) => (
          <motion.button
            key={person.id}
            onClick={() => setSelected(person)}
            className="focus-ring group text-left"
            initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease, delay: 0.06 * i }}
          >
            <motion.div
              layoutId={`portrait-${person.id}`}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-surface ring-1 ring-white/5"
            >
              <img
                src={person.photo}
                alt={person.name}
                loading="lazy"
                className="size-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
              />
            </motion.div>
            <p className="mt-4 text-[0.95rem]">{person.name}</p>
            <p className="mt-1 text-[0.82rem] text-muted-foreground">{person.role}</p>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected && <PersonSheet person={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
