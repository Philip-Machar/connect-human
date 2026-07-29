import { motion } from "motion/react";
import { EVENT } from "@/data/attendees";
import { useStore } from "@/lib/store";
import { ActionButton, StaticChip } from "./primitives";

const ease = [0.22, 1, 0.36, 1] as const;

export function ProfileScreen() {
  const { profile, joinedEvent, reset } = useStore();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 pt-24 pb-40 sm:px-10">
      <motion.div
        initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease }}
      >
        <p className="eyebrow">Your profile</p>
        <h2 className="display-lg mt-6">{profile.name}</h2>
        <p className="mt-4 text-sm text-muted-foreground">
          {joinedEvent ? `Attending ${EVENT.name}` : "Not at an event right now"}
        </p>
      </motion.div>

      <Block title="Current project" delay={0.15}>
        <p className="text-[1.05rem] leading-relaxed">{profile.project}</p>
      </Block>

      <Block title="Interests" delay={0.22}>
        <div className="flex flex-wrap gap-2">
          {profile.interests.map((i) => (
            <StaticChip key={i} label={i} />
          ))}
        </div>
      </Block>

      <Block title="Looking for" delay={0.28}>
        <p className="text-[1rem]">{profile.lookingFor.join(" · ")}</p>
      </Block>

      <Block title="Visibility" delay={0.34}>
        <p className="max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
          Your profile is only visible to people at events you have joined. It
          disappears when the event ends.
        </p>
        <div className="mt-8">
          <ActionButton variant="ghost" onClick={reset}>
            Sign out
          </ActionButton>
        </div>
      </Block>
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
      className="mt-16"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease, delay }}
    >
      <p className="eyebrow">{title}</p>
      <div className="mt-4">{children}</div>
    </motion.div>
  );
}
