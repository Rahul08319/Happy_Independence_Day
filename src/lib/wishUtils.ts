export type PosterSize = "phone" | "a4" | "square";

export const POSTER_SIZES: Record<
  PosterSize,
  { label: string; width: number; height: number; pixelRatio: number; aspect: string }
> = {
  phone: { label: "Phone (9:16)", width: 1080, height: 1920, pixelRatio: 2, aspect: "9 / 16" },
  a4: { label: "A4 Poster", width: 1240, height: 1754, pixelRatio: 2, aspect: "1240 / 1754" },
  square: { label: "Square (1:1)", width: 1080, height: 1080, pixelRatio: 2, aspect: "1 / 1" },
};

// Strip control chars, script/HTML-ish tokens, collapse whitespace
export const sanitizeWish = (raw: string, maxLen = 400): string => {
  if (!raw) return "";
  let s = raw.replace(/[\u0000-\u001F\u007F]/g, " ");
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
  createdAt: number;
};

const STORAGE_KEY = "indy2026_recent_wishes";
const MAX_RECENT = 6;

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
