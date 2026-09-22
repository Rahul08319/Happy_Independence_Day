export type PosterSize = "phone" | "a4" | "square";

export type CardTheme = "royal" | "midnight" | "parchment" | "tricolor";

export type CardSeal = "proud-indian" | "jai-hind" | "viksit-bharat" | "none";

export type CardFont = "cinzel" | "playfair" | "jakarta";

export interface CardSealConfig {
  id: CardSeal;
  label: string;
  sub: string;
  icon: string;
}

export const CARD_SEALS: Record<CardSeal, CardSealConfig> = {
  "proud-indian": { id: "proud-indian", label: "PROUD INDIAN", sub: "Rashtra Premi", icon: "🇮🇳" },
  "jai-hind": { id: "jai-hind", label: "JAI HIND", sub: "Victory to India", icon: "☸️" },
  "viksit-bharat": { id: "viksit-bharat", label: "VIKSIT BHARAT", sub: "Rising Nation", icon: "⭐" },
  "none": { id: "none", label: "No Seal", sub: "Minimalist", icon: "✨" },
};

export const CARD_FONTS: Record<CardFont, { id: CardFont; name: string; fontClass: string }> = {
  cinzel: { id: "cinzel", name: "Royal Cinzel", fontClass: "font-heading" },
  playfair: { id: "playfair", name: "Classic Playfair", fontClass: "font-serif" },
  jakarta: { id: "jakarta", name: "Jakarta Modern", fontClass: "font-sans" },
};

export interface CardThemeConfig {
  id: CardTheme;
  name: string;
  description: string;
  badgeBg: string;
  cardBg: string;
  textColor: string;
  quoteColor: string;
  accentColor: string;
  borderClass: string;
  previewGradient: string;
}

export const CARD_THEMES: Record<CardTheme, CardThemeConfig> = {
  royal: {
    id: "royal",
    name: "Royal Tiranga",
    description: "Lustrous white silk with gold embroidery & crisp tricolor borders",
    badgeBg: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
    cardBg: "bg-gradient-to-b from-white via-amber-50/20 to-white text-slate-900 border-amber-300/40",
    textColor: "text-slate-900",
    quoteColor: "text-slate-700",
    accentColor: "#000080",
    borderClass: "ring-1 ring-amber-300/60 shadow-xl",
    previewGradient: "from-[#ff9933] via-white to-[#138808]",
  },
  midnight: {
    id: "midnight",
    name: "Midnight Glow",
    description: "Deep obsidian sapphire canvas with neon glowing national tricolor",
    badgeBg: "bg-blue-500/20 text-blue-300 border-blue-400/30",
    cardBg: "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 border-slate-800",
    textColor: "text-white",
    quoteColor: "text-slate-200",
    accentColor: "#38bdf8",
    borderClass: "ring-1 ring-white/10 shadow-2xl",
    previewGradient: "from-slate-900 via-sky-950 to-slate-900",
  },
  parchment: {
    id: "parchment",
    name: "Heritage Ivory",
    description: "Warm antique parchment with royal heritage mandala and classic script",
    badgeBg: "bg-orange-500/10 text-orange-800 border-orange-400/30",
    cardBg: "bg-[#fcf8ee] text-[#2c1d11] border-[#e7d8c0]",
    textColor: "text-[#2c1d11]",
    quoteColor: "text-[#4a3525]",
    accentColor: "#8b4513",
    borderClass: "ring-1 ring-[#d4af37]/40 shadow-xl",
    previewGradient: "from-[#fcf8ee] via-[#f7ecd5] to-[#fcf8ee]",
  },
  tricolor: {
    id: "tricolor",
    name: "Vibrant Tiranga",
    description: "Bold celebratory Indian flag styling with vivid saffron & green accents",
    badgeBg: "bg-saffron/15 text-orange-700 dark:text-orange-300 border-saffron/40",
    cardBg: "bg-white text-slate-900 border-border",
    textColor: "text-slate-900",
    quoteColor: "text-slate-700",
    accentColor: "#000080",
    borderClass: "ring-2 ring-saffron/30 shadow-xl",
    previewGradient: "from-[#ff9933] via-[#ffeedd] to-[#e6ffe6]",
  },
};

export const PATRIOTIC_QUOTES = [
  {
    title: "Unity & Freedom",
    text: "Independence Day is an occasion to celebrate freedom, and to remember the sacrifices of those who fought to give us this sacred gift. Wishing you a proud and joyous Independence Day!",
    author: "Classic Wish",
  },
  {
    title: "Subhash Chandra Bose",
    text: "Freedom is not given, it is taken. Let us stand united to protect our liberty and build an extraordinary nation of progress and courage. Jai Hind!",
    author: "Netaji Subhash Chandra Bose",
  },
  {
    title: "Rabindranath Tagore",
    text: "Where the mind is without fear and the head is held high; into that heaven of freedom, my Father, let my country awake.",
    author: "Gurudev Rabindranath Tagore",
  },
  {
    title: "Dr. A.P.J. Abdul Kalam",
    text: "Where there is righteousness in the heart, there is beauty in the character. Let our youth dream big and dedicate their hearts to the nation.",
    author: "Dr. A.P.J. Abdul Kalam",
  },
  {
    title: "Bhagat Singh",
    text: "They may kill me, but they cannot kill my ideas. They can crush my body, but they will not be able to crush my spirit. Inquilab Zindabad!",
    author: "Shaheed Bhagat Singh",
  },
  {
    title: "Hindi Patriotic",
    text: "कुछ नशा तिरंगे की आन का है, कुछ नशा मातृभूमि की शान का है। हम लहराएंगे हर जगह ये तिरंगा, ये नशा हिंदुस्तान की शान का है! स्वतंत्रता दिवस की हार्दिक शुभकामनाएं।",
    author: "Desh Bhakti Kavita",
  },
];

export const POSTER_SIZES: Record<
  PosterSize,
  { label: string; width: number; height: number; pixelRatio: number; aspect: string }
> = {
  phone: { label: "Story (9:16)", width: 1080, height: 1920, pixelRatio: 2, aspect: "9 / 16" },
  square: { label: "Square (1:1)", width: 1080, height: 1080, pixelRatio: 2, aspect: "1 / 1" },
  a4: { label: "A4 Poster", width: 1240, height: 1754, pixelRatio: 2, aspect: "1240 / 1754" },
};

// Strip control chars, script/style tags and contents, collapse whitespace
export const sanitizeWish = (raw: string, maxLen = 400): string => {
  if (!raw) return "";
  let s = raw.replace(/[\u0000-\u001F\u007F]/g, " ");
  s = s.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, "");
  s = s.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, "");
  s = s.replace(/<[^>]*>/g, "");
  s = s.replace(/\b(javascript:|data:|vbscript:)/gi, "");
  s = s.replace(/[<>`]/g, "");
  s = s.replace(/[ \t]+/g, " ");
  s = s.replace(/\n{3,}/g, "\n\n");
  s = s.trim();
  if (s.length > maxLen) s = s.slice(0, maxLen).trim();
  return s;
};

export const sanitizeName = (raw: string, maxLen = 40): string => {
  if (!raw) return "";
  let s = raw.replace(/[\u0000-\u001F\u007F]/g, "");
  s = s.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, "");
  s = s.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, "");
  s = s.replace(/<[^>]*>/g, "");
  s = s.replace(/[<>`"'\\]/g, "");
  s = s.replace(/\s+/g, " ").trim();
  if (s.length > maxLen) s = s.slice(0, maxLen).trim();
  return s;
};

export type RecentWish = {
  id: string;
  name: string;
  message: string;
  theme?: CardTheme;
  seal?: CardSeal;
  font?: CardFont;
  createdAt: number;
};

const STORAGE_KEY = "indy2026_recent_wishes";
const MAX_RECENT = 8;

export const loadRecentWishes = (): RecentWish[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, MAX_RECENT);
  } catch {
    return [];
  }
};

export const saveRecentWish = (wish: Omit<RecentWish, "id" | "createdAt">): RecentWish[] => {
  const list = loadRecentWishes();
  const entry: RecentWish = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: wish.name,
    message: wish.message,
    theme: wish.theme || "royal",
    seal: wish.seal || "proud-indian",
    font: wish.font || "cinzel",
    createdAt: Date.now(),
  };
  // Dedupe by name+message
  const filtered = list.filter((w) => !(w.name === entry.name && w.message === entry.message));
  const next = [entry, ...filtered].slice(0, MAX_RECENT);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
};

export const removeRecentWish = (id: string): RecentWish[] => {
  const next = loadRecentWishes().filter((w) => w.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
};

/**
 * Returns ordinal representation of a number:
 * e.g. 1 -> "1st", 2 -> "2nd", 3 -> "3rd", 4 -> "4th", 21 -> "21st", 79 -> "79th", 81 -> "81st", 100 -> "100th"
 */
export const getOrdinal = (n: number): string => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export interface IndependenceDayInfo {
  targetYear: number;
  edition: number;
  editionString: string;
  isToday: boolean;
  targetDate: number;
  daysRemaining: number;
  specialMilestone?: string;
}

/**
 * Automatically computes upcoming Independence Day for any coming year (2026, 2027, 2028, 2047, etc.):
 * - Target is August 15th at 00:00:00 IST (+05:30).
 * - During August 15th IST itself: `isToday = true` (Celebration mode).
 * - After August 15th 23:59:59 IST has concluded: automatically rolls over to the next year.
 * - Supports year override parameter for simulation or testing.
 */
export const getIndependenceDayInfo = (
  referenceNow = Date.now(),
  yearOverride?: number | null
): IndependenceDayInfo => {
  const now = referenceNow;

  // IST is UTC+05:30
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(now + istOffset);
  const istCurrentYear = istNow.getUTCFullYear();

  let targetYear = yearOverride ?? istCurrentYear;

  // Aug 15 00:00:00 IST of current IST year (month is 7 = August)
  const thisAug15 = Date.UTC(istCurrentYear, 7, 15, 0, 0, 0) - istOffset;
  const nextDayAug16 = thisAug15 + 24 * 60 * 60 * 1000;

  if (!yearOverride) {
    if (now >= nextDayAug16) {
      // August 15th has already concluded this year -> auto roll over to next year
      targetYear = istCurrentYear + 1;
    } else {
      targetYear = istCurrentYear;
    }
  }

  const targetDate = Date.UTC(targetYear, 7, 15, 0, 0, 0) - istOffset;
  const targetAug16 = targetDate + 24 * 60 * 60 * 1000;
  const isToday = now >= targetDate && now < targetAug16;

  // 1947 = 1st Independence Day (August 15, 1947)
  const edition = targetYear - 1947;
  const editionString = getOrdinal(edition);

  let specialMilestone: string | undefined;
  if (edition === 75) {
    specialMilestone = "Azadi Ka Amrit Mahotsav (75th)";
  } else if (edition === 100) {
    specialMilestone = "Centenary of Freedom (100th · Viksit Bharat 2047)";
  } else if (edition % 10 === 0) {
    specialMilestone = `${editionString} Decade Milestone`;
  }

  const distance = Math.max(0, targetDate - now);
  const daysRemaining = Math.floor(distance / 86400000);

  return {
    targetYear,
    edition,
    editionString,
    isToday,
    targetDate,
    daysRemaining,
    specialMilestone,
  };
};

