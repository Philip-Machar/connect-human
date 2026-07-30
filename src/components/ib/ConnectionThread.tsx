import { motion } from "motion/react";
import type { Person } from "@/data/attendees";
import { useStore } from "@/lib/store";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * The signature interaction: shared things surface in the middle and
 * thread themselves between the two of you, one at a time.
 */
export function ConnectionThread({ person }: { person: Person }) {
  const { profile } = useStore();
  const you = profile.name.split(" ")[0] || "You";
  const nodes = person.thread.slice(0, 4);
  const n = nodes.length;

  const yFor = (i: number) => ((i + 0.5) / n) * 100;
  const height = Math.max(200, n * 64);

  return (
    <div className="relative w-full" style={{ height }}>
      {/* the threads */}
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="thread-a" x1="0" x2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.05" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="thread-b" x1="0" x2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        {nodes.map((node, i) => (
          <g key={node}>
            <motion.path
              d={`M 6 50 C 22 50, 24 ${yFor(i)}, 38 ${yFor(i)}`}
              fill="none"
              stroke="url(#thread-a)"
              strokeWidth="0.35"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.35 + i * 0.45, duration: 0.9, ease }}
            />
            <motion.path
              d={`M 62 ${yFor(i)} C 76 ${yFor(i)}, 78 50, 94 50`}
              fill="none"
              stroke="url(#thread-b)"
              strokeWidth="0.35"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.62 + i * 0.45, duration: 0.9, ease }}
            />
          </g>
        ))}
      </svg>

      {/* you */}
      <Endpoint side="left" label={you} />

      {/* them */}
      <Endpoint side="right" label={person.firstName} photo={person.photo} />

      {/* shared things */}
      <div className="absolute inset-y-0 left-1/2 flex w-[38%] max-w-[240px] -translate-x-1/2 flex-col justify-around">
        {nodes.map((node, i) => (
          <motion.div
            key={node}
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.5 + i * 0.45, duration: 0.7, ease }}
          >
            <span className="rounded-full border border-primary/40 bg-primary/[0.12] px-4 py-1.5 text-[0.8rem] whitespace-nowrap text-primary backdrop-blur-md">
              {node}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Endpoint({
  side,
  label,
  photo,
}: {
  side: "left" | "right";
  label: string;
  photo?: string;
}) {
  return (
    <motion.div
      className={`absolute top-1/2 flex -translate-y-1/2 flex-col items-center gap-3 ${
        side === "left" ? "left-0" : "right-0"
      }`}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease, delay: side === "left" ? 0 : 0.15 }}
    >
      {photo ? (
        <img
          src={photo}
          alt=""
          className="size-12 rounded-full object-cover ring-1 ring-white/15"
        />
      ) : (
        <span className="grid size-12 place-items-center rounded-full border border-border-strong bg-white/[0.04] text-[0.85rem] font-medium">
          {label.slice(0, 1).toUpperCase()}
        </span>
      )}
      <span className="text-[0.75rem] text-muted-foreground">{label}</span>
    </motion.div>
  );
}
