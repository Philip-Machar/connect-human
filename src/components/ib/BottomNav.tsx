import { motion } from "motion/react";
import { Compass, Home, LayoutGrid, User, Users } from "lucide-react";
import { useStore, type Tab } from "@/lib/store";
import { cn } from "@/lib/utils";

const items: { id: Tab; label: string; Icon: typeof Home }[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "discover", label: "Discover", Icon: Compass },
  { id: "people", label: "People", Icon: Users },
  { id: "organizer", label: "Organizer", Icon: LayoutGrid },
  { id: "profile", label: "Profile", Icon: User },
];

export function BottomNav() {
  const { tab, setTab } = useStore();

  return (
    <motion.nav
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
      className="fixed inset-x-0 bottom-6 z-30 flex justify-center px-6"
    >
      <div className="flex items-center gap-1 rounded-full border border-border bg-surface/80 p-1.5 backdrop-blur-xl">
        {items.map(({ id, label, Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className="focus-ring relative grid size-12 place-items-center rounded-full"
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-white/[0.07]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <Icon
                strokeWidth={1.5}
                className={cn(
                  "relative size-[19px] transition-colors duration-300",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              />
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
}
