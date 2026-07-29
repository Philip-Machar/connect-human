import { motion } from "motion/react";
import type { Person } from "@/data/attendees";
import { useStore } from "@/lib/store";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * The signature visual: a single thread that grows from you to them,
 * pausing at every thing you have in common.
 */
export function ConnectionThread({ person }: { person: Person }) {
  const { profile } = useStore();
  const you = profile.name.split(" ")[0] || "You";
  const nodes = [you, ...person.thread, person.firstName];

  return (
    <div className="relative pl-1">
      {nodes.map((node, i) => {
        const first = i === 0;
        const last = i === nodes.length - 1;
        const endpoint = first || last;
        return (
          <div key={node + i} className="relative flex items-start gap-5">
            <div className="relative flex w-4 flex-col items-center">
              <motion.span
                className="mt-2 block rounded-full"
                style={{
                  width: endpoint ? 9 : 6,
                  height: endpoint ? 9 : 6,
                  background: endpoint ? "var(--primary)" : "var(--faint)",
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.42, duration: 0.5, ease }}
              />
              {!last && (
                <motion.span
                  className="w-px flex-1 origin-top"
                  style={{
                    background:
                      "linear-gradient(180deg, color-mix(in oklab, var(--primary) 55%, transparent), color-mix(in oklab, white 12%, transparent))",
                    minHeight: 46,
                  }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.4 + i * 0.42, duration: 0.55, ease }}
                />
              )}
            </div>

            <motion.div
              className="pb-4"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.34 + i * 0.42, duration: 0.6, ease }}
            >
              <p
                className={
                  endpoint
                    ? "text-[0.95rem] font-medium"
                    : "text-[0.95rem] text-muted-foreground"
                }
              >
                {node}
              </p>
              {!endpoint && (
                <p className="mt-0.5 text-[0.78rem] text-muted-foreground/60">
                  shared
                </p>
              )}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
