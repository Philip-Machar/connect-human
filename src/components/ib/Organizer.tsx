import { motion } from "motion/react";
import { ATTENDEES, EVENT, TOP_INTERESTS, TOP_SKILLS } from "@/data/attendees";
import { useStore } from "@/lib/store";
import { QrCode } from "./QrCode";
import { ActionButton } from "./primitives";

const ease = [0.22, 1, 0.36, 1] as const;

export function Organizer({ onCreate }: { onCreate: () => void }) {
  const { createdEvent } = useStore();
  const name = createdEvent?.name || EVENT.name;

  return (
    <div className="mx-auto w-full max-w-5xl px-6 pt-24 pb-40 sm:px-10">
      <motion.div
        initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease }}
      >
        <div className="flex items-center gap-3">
          <motion.span
            className="block size-1.5 rounded-full bg-primary"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <p className="eyebrow">Live now</p>
        </div>
        <h2 className="display-lg mt-6 max-w-2xl text-balance">{name}</h2>
        <p className="mt-4 text-sm text-muted-foreground">
          {createdEvent?.venue || EVENT.venue} · {createdEvent?.date || EVENT.date}
        </p>
      </motion.div>

      <div className="mt-20 grid gap-x-10 gap-y-14 sm:grid-cols-3">
        {[
          { n: EVENT.attendees, l: "attendees" },
          { n: EVENT.conversations, l: "conversations started" },
          { n: EVENT.teams, l: "teams formed" },
        ].map((s, i) => (
          <motion.div
            key={s.l}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.2 + i * 0.12 }}
          >
            <p className="text-[clamp(2.5rem,5vw,3.75rem)] leading-none font-medium tracking-[-0.045em]">
              {s.n}
            </p>
            <p className="mt-3 text-[0.85rem] text-muted-foreground">{s.l}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-24 grid gap-16 lg:grid-cols-2">
        <Bars title="Top interests" data={TOP_INTERESTS} max={TOP_INTERESTS[0].count} />
        <Bars title="Top skills" data={TOP_SKILLS} max={TOP_SKILLS[0].count} />
      </div>

      <div className="mt-24 grid gap-16 lg:grid-cols-[auto_1fr]">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease, delay: 0.2 }}
        >
          <div className="w-fit rounded-2xl bg-white p-3">
            <QrCode value={EVENT.code} size={200} />
          </div>
          <p className="mt-5 font-mono text-sm text-muted-foreground">{EVENT.code}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ActionButton onClick={onCreate}>Create another event</ActionButton>
          </div>
        </motion.div>

        <div>
          <p className="eyebrow">Recent joins</p>
          <div className="mt-6 divide-y divide-border">
            {ATTENDEES.slice(0, 6).map((p, i) => (
              <motion.div
                key={p.id}
                className="flex items-center gap-4 py-4"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.3 + i * 0.08 }}
              >
                <img
                  src={p.photo}
                  alt=""
                  loading="lazy"
                  className="size-9 rounded-full object-cover grayscale"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.92rem]">{p.name}</p>
                  <p className="truncate text-[0.78rem] text-muted-foreground">
                    {p.role} · {p.company}
                  </p>
                </div>
                <p className="text-[0.75rem] text-muted-foreground/60">{p.joinedAgo}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Bars({
  title,
  data,
  max,
}: {
  title: string;
  data: { label: string; count: number }[];
  max: number;
}) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <div className="mt-7 space-y-5">
        {data.map((d, i) => (
          <div key={d.label}>
            <div className="flex items-baseline justify-between">
              <p className="text-[0.92rem]">{d.label}</p>
              <p className="font-mono text-[0.78rem] text-muted-foreground">{d.count}</p>
            </div>
            <div className="mt-2 h-px w-full bg-border">
              <motion.div
                className="h-px bg-foreground/45"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: d.count / max }}
                style={{ originX: 0 }}
                transition={{ duration: 1.1, ease, delay: 0.25 + i * 0.08 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
