export type Person = {
  id: string;
  name: string;
  firstName: string;
  role: string;
  company: string;
  age: number;
  bio: string;
  project: string;
  projectBlurb: string;
  interests: string[];
  skills: string[];
  lookingFor: string[];
  availability: string;
  photo: string;
  socials: { label: string; handle: string }[];
  joinedAgo: string;
  /** Reasons this person is a good match, written like a person would say it. */
  why: string[];
  /** Ordered nodes for the connection thread: user -> ...nodes... -> person */
  thread: string[];
  /** What they'd enjoy talking about today. */
  topics?: string[];
  /** A one-line note they left before saying hello. */
  note?: string;
  /** Optional current mood. */
  mood?: string;
  /** Openers the assistant can suggest. */
  starters?: string[];
};

const p = (g: "men" | "women", n: number) =>
  `https://randomuser.me/api/portraits/${g}/${n}.jpg`;


export const ATTENDEES: Person[] = [
  {
    id: "sarah",
    name: "Sarah Wanjiru",
    firstName: "Sarah",
    role: "ML Engineer",
    company: "Kera Labs",
    age: 27,
    bio: "Builds small models that teach. Spent three years on speech systems for Swahili before deciding tutoring was the more interesting problem.",
    project: "Msomi — an AI tutor for Form 3 maths",
    projectBlurb:
      "A tutor that works offline on cheap Android phones. Currently used by 400 students in Kiambu.",
    interests: ["AI", "Anime", "Basketball", "Reading"],
    skills: ["PyTorch", "Python", "Speech Models", "Evals"],
    lookingFor: ["Co-founder", "Frontend engineer"],
    availability: "Free after the 2pm keynote",
    photo: p("women", 44),
    socials: [
      { label: "X", handle: "@sarahwanj" },
      { label: "GitHub", handle: "swanjiru" },
      { label: "Site", handle: "msomi.ai" },
    ],
    joinedAgo: "12m ago",
    why: [
      "You both build AI.",
      "You both enjoy Anime.",
      "She is looking for a frontend engineer.",
    ],
    thread: ["AI", "Anime", "Basketball", "React"],
  },
  {
    id: "tobi",
    name: "Tobi Adeyemi",
    firstName: "Tobi",
    role: "Product Designer",
    company: "Independent",
    age: 31,
    bio: "Designs interfaces for things that already exist in the physical world. Formerly at a hardware startup in Lagos.",
    project: "A calmer calendar for people who hate calendars",
    projectBlurb: "Six months in, no launch date, and completely fine with that.",
    interests: ["Design", "Photography", "Music", "Reading"],
    skills: ["Figma", "Motion", "Prototyping", "Design Systems"],
    lookingFor: ["Friends", "Co-founder"],
    availability: "Around all day",
    photo: p("men", 32),
    socials: [
      { label: "X", handle: "@tobidesigns" },
      { label: "Site", handle: "tobi.works" },
    ],
    joinedAgo: "28m ago",
    why: [
      "You both care about design.",
      "He is here looking for a technical co-founder.",
    ],
    thread: ["Design", "Motion", "Photography"],
  },
  {
    id: "amara",
    name: "Amara Okoye",
    firstName: "Amara",
    role: "Backend Engineer",
    company: "Paystack",
    age: 24,
    bio: "Payments infrastructure by day. Writes a small newsletter about distributed systems that 900 people read.",
    project: "A ledger library for African fintechs",
    projectBlurb: "Open source, double-entry, boring on purpose.",
    interests: ["Programming", "Reading", "Music"],
    skills: ["Go", "Postgres", "Distributed Systems", "APIs"],
    lookingFor: ["Networking", "Mentor"],
    availability: "Free 4–6pm",
    photo: p("women", 68),
    socials: [
      { label: "GitHub", handle: "amaraok" },
      { label: "X", handle: "@amara_writes" },
    ],
    joinedAgo: "1h ago",
    why: ["You both ship backend systems.", "You both read constantly."],
    thread: ["Programming", "Postgres", "Reading"],
  },
  {
    id: "kelvin",
    name: "Kelvin Mutiso",
    firstName: "Kelvin",
    role: "Frontend Engineer",
    company: "Andela",
    age: 22,
    bio: "Third hackathon this year. Obsessed with getting scroll to feel right.",
    project: "A gesture library for React",
    projectBlurb: "Springs, inertia, and far too many rewrites.",
    interests: ["Programming", "Gaming", "Anime", "Basketball"],
    skills: ["React", "TypeScript", "Animation", "WebGL"],
    lookingFor: ["Friends", "Networking"],
    availability: "Here until midnight",
    photo: p("men", 75),
    socials: [
      { label: "GitHub", handle: "kelvinm" },
      { label: "X", handle: "@kelvinbuilds" },
    ],
    joinedAgo: "2h ago",
    why: [
      "You both live in React.",
      "You both watch the same shows.",
      "He plays basketball on Saturdays.",
    ],
    thread: ["React", "Anime", "Basketball"],
  },
  {
    id: "nadia",
    name: "Nadia Haddad",
    firstName: "Nadia",
    role: "Research Scientist",
    company: "University of Nairobi",
    age: 35,
    bio: "Studies how people actually use machine translation, not how we assume they do.",
    project: "A corpus of code-switched Sheng",
    projectBlurb: "40,000 annotated sentences, collected in matatus and markets.",
    interests: ["AI", "Reading", "Photography"],
    skills: ["NLP", "Research", "Statistics", "Python"],
    lookingFor: ["Mentor", "Networking"],
    availability: "Free after lunch",
    photo: p("women", 90),
    socials: [{ label: "Site", handle: "nadiahaddad.org" }],
    joinedAgo: "3h ago",
    why: ["You both build AI.", "She mentors first-time founders."],
    thread: ["AI", "Python", "Reading"],
  },
  {
    id: "david",
    name: "David Kimani",
    firstName: "David",
    role: "Founder",
    company: "Shamba",
    age: 41,
    bio: "Second-time founder. Sold a logistics company in 2021. Now spends most weekends on a farm in Nyeri.",
    project: "Crop insurance priced from satellite imagery",
    projectBlurb: "Live in three counties. Slowly, then all at once.",
    interests: ["Reading", "Photography", "Music"],
    skills: ["Fundraising", "Operations", "GIS", "Sales"],
    lookingFor: ["Mentor", "Networking"],
    availability: "Free 5pm onwards",
    photo: p("men", 46),
    socials: [{ label: "X", handle: "@dkimani" }],
    joinedAgo: "4h ago",
    why: ["He has mentored six first-time founders.", "You both shoot film."],
    thread: ["Photography", "Fundraising"],
  },
  {
    id: "leila",
    name: "Leila Farah",
    firstName: "Leila",
    role: "Data Analyst",
    company: "Twiga Foods",
    age: 26,
    bio: "Turns messy supply-chain data into decisions people actually make.",
    project: "A demand forecast for perishable produce",
    projectBlurb: "Reduced spoilage by 11% in the pilot.",
    interests: ["Programming", "Music", "Gaming"],
    skills: ["SQL", "Python", "Forecasting", "dbt"],
    lookingFor: ["Friends", "Networking"],
    availability: "Around after 3pm",
    photo: p("women", 33),
    socials: [{ label: "GitHub", handle: "leilaf" }],
    joinedAgo: "5h ago",
    why: ["You both write Python daily.", "You are both here for the people."],
    thread: ["Programming", "Python", "Music"],
  },
  {
    id: "brian",
    name: "Brian Otieno",
    firstName: "Brian",
    role: "Photographer",
    company: "Freelance",
    age: 29,
    bio: "Documents the tech scene across East Africa. Shooting this hackathon.",
    project: "A photo essay on Nairobi's night workers",
    projectBlurb: "Two years in. Publishing next spring.",
    interests: ["Photography", "Music", "Reading"],
    skills: ["Portraiture", "Editing", "Storytelling"],
    lookingFor: ["Friends", "Networking"],
    availability: "Roaming the venue",
    photo: p("men", 12),
    socials: [{ label: "Site", handle: "brianotieno.photo" }],
    joinedAgo: "5h ago",
    why: ["You both shoot.", "He is photographing everyone here for free."],
    thread: ["Photography", "Music"],
  },
  {
    id: "grace",
    name: "Grace Mwende",
    firstName: "Grace",
    role: "Mobile Engineer",
    company: "M-KOPA",
    age: 33,
    bio: "Android since Gingerbread. Cares about apps that work on 2G.",
    project: "Offline-first sync for low-connectivity apps",
    projectBlurb: "A Kotlin library, extracted from three years of pain.",
    interests: ["Programming", "Basketball", "Gaming"],
    skills: ["Kotlin", "Android", "Offline Sync"],
    lookingFor: ["Networking", "Co-founder"],
    availability: "Free 1–3pm",
    photo: p("women", 21),
    socials: [{ label: "GitHub", handle: "gmwende" }],
    joinedAgo: "6h ago",
    why: ["You both play basketball.", "You both ship product, not demos."],
    thread: ["Basketball", "Programming"],
  },
  {
    id: "yusuf",
    name: "Yusuf Rahman",
    firstName: "Yusuf",
    role: "Student",
    company: "JKUAT",
    age: 19,
    bio: "Fourth-year CS. First hackathon. Nervous, which is the right amount.",
    project: "A study-group matcher for campus",
    projectBlurb: "600 students signed up in the first week.",
    interests: ["Programming", "Anime", "Gaming", "Basketball"],
    skills: ["JavaScript", "React", "Firebase"],
    lookingFor: ["Mentor", "Friends"],
    availability: "Here all weekend",
    photo: p("men", 62),
    socials: [{ label: "GitHub", handle: "yusufr" }],
    joinedAgo: "7h ago",
    why: ["You both watch Attack on Titan.", "He is looking for a mentor."],
    thread: ["Anime", "React", "Gaming"],
  },
  {
    id: "chioma",
    name: "Chioma Eze",
    firstName: "Chioma",
    role: "Growth Lead",
    company: "Flutterwave",
    age: 30,
    bio: "Spent five years learning that distribution beats everything.",
    project: "A referral engine for merchant onboarding",
    projectBlurb: "Quietly responsible for a third of last quarter's signups.",
    interests: ["Music", "Reading", "Design"],
    skills: ["Growth", "Analytics", "Copywriting"],
    lookingFor: ["Co-founder", "Networking"],
    availability: "Free 6pm onwards",
    photo: p("women", 57),
    socials: [{ label: "X", handle: "@chiomaeze" }],
    joinedAgo: "8h ago",
    why: ["She finds users for products like yours.", "You both love the same records."],
    thread: ["Design", "Growth", "Music"],
  },
  {
    id: "samuel",
    name: "Samuel Njoroge",
    firstName: "Samuel",
    role: "DevOps Engineer",
    company: "Safaricom",
    age: 38,
    bio: "Keeps large boring things running. Believes that is the highest form of engineering.",
    project: "A cost-aware Kubernetes autoscaler",
    projectBlurb: "Saved a seven-figure cloud bill. Nobody noticed. Perfect.",
    interests: ["Programming", "Reading", "Basketball"],
    skills: ["Kubernetes", "Terraform", "Observability"],
    lookingFor: ["Mentor", "Networking"],
    availability: "Free after 7pm",
    photo: p("men", 83),
    socials: [{ label: "GitHub", handle: "snjoroge" }],
    joinedAgo: "9h ago",
    why: ["He has run infrastructure at scale for a decade.", "You both hoop."],
    thread: ["Programming", "Basketball"],
  },
];

const ENRICH: Record<
  string,
  { topics: string[]; note: string; mood: string; starters: string[] }
> = {
  sarah: {
    topics: ["AI", "Anime", "Startups", "Teaching"],
    note: "Ask me about Attack on Titan. Or offline evals. Both work.",
    mood: "Caffeinated and optimistic",
    starters: [
      "Ask Sarah what inspired Msomi, her AI tutor project.",
      "You both mentioned Attack on Titan.",
      "That might be the easiest way to start the conversation.",
    ],
  },
  tobi: {
    topics: ["Design", "Photography", "Music", "Hardware"],
    note: "I will absolutely talk about calendars for far too long.",
    mood: "Quietly curious",
    starters: [
      "Ask Tobi why he thinks calendars are broken.",
      "You both care deeply about how software feels.",
      "Design taste is the fastest way into a real conversation.",
    ],
  },
  amara: {
    topics: ["Programming", "Books", "Fintech"],
    note: "Always looking for book recommendations.",
    mood: "Between deploys",
    starters: [
      "Ask Amara about the ledger library she open sourced.",
      "You both read constantly.",
      "Trade a book recommendation before you trade advice.",
    ],
  },
  kelvin: {
    topics: ["AI", "Gaming", "Anime", "Animation"],
    note: "I will show you a spring curve I am unreasonably proud of.",
    mood: "Third coffee",
    starters: [
      "Ask Kelvin about the gesture library he is rewriting again.",
      "You both watch the same shows.",
      "Start with anime, end up talking about motion design.",
    ],
  },
  nadia: {
    topics: ["AI", "Research", "Languages"],
    note: "Trying to learn Japanese. Slowly.",
    mood: "Thinking out loud",
    starters: [
      "Ask Nadia how she collected 40,000 Sheng sentences.",
      "You both build with AI, from different ends.",
      "She mentors first-time founders, so ask directly.",
    ],
  },
  david: {
    topics: ["Business", "Photography", "Farming"],
    note: "I am new in town on weekdays, a farmer on weekends.",
    mood: "Open to long conversations",
    starters: [
      "Ask David what he learned selling his first company.",
      "You both shoot film.",
      "Cameras are a softer opening than fundraising.",
    ],
  },
  leila: {
    topics: ["Programming", "Music", "Food"],
    note: "Ask me about the best lunch spot within walking distance.",
    mood: "Here for the people",
    starters: [
      "Ask Leila how she cut spoilage by eleven percent.",
      "You both write Python daily.",
      "She is here for the people, not the pitch.",
    ],
  },
  brian: {
    topics: ["Photography", "Music", "Travel"],
    note: "I will take your portrait for free. Just ask.",
    mood: "Roaming with a camera",
    starters: [
      "Ask Brian about the night workers photo essay.",
      "You both shoot.",
      "Ask him to take your portrait. He will say yes.",
    ],
  },
  grace: {
    topics: ["Programming", "Basketball", "Mobile"],
    note: "Ask me about making apps work on 2G.",
    mood: "Focused",
    starters: [
      "Ask Grace what offline-first actually costs to build.",
      "You both play basketball.",
      "Ship talk first, hoops talk after.",
    ],
  },
  yusuf: {
    topics: ["AI", "Anime", "Gaming", "Startups"],
    note: "First hackathon. Please say hello first.",
    mood: "Nervous, in a good way",
    starters: [
      "Ask Yusuf about the study-group matcher he launched on campus.",
      "You both watch Attack on Titan.",
      "He is looking for a mentor. You could just offer.",
    ],
  },
  chioma: {
    topics: ["Business", "Music", "Design"],
    note: "Ask me why distribution beats product. I have slides.",
    mood: "Ready to talk shop",
    starters: [
      "Ask Chioma how the referral engine actually spread.",
      "You both love the same records.",
      "Music first, growth tactics second.",
    ],
  },
  samuel: {
    topics: ["Programming", "Books", "Football"],
    note: "Love discussing philosophy at 2am. Or Kubernetes.",
    mood: "Calm as always",
    starters: [
      "Ask Samuel about the cloud bill nobody noticed him saving.",
      "You both hoop.",
      "He runs infrastructure at scale. Ask what breaks first.",
    ],
  },
};

for (const person of ATTENDEES) {
  const e = ENRICH[person.id];
  if (!e) continue;
  person.topics = e.topics;
  person.note = e.note;
  person.mood = e.mood;
  person.starters = e.starters;
}

export const TOP_MATCH = ATTENDEES[0];

export const EVENT = {
  name: "Africa's Talking Matchmakers Hackathon",
  city: "Nairobi",
  venue: "Ihub, Senteu Plaza",
  attendees: 175,
  conversations: 64,
  teams: 21,
  code: "MTCH-2049",
  link: "icebrkr.co/e/mtch-2049",
  date: "Sat, 8 Aug",
  time: "09:00 \u2014 21:00",
};

export const TOP_INTERESTS: { label: string; count: number }[] = [
  { label: "Programming", count: 128 },
  { label: "AI", count: 96 },
  { label: "Design", count: 54 },
  { label: "Music", count: 47 },
  { label: "Basketball", count: 39 },
  { label: "Anime", count: 31 },
];

export const TOP_SKILLS: { label: string; count: number }[] = [
  { label: "React", count: 88 },
  { label: "Python", count: 71 },
  { label: "Figma", count: 44 },
  { label: "Go", count: 29 },
  { label: "Kotlin", count: 18 },
];

export const INTEREST_OPTIONS = [
  "Programming",
  "Basketball",
  "Anime",
  "Photography",
  "Reading",
  "Gaming",
  "Fitness",
  "Travel",
  "Music",
  "Cooking",
  "Art",
  "Faith",
  "Movies",
  "Books",
  "Design",
  "Entrepreneurship",
];

export const MEETING_OPTIONS = [
  "Friends",
  "Professionals",
  "Mentors",
  "Founders",
  "Artists",
  "Gamers",
  "Church Community",
  "Students",
  "Dates",
  "Networking",
  "Study Partners",
  "Collaborators",
];

export const TOPIC_OPTIONS = [
  "AI",
  "Football",
  "Travel",
  "Business",
  "Music",
  "Photography",
  "Movies",
  "Books",
  "Startups",
  "Faith",
  "Food",
  "Fitness",
];

export const NOTE_PLACEHOLDERS = [
  "Ask me about Formula One.",
  "I\u2019m new in town.",
  "Always looking for book recommendations.",
  "Trying to learn Japanese.",
  "Love discussing philosophy.",
];

/** Kept for backwards compatibility with older screens. */
export const LOOKING_FOR_OPTIONS = MEETING_OPTIONS;
