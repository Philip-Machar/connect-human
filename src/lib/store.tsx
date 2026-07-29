import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Tab = "home" | "discover" | "people" | "organizer" | "profile";
export type Stage = "landing" | "onboarding" | "app";

export type Profile = {
  name: string;
  interests: string[];
  lookingFor: string[];
  project: string;
};

export type CreatedEvent = {
  name: string;
  venue: string;
  date: string;
  start: string;
  end: string;
};

type State = {
  stage: Stage;
  tab: Tab;
  profile: Profile;
  joinedEvent: boolean;
  createdEvent: CreatedEvent | null;
};

const EMPTY: State = {
  stage: "landing",
  tab: "home",
  profile: { name: "", interests: [], lookingFor: [], project: "" },
  joinedEvent: false,
  createdEvent: null,
};

const KEY = "icebreaker.state.v1";

type Ctx = State & {
  ready: boolean;
  signIn: () => void;
  completeOnboarding: (p: Profile) => void;
  setTab: (t: Tab) => void;
  joinEvent: () => void;
  setCreatedEvent: (e: CreatedEvent) => void;
  reset: () => void;
};

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setState({ ...EMPTY, ...(JSON.parse(raw) as State) });
    } catch {
      /* first run */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state, ready]);

  const signIn = useCallback(
    () =>
      setState((s) => ({
        ...s,
        stage: s.profile.name ? "app" : "onboarding",
      })),
    [],
  );

  const completeOnboarding = useCallback(
    (profile: Profile) =>
      setState((s) => ({ ...s, profile, stage: "app", tab: "home" })),
    [],
  );

  const setTab = useCallback((tab: Tab) => setState((s) => ({ ...s, tab })), []);
  const joinEvent = useCallback(
    () => setState((s) => ({ ...s, joinedEvent: true })),
    [],
  );
  const setCreatedEvent = useCallback(
    (createdEvent: CreatedEvent) => setState((s) => ({ ...s, createdEvent })),
    [],
  );
  const reset = useCallback(() => setState(EMPTY), []);

  const value = useMemo(
    () => ({
      ...state,
      ready,
      signIn,
      completeOnboarding,
      setTab,
      joinEvent,
      setCreatedEvent,
      reset,
    }),
    [state, ready, signIn, completeOnboarding, setTab, joinEvent, setCreatedEvent, reset],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export const spring = { type: "spring" as const, stiffness: 220, damping: 30, mass: 0.9 };
export const softSpring = {
  type: "spring" as const,
  stiffness: 140,
  damping: 24,
  mass: 1,
};
export const ease = [0.22, 1, 0.36, 1] as const;

export function greeting(d = new Date()) {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
