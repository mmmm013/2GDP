/**
 * feelings.ts — Single source of truth for the top-20 shared emotions
 * and their Messenger option mappings used in the K-KUT 5-step wizard.
 *
 * Step 4 ("Choose Your Messenger") adapts its icon set to whatever
 * feeling cluster the user locked in during Step 1.
 */

export type Messenger = {
  id: string;
  label: string;
  emoji: string;
};

export type FeelingCluster = {
  id: string;
  label: string;
  emoji: string;
  /** Words / synonyms that match this cluster via the search input */
  keywords: string[];
  /** Accent color (RGB, no alpha) for tinting the active step card */
  color: string;
  /** Messenger options surfaced in Step 4 when this feeling is active */
  messengers: Messenger[];
};

export const FEELING_CLUSTERS: FeelingCluster[] = [
  {
    id: "sorry",
    label: "Sorry / Regret",
    emoji: "🕊️",
    keywords: ["sorry", "regret", "apologize", "apology", "guilt", "shame", "forgive"],
    color: "0,229,255",
    messengers: [
      { id: "apology",     label: "Apology",     emoji: "🙏" },
      { id: "comfort",     label: "Comfort",     emoji: "🤝" },
      { id: "forgiveness", label: "Forgiveness", emoji: "🕊️" },
      { id: "reconcile",   label: "Reconcile",   emoji: "🌿" },
    ],
  },
  {
    id: "hope",
    label: "Hope / Courage",
    emoji: "🌅",
    keywords: ["hope", "courage", "brave", "strength", "faith", "believe", "persevere", "resilience"],
    color: "255,180,50",
    messengers: [
      { id: "encourage", label: "Encourage", emoji: "💪" },
      { id: "lift-up",   label: "Lift-Up",   emoji: "🌅" },
      { id: "rally",     label: "Rally",     emoji: "🚀" },
      { id: "inspire",   label: "Inspire",   emoji: "✨" },
    ],
  },
  {
    id: "joy",
    label: "Joy / Elation",
    emoji: "🎉",
    keywords: ["joy", "happy", "elated", "elation", "excited", "celebrate", "jubilant", "thrilled"],
    color: "255,200,0",
    messengers: [
      { id: "celebrate", label: "Celebrate", emoji: "🎉" },
      { id: "cheer",     label: "Cheer",     emoji: "🥂" },
      { id: "hype",      label: "Hype",      emoji: "⚡" },
      { id: "toast",     label: "Toast",     emoji: "🍾" },
    ],
  },
  {
    id: "love",
    label: "Love / Romance",
    emoji: "❤️",
    keywords: ["love", "romance", "romantic", "crush", "adore", "devoted", "passion", "forever", "date"],
    color: "255,80,130",
    messengers: [
      { id: "crush",    label: "Crush",    emoji: "🥰" },
      { id: "date",     label: "Date",     emoji: "🌹" },
      { id: "forever",  label: "Forever",  emoji: "💍" },
      { id: "devotion", label: "Devotion", emoji: "❤️‍🔥" },
    ],
  },
  {
    id: "concern",
    label: "Concern / Care",
    emoji: "💙",
    keywords: ["concern", "care", "worried", "worry", "support", "protect", "check in"],
    color: "80,160,255",
    messengers: [
      { id: "check-in",  label: "Check-In",  emoji: "📞" },
      { id: "support",   label: "Support",   emoji: "💙" },
      { id: "stand-by",  label: "Stand-By",  emoji: "🛡️" },
      { id: "protect",   label: "Protect",   emoji: "🤗" },
    ],
  },
  {
    id: "grief",
    label: "Grief / Loss",
    emoji: "🖤",
    keywords: ["grief", "loss", "mourn", "mourning", "sad", "sympathy", "condolence", "miss you", "memory"],
    color: "180,180,200",
    messengers: [
      { id: "condolence", label: "Condolence", emoji: "🕯️" },
      { id: "memory",     label: "Memory",     emoji: "🖤" },
      { id: "sympathy",   label: "Sympathy",   emoji: "🌸" },
      { id: "hold-on",    label: "Hold-On",    emoji: "🤲" },
    ],
  },
  {
    id: "pride",
    label: "Pride",
    emoji: "🏆",
    keywords: ["pride", "proud", "honor", "achieve", "achievement", "salute", "recognize", "accomplishment"],
    color: "255,215,0",
    messengers: [
      { id: "proud",     label: "Proud",     emoji: "🏆" },
      { id: "honor",     label: "Honor",     emoji: "🎖️" },
      { id: "salute",    label: "Salute",    emoji: "🫡" },
      { id: "recognize", label: "Recognize", emoji: "⭐" },
    ],
  },
  {
    id: "gratitude",
    label: "Gratitude",
    emoji: "🙏",
    keywords: ["gratitude", "grateful", "thankful", "thank you", "appreciate", "appreciation"],
    color: "130,255,170",
    messengers: [
      { id: "thank-you",  label: "Thank-You",  emoji: "🙏" },
      { id: "appreciate", label: "Appreciate", emoji: "💚" },
      { id: "owe-you",    label: "Owe-You",    emoji: "🎁" },
      { id: "return",     label: "Return",     emoji: "🔄" },
    ],
  },
  {
    id: "excitement",
    label: "Excitement",
    emoji: "⚡",
    keywords: ["excited", "excitement", "pumped", "fired up", "energy", "hype", "hyped", "lets go"],
    color: "255,120,0",
    messengers: [
      { id: "hype-2",   label: "Hype",      emoji: "🔥" },
      { id: "spark",    label: "Spark",     emoji: "⚡" },
      { id: "lets-go",  label: "Let's-Go",  emoji: "🏁" },
      { id: "ignite",   label: "Ignite",    emoji: "💥" },
    ],
  },
  {
    id: "calm",
    label: "Calm / Peace",
    emoji: "🌊",
    keywords: ["calm", "peace", "peaceful", "soothe", "relax", "breathe", "still", "restore", "serene"],
    color: "100,200,255",
    messengers: [
      { id: "soothe",  label: "Soothe",  emoji: "🌊" },
      { id: "breathe", label: "Breathe", emoji: "🍃" },
      { id: "still",   label: "Still",   emoji: "🕊️" },
      { id: "restore", label: "Restore", emoji: "🌿" },
    ],
  },
  {
    id: "missing",
    label: "Miss You",
    emoji: "🌙",
    keywords: ["miss", "missing", "longing", "distance", "apart", "away", "lonesome"],
    color: "180,150,255",
    messengers: [
      { id: "distance",  label: "Distance",  emoji: "🌙" },
      { id: "longing",   label: "Longing",   emoji: "💌" },
      { id: "near",      label: "Still-Near", emoji: "🌉" },
      { id: "wait-for",  label: "Wait-For",  emoji: "⏳" },
    ],
  },
  {
    id: "anger",
    label: "Frustration / Anger",
    emoji: "🔥",
    keywords: ["angry", "anger", "mad", "frustrated", "frustration", "rage", "vent"],
    color: "255,60,60",
    messengers: [
      { id: "vent",    label: "Vent",    emoji: "😤" },
      { id: "real-talk", label: "Real-Talk", emoji: "🔥" },
      { id: "truth",   label: "Truth",   emoji: "🗣️" },
      { id: "release", label: "Release", emoji: "💨" },
    ],
  },
  {
    id: "surprise",
    label: "Surprise / Wow",
    emoji: "🎊",
    keywords: ["surprise", "wow", "shocked", "stunned", "unexpected", "amazing", "awesome"],
    color: "255,100,200",
    messengers: [
      { id: "drop",     label: "Drop",     emoji: "🎊" },
      { id: "bomb",     label: "Bomb",     emoji: "💣" },
      { id: "reveal",   label: "Reveal",   emoji: "🎭" },
      { id: "gotcha",   label: "Gotcha",   emoji: "😲" },
    ],
  },
  {
    id: "nostalgia",
    label: "Nostalgia",
    emoji: "📼",
    keywords: ["nostalgia", "nostalgic", "throwback", "remember", "memory", "old days", "back when"],
    color: "200,160,100",
    messengers: [
      { id: "throwback",  label: "Throwback",  emoji: "📼" },
      { id: "remember",   label: "Remember",   emoji: "🎞️" },
      { id: "back-then",  label: "Back-Then",  emoji: "🕰️" },
      { id: "timeless",   label: "Timeless",   emoji: "♾️" },
    ],
  },
  {
    id: "encouragement",
    label: "Encouragement",
    emoji: "💡",
    keywords: ["encourage", "encouragement", "cheer up", "keep going", "don't give up", "you got this"],
    color: "255,240,80",
    messengers: [
      { id: "you-got-this", label: "You Got This", emoji: "💡" },
      { id: "push",         label: "Push",         emoji: "🏋️" },
      { id: "next-level",   label: "Next-Level",   emoji: "📈" },
      { id: "believe",      label: "Believe",      emoji: "🌟" },
    ],
  },
  {
    id: "healing",
    label: "Healing / Recovery",
    emoji: "🌱",
    keywords: ["heal", "healing", "recovery", "better", "get well", "strength", "through this"],
    color: "100,255,150",
    messengers: [
      { id: "healing",    label: "Healing",   emoji: "🌱" },
      { id: "get-well",   label: "Get-Well",  emoji: "💊" },
      { id: "stronger",   label: "Stronger",  emoji: "🦋" },
      { id: "with-you",   label: "With-You",  emoji: "🤝" },
    ],
  },
  {
    id: "birthday",
    label: "Birthday / Milestone",
    emoji: "🎂",
    keywords: ["birthday", "milestone", "anniversary", "congratulations", "congrats", "new year"],
    color: "255,160,50",
    messengers: [
      { id: "celebrate-2", label: "Celebrate",  emoji: "🎂" },
      { id: "milestone",   label: "Milestone",  emoji: "🏅" },
      { id: "next-chapter", label: "Next-Chapter", emoji: "📖" },
      { id: "mark-it",     label: "Mark-It",   emoji: "🎯" },
    ],
  },
  {
    id: "friendship",
    label: "Friendship / Loyalty",
    emoji: "🤝",
    keywords: ["friend", "friendship", "loyal", "loyalty", "ride or die", "day one", "bestie"],
    color: "80,200,255",
    messengers: [
      { id: "day-one",    label: "Day-One",    emoji: "🤝" },
      { id: "ride-or-die", label: "Ride-Or-Die", emoji: "🛣️" },
      { id: "solid",      label: "Solid",      emoji: "🪨" },
      { id: "forever-fam", label: "Forever-Fam", emoji: "👊" },
    ],
  },
  {
    id: "motivation",
    label: "Motivation / Drive",
    emoji: "🚀",
    keywords: ["motivate", "motivation", "drive", "hustle", "grind", "ambitious", "goals", "focused"],
    color: "255,80,200",
    messengers: [
      { id: "grind",     label: "Grind",     emoji: "⚙️" },
      { id: "lock-in",   label: "Lock-In",   emoji: "🔒" },
      { id: "goal",      label: "Goal",      emoji: "🎯" },
      { id: "launch",    label: "Launch",    emoji: "🚀" },
    ],
  },
  {
    id: "faith",
    label: "Faith / Spiritual",
    emoji: "✝️",
    keywords: ["faith", "spiritual", "prayer", "bless", "blessing", "divine", "grace", "church"],
    color: "200,200,255",
    messengers: [
      { id: "bless",   label: "Bless",   emoji: "🙌" },
      { id: "prayer",  label: "Prayer",  emoji: "🙏" },
      { id: "grace",   label: "Grace",   emoji: "☁️" },
      { id: "amen",    label: "Amen",    emoji: "✝️" },
    ],
  },
];

/**
 * Returns the best-matching FeelingCluster for a raw text query.
 * Checks keyword list first; falls back to label match; falls back to null.
 */
export function matchFeeling(query: string): FeelingCluster | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;
  // Exact keyword match first
  for (const c of FEELING_CLUSTERS) {
    if (c.keywords.some((k) => q.includes(k))) return c;
  }
  // Partial label match
  for (const c of FEELING_CLUSTERS) {
    if (c.label.toLowerCase().includes(q)) return c;
  }
  return null;
}

/** Returns top N feeling clusters whose keywords include any word from the query */
export function suggestFeelings(query: string, limit = 4): FeelingCluster[] {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!words.length) return FEELING_CLUSTERS.slice(0, limit);
  const scored = FEELING_CLUSTERS.map((c) => ({
    cluster: c,
    score: words.reduce(
      (acc, w) => acc + c.keywords.filter((k) => k.includes(w)).length,
      0
    ),
  }));
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.cluster);
}
