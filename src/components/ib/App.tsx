import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { BottomNav } from "./BottomNav";
import { CreateEvent } from "./CreateEvent";
import { Discover } from "./Discover";
import { HomeScreen } from "./HomeScreen";
import { Landing } from "./Landing";
import { Onboarding } from "./Onboarding";
import { Organizer } from "./Organizer";
import { PeopleScreen } from "./PeopleScreen";
import { ProfileScreen } from "./ProfileScreen";
import { Scanner } from "./Scanner";

const ease = [0.22, 1, 0.36, 1] as const;

export function App() {
  const { ready, stage, tab, joinEvent, setTab } = useStore();
  const [overlay, setOverlay] = useState<"none" | "scan" | "create">("none");

  if (!ready) return <div className="min-h-dvh bg-background" />;

  return (
    <div className="relative min-h-dvh">
      <AnimatePresence mode="wait">
        {stage === "landing" && (
          <motion.div key="landing" exit={{ opacity: 0, filter: "blur(14px)" }} transition={{ duration: 0.7, ease }}>
            <Landing />
          </motion.div>
        )}

        {stage === "onboarding" && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, filter: "blur(14px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(14px)" }}
            transition={{ duration: 0.8, ease }}
          >
            <Onboarding />
          </motion.div>
        )}

        {stage === "app" && (
          <motion.div
            key="app"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease }}
          >
            <AnimatePresence mode="wait">
              <motion.main
                key={tab}
                initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -6, filter: "blur(8px)" }}
                transition={{ duration: 0.5, ease }}
              >
                {tab === "home" && (
                  <HomeScreen
                    onJoin={() => setOverlay("scan")}
                    onCreate={() => setOverlay("create")}
                  />
                )}
                {tab === "discover" && <Discover />}
                {tab === "people" && <PeopleScreen />}
                {tab === "organizer" && <Organizer onCreate={() => setOverlay("create")} />}
                {tab === "profile" && <ProfileScreen />}
              </motion.main>
            </AnimatePresence>

            <BottomNav />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {overlay === "scan" && (
          <Scanner
            onClose={() => setOverlay("none")}
            onJoined={() => {
              joinEvent();
              setOverlay("none");
              setTab("discover");
            }}
          />
        )}
        {overlay === "create" && <CreateEvent onClose={() => setOverlay("none")} />}
      </AnimatePresence>
    </div>
  );
}
