import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import confetti from "canvas-confetti";
import { QRCodeSVG } from "qrcode.react";
import {
  Download,
  Share2,
  Copy,
  RotateCcw,
  Printer,
  Smartphone,
  FileText,
  Square as SquareIcon,
  MessageCircle,
  Sparkles,
  Palette,
  Quote,
  Check,
  Award,
  Type,
  Flame,
  Layers,
  Eye,
} from "lucide-react";
import {
  POSTER_SIZES,
  PosterSize,
  CardTheme,
  CARD_THEMES,
  CARD_SEALS,
  CardSeal,
  CARD_FONTS,
  CardFont,
  PATRIOTIC_QUOTES,
  getIndependenceDayInfo,
  getOrdinal,
  sanitizeName,
  sanitizeWish,
  loadRecentWishes,
  saveRecentWish,
  removeRecentWish,
  RecentWish,
} from "@/lib/wishUtils";
import { RecentWishes } from "@/components/RecentWishes";
import { AudioDock } from "@/components/AudioDock";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ParticleCanvas } from "@/components/ParticleCanvas";
import { NationalSymbols } from "@/components/NationalSymbols";

const DEFAULT_MESSAGE =
  "Independence Day is an occasion to celebrate freedom, and to remember the sacrifices of those who fought to give us this sacred gift. Wishing you and your loved ones a proud, joyful, and prosperous Independence Day!";

const useCountdown = (yearOverride?: number | null) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const info = useMemo(() => getIndependenceDayInfo(now, yearOverride), [now, yearOverride]);
  const distance = Math.max(0, info.targetDate - now);

  return {
    ...info,
    days: info.daysRemaining,
    hours: Math.floor((distance % 86400000) / 3600000),
    minutes: Math.floor((distance % 3600000) / 60000),
    seconds: Math.floor((distance % 60000) / 1000),
  };
};

/* High-detail Ornamental Ashoka Chakra */
const AshokaChakra = ({ size = 84, className = "" }: { size?: number; className?: string }) => (
  <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className="chakra-spin"
      aria-label="Ashoka Chakra"
    >
      {/* Outer rim */}
      <circle cx="50" cy="50" r="47" fill="none" stroke="#000080" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="43" fill="none" stroke="#000080" strokeWidth="1" strokeDasharray="1.5 2" />
      {/* Inner hub */}
      <circle cx="50" cy="50" r="8.5" fill="#000080" />
      <circle cx="50" cy="50" r="4" fill="#ffffff" />
      {/* 24 spokes */}
      {Array.from({ length: 24 }).map((_, i) => (
        <g key={i} transform={`rotate(${i * 15} 50 50)`}>
          <line x1="50" y1="50" x2="50" y2="7" stroke="#000080" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="50" cy="7" r="1.2" fill="#000080" />
        </g>
      ))}
    </svg>
  </div>
);

/* Elegant Tricolor Ribbon Badge */
const TricolorBadge = () => (
  <div className="flag-wave inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-border shadow-md">
    <div className="flex flex-col w-5 h-3.5 rounded-sm overflow-hidden shadow-inner border border-black/10">
      <div className="h-1/3 bg-[#ff9933]" />
      <div className="h-1/3 bg-white flex items-center justify-center">
        <div className="w-1 h-1 rounded-full bg-[#000080]" />
      </div>
      <div className="h-1/3 bg-[#138808]" />
    </div>
    <span className="text-xs font-bold tracking-wider uppercase text-foreground">
      Jai Hind 🇮🇳
    </span>
  </div>
);

/* Glass Stat Card */
const StatCard = ({ value, label }: { value: number; label: string }) => (
  <div className="relative group flex flex-col items-center justify-center rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-3 py-3.5 sm:px-6 sm:py-5 shadow-card border border-white/60 dark:border-white/10 min-w-[70px] sm:min-w-[105px] transition-all duration-300 hover:shadow-elegant hover:-translate-y-0.5">
    <div className="absolute top-0 inset-x-0 h-1 rounded-t-2xl bg-gradient-to-r from-saffron via-amber-400 to-india-green" />
    <span className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-foreground tabular-nums tracking-tight">
      {String(value).padStart(2, "0")}
    </span>
    <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground mt-1.5">
      {label}
    </span>
  </div>
);

/* Multi-stage Fireworks / Confetti Cannon */
const fireConfetti = (intense = false) => {
  const colors = ["#FF9933", "#FFFFFF", "#138808", "#000080", "#FFD700"];
  const duration = intense ? 2500 : 1600;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: intense ? 8 : 4,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.75 },
      colors,
    });
    confetti({
      particleCount: intense ? 8 : 4,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.75 },
      colors,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();

  confetti({
    particleCount: intense ? 140 : 90,
    spread: 110,
    origin: { y: 0.55 },
    colors,
  });
};

/* Unified Greeting Card Renderer */
interface CardCanvasProps {
  cardRef?: React.RefObject<HTMLDivElement>;
  name: string;
  message: string;
  theme: CardTheme;
  seal: CardSeal;
  font: CardFont;
  posterSize: PosterSize;
  shareUrl: string;
  targetYear: number;
  editionString: string;
}

const CardCanvas = ({
  cardRef,
  name,
  message,
  theme,
  seal,
  font,
  posterSize,
  shareUrl,
  targetYear,
  editionString,
}: CardCanvasProps) => {
  const themeConfig = CARD_THEMES[theme] || CARD_THEMES.royal;
  const sealConfig = CARD_SEALS[seal] || CARD_SEALS["proud-indian"];
  const fontConfig = CARD_FONTS[font] || CARD_FONTS.cinzel;
  const aspect = POSTER_SIZES[posterSize].aspect;

  return (
    <div
      ref={cardRef}
      style={{ aspectRatio: aspect }}
      className={`w-full rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 relative select-none print:shadow-none print:border-none ${themeConfig.cardBg} ${themeConfig.borderClass}`}
    >
      {/* Top Tricolor Decorative Ribbon */}
      <div className="shrink-0">
        <div className="h-3.5 bg-[#ff9933]" />
        <div className="h-3 bg-white flex items-center justify-center">
          <div className="h-2 w-2 rounded-full border border-[#000080]" />
        </div>
        <div className="h-3.5 bg-[#138808]" />
      </div>

      {/* Card Body */}
      <div className="relative flex-1 p-5 sm:p-8 md:p-10 text-center flex flex-col items-center justify-center min-h-0 overflow-hidden">
        {/* Subtle Watermark Chakra */}
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center opacity-[0.035] dark:opacity-[0.055] pointer-events-none"
        >
          <AshokaChakra size={340} />
        </div>

        {/* Header Chakra & Badge */}
        <div className="relative mb-2 sm:mb-4">
          <div className="flex justify-center mb-1.5">
            <AshokaChakra size={posterSize === "square" ? 56 : 70} />
          </div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] border ${themeConfig.badgeBg}`}
          >
            A Special Greeting From
          </span>
        </div>

        {/* Sender Name with Selected Font */}
        <h2
          className={`${fontConfig.fontClass} italic text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight px-2 ${themeConfig.textColor}`}
        >
          {name || "Your Name Here"}
        </h2>

        {/* Divider */}
        <div className="flex items-center justify-center gap-2 my-3 sm:my-4 opacity-75">
          <span className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#ff9933]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#000080]" />
          <span className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#138808]" />
        </div>

        {/* Message */}
        <p
          className={`text-xs sm:text-sm md:text-base leading-relaxed max-w-lg mx-auto whitespace-pre-line font-medium px-3 ${themeConfig.quoteColor}`}
        >
          {message || DEFAULT_MESSAGE}
        </p>

        {/* Commemorative Seal Stamp (If selected) */}
        {seal !== "none" && (
          <div className="mt-3.5 sm:mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-400/15 border border-amber-500/40 text-amber-800 dark:text-amber-200 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest shadow-sm">
            <span>{sealConfig.icon}</span>
            <span>{sealConfig.label}</span>
          </div>
        )}

        {/* Slogan */}
        <div className="mt-3 sm:mt-4">
          <p className="font-heading italic text-lg sm:text-2xl md:text-3xl font-extrabold text-[#ff9933]">
            जय हिन्द · Jai Hind 🇮🇳
          </p>
          <p className="mt-0.5 text-[10px] sm:text-xs tracking-wider opacity-75 font-semibold">
            {editionString} Independence Day · 15 August {targetYear}
          </p>
        </div>

        {/* Scannable Card QR Code */}
        <div className="mt-4 sm:mt-5 flex flex-col items-center gap-1">
          <div className="p-1.5 sm:p-2 bg-white rounded-xl shadow-md border border-black/10">
            <QRCodeSVG
              value={shareUrl || (typeof window !== "undefined" ? window.location.href : "")}
              size={posterSize === "square" ? 60 : 76}
              level="M"
              bgColor="#ffffff"
              fgColor="#000080"
            />
          </div>
          <p className="text-[9px] sm:text-[10px] opacity-70 tracking-wider font-medium">
            Scan to view & personalize
          </p>
        </div>
      </div>

      {/* Bottom Tricolor Decorative Ribbon */}
      <div className="shrink-0">
        <div className="h-3.5 bg-[#138808]" />
        <div className="h-3 bg-white" />
        <div className="h-3.5 bg-[#ff9933]" />
      </div>
    </div>
  );
};

const Index = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [theme, setTheme] = useState<CardTheme>("royal");
  const [seal, setSeal] = useState<CardSeal>("proud-indian");
  const [font, setFont] = useState<CardFont>("cinzel");
  const [posterSize, setPosterSize] = useState<PosterSize>("phone");
  const [submitted, setSubmitted] = useState<{
    name: string;
    message: string;
    theme: CardTheme;
    seal: CardSeal;
    font: CardFont;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  const [recent, setRecent] = useState<RecentWish[]>([]);

  const [yearOverride, setYearOverride] = useState<number | null>(() => {
    if (typeof window !== "undefined") {
      const yr = new URLSearchParams(window.location.search).get("year");
      if (yr && !isNaN(Number(yr))) return Number(yr);
    }
    return null;
  });

  const countdown = useCountdown(yearOverride);
  const cardRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<HTMLDivElement>(null);

  // Decode shared link + load recents
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bl = params.get("bl");
    const msg = params.get("msg");
    const th = params.get("th") as CardTheme | null;
    const sl = params.get("sl") as CardSeal | null;
    const fn = params.get("fn") as CardFont | null;
    const yr = params.get("year");

    if (yr && !isNaN(Number(yr))) {
      setYearOverride(Number(yr));
    }

    if (bl) {
      const n = sanitizeName(decodeURIComponent(bl.replace(/-/g, " ")));
      const m = msg ? sanitizeWish(decodeURIComponent(msg)) : DEFAULT_MESSAGE;
      const initialTheme = th && CARD_THEMES[th] ? th : "royal";
      const initialSeal = sl && CARD_SEALS[sl] ? sl : "proud-indian";
      const initialFont = fn && CARD_FONTS[fn] ? fn : "cinzel";

      if (n) {
        setName(n);
        setMessage(m || DEFAULT_MESSAGE);
        setTheme(initialTheme);
        setSeal(initialSeal);
        setFont(initialFont);
        setSubmitted({
          name: n,
          message: m || DEFAULT_MESSAGE,
          theme: initialTheme,
          seal: initialSeal,
          font: initialFont,
        });
        setTimeout(() => fireConfetti(true), 400);
      }
    }
    setRecent(loadRecentWishes());
  }, []);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = sanitizeName(name);
    const cleanMsg = sanitizeWish(message) || DEFAULT_MESSAGE;
    if (!cleanName) {
      toast.error("Please enter your name to personalise your wish");
      return;
    }
    const wishData = { name: cleanName, message: cleanMsg, theme, seal, font };
    setSubmitted(wishData);
    setRecent(saveRecentWish(wishData));
    fireConfetti(true);
    setTimeout(() => {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
  };

  const reopenRecent = (w: RecentWish) => {
    const chosenTheme = w.theme || "royal";
    const chosenSeal = w.seal || "proud-indian";
    const chosenFont = w.font || "cinzel";
    setName(w.name);
    setMessage(w.message);
    setTheme(chosenTheme);
    setSeal(chosenSeal);
    setFont(chosenFont);
    setSubmitted({
      name: w.name,
      message: w.message,
      theme: chosenTheme,
      seal: chosenSeal,
      font: chosenFont,
    });
    fireConfetti();
    setTimeout(() => {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
  };

  const handleRemoveRecent = (id: string) => {
    setRecent(removeRecentWish(id));
    toast.success("Removed wish from your history");
  };

  const applyQuote = (quoteText: string) => {
    setMessage(quoteText);
    toast.info("Quote applied to your wish!");
  };

  const shareUrl = useMemo(() => {
    const active = submitted || { name, message, theme, seal, font };
    const base = window.location.href.split("?")[0];
    const params = new URLSearchParams({
      bl: (active.name || "friend").replace(/ /g, "-"),
      msg: active.message,
      th: active.theme,
      sl: active.seal,
      fn: active.font,
    });
    if (yearOverride) {
      params.set("year", String(yearOverride));
    }
    return `${base}?${params.toString()}`;
  }, [submitted, name, message, theme, seal, font, yearOverride]);

  const shareText = useMemo(() => {
    const sender = submitted?.name || name || "A proud citizen";
    const currentMsg = submitted?.message || message;
    return `🇮🇳 *${sender}* has sent you a special Independence Day ${countdown.targetYear} greeting card!\n\n"${currentMsg}"\n\n👉 Open your personalised card: ${shareUrl}\n\n*Jai Hind!*`;
  }, [submitted, name, message, shareUrl, countdown.targetYear]);

  const handleWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Happy Independence Day ${countdown.targetYear} from ${submitted?.name || name}`,
          text: `🇮🇳 ${submitted?.name || name} has sent you a special Independence Day wish!`,
          url: shareUrl,
        });
      } catch {
        // User dismissed
      }
    } else {
      handleWhatsApp();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied! Share it on WhatsApp, Instagram or SMS.");
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  const handleDownloadPng = async () => {
    if (!cardRef.current) return;
    const cfg = POSTER_SIZES[posterSize];
    try {
      toast.loading("Rendering high-resolution poster...", { id: "dl" });
      const node = cardRef.current;
      const rect = node.getBoundingClientRect();
      const pixelRatio = Math.max(2, cfg.height / rect.height);
      const dataUrl = await toPng(node, {
        pixelRatio,
        cacheBust: true,
        backgroundColor: (submitted?.theme || theme) === "midnight" ? "#020617" : "#ffffff",
      });
      const link = document.createElement("a");
      const safeName = (submitted?.name || name || "wish").replace(/\s+/g, "-").toLowerCase();
      link.download = `independence-day-${countdown.targetYear}-${posterSize}-${safeName}.png`;
      link.href = dataUrl;
      link.click();
      toast.success(`Downloaded ${cfg.label}!`, { id: "dl" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to download image. Try again.", { id: "dl" });
    }
  };

  const handlePrint = () => window.print();

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Interactive Floating Particle Canvas */}
      <ParticleCanvas />

      {/* Floating Audio Dock & Theme Switcher */}
      <AudioDock />
      <ThemeToggle />

      {/* Ambient Top & Bottom Ribbons */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-1.5 bg-gradient-to-r from-saffron via-white to-india-green z-50 print:hidden"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-india-green via-white to-saffron z-50 print:hidden"
      />

      {/* Ambient Floating Glow Orbs */}
      <div aria-hidden className="ambient-orb-saffron -top-24 -left-24 print:hidden" />
      <div aria-hidden className="ambient-orb-green top-1/3 -right-28 print:hidden" />
      <div aria-hidden className="ambient-orb-saffron bottom-24 left-1/4 opacity-35 print:hidden" />

      {/* Decorative desktop badges */}
      <div aria-hidden className="pointer-events-none absolute left-8 top-28 hidden lg:block opacity-85 print:hidden">
        <TricolorBadge />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute right-8 top-36 hidden lg:block opacity-85 print:hidden"
        style={{ animationDelay: "1.2s" }}
      >
        <TricolorBadge />
      </div>

      <div className="relative container mx-auto px-4 py-10 md:py-16 max-w-6xl z-10">
        {/* Hero Section */}
        <header className="text-center fade-up print:hidden">
          <div className="flex justify-center mb-5">
            <div
              className="relative group cursor-pointer"
              onClick={() => fireConfetti(true)}
              title="Click to launch Grand Celebratory Fireworks!"
            >
              <div className="absolute inset-0 rounded-full bg-blue-600/20 blur-xl animate-pulse" />
              <AshokaChakra size={88} />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron/10 dark:bg-saffron/20 border border-saffron/30 text-saffron font-bold text-xs md:text-sm uppercase tracking-[0.25em] shadow-sm mb-4">
            <span className="w-2 h-2 rounded-full bg-saffron animate-ping inline-block" />
            {countdown.isToday ? (
              <span>🎉 Celebrating Today · {countdown.editionString} Independence Day!</span>
            ) : (
              <span>15 August {countdown.targetYear} · {countdown.editionString} Independence Day</span>
            )}
            {countdown.specialMilestone && (
              <span className="hidden sm:inline-block border-l border-saffron/40 pl-2 text-amber-600 dark:text-amber-300 font-extrabold">
                {countdown.specialMilestone}
              </span>
            )}
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.08] text-gradient-tricolor">
            Happy Independence Day
          </h1>

          <p className="mt-4 text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-sans">
            Honor the heroes of our freedom struggle. Design an exquisite personalized tricolor greeting card with historic quotes, ambient music, and shareable high-res posters.
          </p>

          <div className="mt-5 flex items-center justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fireConfetti(true)}
              className="rounded-full text-xs font-bold gap-1.5 border-saffron/40 hover:bg-saffron/10 hover:text-saffron shadow-sm"
            >
              <Flame className="w-3.5 h-3.5 text-saffron" /> Launch Fireworks 🎆
            </Button>
            <span className="text-xs text-muted-foreground font-semibold px-2.5 py-1 rounded-full bg-muted/60">
              Over 125,000+ Wishes Sent 🇮🇳
            </span>
          </div>
        </header>

        {/* Live Countdown Section */}
        <section className="mt-10 md:mt-14 fade-up print:hidden" style={{ animationDelay: "0.15s" }}>
          <div className="text-center mb-4">
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-muted-foreground/90">
              {countdown.isToday ? "Festival of Freedom" : `Countdown to 15 August ${countdown.targetYear}`}
            </span>
          </div>
          {countdown.isToday ? (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-saffron/15 via-white/20 to-india-green/15 border border-saffron/30 text-center max-w-lg mx-auto shadow-elegant">
              <span className="text-3xl sm:text-4xl">🇮🇳 🎆 🇮🇳</span>
              <h3 className="text-xl sm:text-2xl font-extrabold font-heading mt-2 text-foreground">
                Happy {countdown.editionString} Independence Day!
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Today we celebrate India's freedom. Personalize and send greeting cards to your loved ones!
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-5">
              <StatCard value={countdown.days} label="Days" />
              <StatCard value={countdown.hours} label="Hours" />
              <StatCard value={countdown.minutes} label="Mins" />
              <StatCard value={countdown.seconds} label="Secs" />
            </div>
          )}
        </section>

        {/* INTERACTIVE STUDIO SECTION */}
        <section ref={studioRef} className="mt-14 md:mt-18 fade-up print:hidden" style={{ animationDelay: "0.25s" }}>
          {!submitted ? (
            <div className="rounded-3xl bg-card/90 dark:bg-slate-900/90 backdrop-blur-xl border border-border/80 shadow-elegant p-5 sm:p-8 lg:p-10 transition-all">
              {/* Studio Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-border/60">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-heading text-foreground flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-saffron" />
                    Interactive Card Studio
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    Customize your greeting in real-time and preview live as you type
                  </p>
                </div>

                {/* Mobile view switcher tab */}
                <div className="flex lg:hidden rounded-xl bg-muted p-1 border border-border">
                  <button
                    type="button"
                    onClick={() => setActiveTab("editor")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      activeTab === "editor" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                    }`}
                  >
                    Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      activeTab === "preview" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                    }`}
                  >
                    <Eye className="w-3 h-3" /> Live Preview
                  </button>
                </div>
              </div>

              {/* Grid: Editor on Left, Live Canvas on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Editor Column */}
                <div className={`lg:col-span-7 space-y-6 ${activeTab === "preview" ? "hidden lg:block" : "block"}`}>
                  <form onSubmit={handleGenerate} className="space-y-6">
                    {/* Sender Name */}
                    <div>
                      <label htmlFor="name-input" className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                        Your Name / Family Name <span className="text-saffron">*</span>
                      </label>
                      <Input
                        id="name-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Vikramaditya Sharma & Family"
                        className="h-12 text-base rounded-xl border-border focus-visible:ring-saffron"
                        maxLength={40}
                      />
                    </div>

                    {/* Theme Selector */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2 flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-saffron" />
                        Card Aesthetic Theme
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {(Object.keys(CARD_THEMES) as CardTheme[]).map((thId) => {
                          const th = CARD_THEMES[thId];
                          const isSelected = theme === thId;
                          return (
                            <button
                              key={thId}
                              type="button"
                              onClick={() => setTheme(thId)}
                              className={`p-3 rounded-xl text-left border transition-all duration-200 flex flex-col justify-between ${
                                isSelected
                                  ? "border-saffron bg-saffron/10 ring-2 ring-saffron/30 shadow-sm"
                                  : "border-border/70 hover:border-border bg-card/50 hover:bg-muted/50"
                              }`}
                            >
                              <div className="flex items-center justify-between w-full mb-1">
                                <span className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${th.previewGradient} border border-black/10`} />
                                {isSelected && <Check className="w-3.5 h-3.5 text-saffron" />}
                              </div>
                              <div className="font-bold text-xs text-foreground leading-tight">{th.name}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Commemorative Seal Selector */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-saffron" />
                        Commemorative Seal Stamp
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(Object.keys(CARD_SEALS) as CardSeal[]).map((sealId) => {
                          const sl = CARD_SEALS[sealId];
                          const isSelected = seal === sealId;
                          return (
                            <button
                              key={sealId}
                              type="button"
                              onClick={() => setSeal(sealId)}
                              className={`p-2.5 rounded-xl border text-left transition-all ${
                                isSelected
                                  ? "border-amber-500 bg-amber-500/15 ring-2 ring-amber-500/30"
                                  : "border-border/70 bg-card/40 hover:bg-muted/40"
                              }`}
                            >
                              <div className="text-base">{sl.icon}</div>
                              <div className="font-bold text-[11px] text-foreground mt-0.5">{sl.label}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Card Font Selector */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2 flex items-center gap-1.5">
                        <Type className="w-3.5 h-3.5 text-saffron" />
                        Card Typography Style
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(Object.keys(CARD_FONTS) as CardFont[]).map((fontId) => {
                          const fn = CARD_FONTS[fontId];
                          const isSelected = font === fontId;
                          return (
                            <button
                              key={fontId}
                              type="button"
                              onClick={() => setFont(fontId)}
                              className={`h-9 rounded-xl border text-xs font-bold transition-all ${
                                isSelected
                                  ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/30"
                                  : "border-border/70 text-muted-foreground hover:text-foreground"
                              } ${fn.fontClass}`}
                            >
                              {fn.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Historical Quotes Presets */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2 flex items-center gap-1.5">
                        <Quote className="w-3.5 h-3.5 text-saffron" />
                        Quick Pick Freedom Fighter Quotes
                      </label>
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        {PATRIOTIC_QUOTES.map((q, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => applyQuote(q.text)}
                            className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-muted hover:bg-saffron/15 hover:text-saffron border border-border/80 transition-colors"
                          >
                            {q.title}
                          </button>
                        ))}
                      </div>

                      <textarea
                        id="message-input"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        maxLength={400}
                        placeholder="Write your heartfelt message or pick from quotes above..."
                        className="w-full rounded-xl border border-input bg-background/80 px-3.5 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron resize-none leading-relaxed"
                      />
                      <div className="flex justify-between items-center text-xs text-muted-foreground mt-1 px-1">
                        <span>Personalize message</span>
                        <span>{message.length}/400</span>
                      </div>
                    </div>

                    {/* Aspect Ratio / Dimensions */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-saffron" />
                        Poster Format
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(Object.keys(POSTER_SIZES) as PosterSize[]).map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setPosterSize(sz)}
                            className={`flex items-center justify-center gap-1.5 h-10 rounded-xl text-xs font-semibold border transition-all ${
                              posterSize === sz
                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                : "bg-background/60 border-border text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {sz === "phone" && <Smartphone className="w-3.5 h-3.5" />}
                            {sz === "square" && <SquareIcon className="w-3.5 h-3.5" />}
                            {sz === "a4" && <FileText className="w-3.5 h-3.5" />}
                            {POSTER_SIZES[sz].label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-13 text-base font-bold bg-gradient-to-r from-[#ff9933] via-amber-500 to-[#138808] text-white hover:opacity-95 shadow-elegant transition-all duration-300 rounded-xl mt-3"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate & Share Card 🇮🇳
                    </Button>
                  </form>
                </div>

                {/* Live Real-time Card Preview Column */}
                <div className={`lg:col-span-5 flex flex-col items-center ${activeTab === "editor" ? "hidden lg:flex" : "flex"}`}>
                  <div className="w-full flex items-center justify-between mb-3 px-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-saffron" /> Live Canvas Preview
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-saffron/10 text-saffron">
                      Real-time
                    </span>
                  </div>

                  {/* Render Live Canvas */}
                  <div className="w-full max-w-sm sm:max-w-md shadow-2xl rounded-3xl overflow-hidden ring-1 ring-border/80">
                    <CardCanvas
                      name={name}
                      message={message}
                      theme={theme}
                      seal={seal}
                      font={font}
                      posterSize={posterSize}
                      shareUrl={shareUrl}
                      targetYear={countdown.targetYear}
                      editionString={countdown.editionString}
                    />
                  </div>

                  <p className="text-xs text-muted-foreground text-center mt-3">
                    Preview updates in real-time as you customize. Click <b>Generate & Share</b> to unlock high-res download and WhatsApp sharing!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Finalized Card Showcase & Action Dock */
            <div className="mx-auto max-w-2xl space-y-6">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-card/85 dark:bg-slate-900/85 backdrop-blur-md border border-border/80 shadow-sm print:hidden">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
                    Format:
                  </span>
                  {(Object.keys(POSTER_SIZES) as PosterSize[]).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setPosterSize(sz)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        posterSize === sz
                          ? "bg-saffron text-white shadow-sm"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {POSTER_SIZES[sz].label.split(" ")[0]}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
                    Theme:
                  </span>
                  {(Object.keys(CARD_THEMES) as CardTheme[]).map((thId) => (
                    <button
                      key={thId}
                      onClick={() => setSubmitted({ ...submitted, theme: thId })}
                      className={`w-6 h-6 rounded-full border transition-all ${
                        submitted.theme === thId
                          ? "ring-2 ring-saffron ring-offset-2 scale-110"
                          : "opacity-60 hover:opacity-100"
                      } bg-gradient-to-tr ${CARD_THEMES[thId].previewGradient}`}
                      title={CARD_THEMES[thId].name}
                    />
                  ))}
                </div>
              </div>

              {/* Master Card to be Exported */}
              <div className="shadow-2xl rounded-3xl overflow-hidden ring-1 ring-border/80">
                <CardCanvas
                  cardRef={cardRef}
                  name={submitted.name}
                  message={submitted.message}
                  theme={submitted.theme}
                  seal={submitted.seal}
                  font={submitted.font}
                  posterSize={posterSize}
                  shareUrl={shareUrl}
                  targetYear={countdown.targetYear}
                  editionString={countdown.editionString}
                />
              </div>

              {/* Share Preview Snippet */}
              <div className="rounded-2xl bg-card/80 dark:bg-slate-900/80 backdrop-blur-md border border-border/80 p-4 sm:p-5 shadow-sm print:hidden">
                <div className="flex items-center gap-2 mb-1.5">
                  <MessageCircle className="h-4 w-4 text-[#25D366]" />
                  <h4 className="text-sm font-bold text-foreground">WhatsApp Greeting Preview</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-2.5">
                  This message will be instantly pre-filled when sharing with family and friends:
                </p>
                <pre className="text-xs sm:text-sm whitespace-pre-wrap break-words rounded-xl bg-muted/70 border border-border/70 p-3 text-foreground font-sans leading-relaxed">
                  {shareText}
                </pre>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 print:hidden">
                <Button
                  onClick={handleWhatsApp}
                  size="lg"
                  className="bg-[#25D366] hover:bg-[#1fb957] text-white h-12 rounded-xl font-bold gap-2 shadow-sm"
                >
                  <Share2 className="h-4 w-4" /> WhatsApp
                </Button>
                <Button
                  onClick={handleNativeShare}
                  size="lg"
                  variant="secondary"
                  className="h-12 rounded-xl font-bold gap-2"
                >
                  <Share2 className="h-4 w-4" /> Share Card
                </Button>
                <Button
                  onClick={handleCopy}
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-xl font-semibold gap-2 border-border hover:border-saffron"
                >
                  <Copy className="h-4 w-4" /> Copy Link
                </Button>
                <Button
                  onClick={handleDownloadPng}
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-xl font-semibold gap-2 border-border hover:border-saffron"
                >
                  <Download className="h-4 w-4" /> Download PNG
                </Button>
                <Button
                  onClick={handlePrint}
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-xl font-semibold gap-2 border-border"
                >
                  <Printer className="h-4 w-4" /> Print Poster
                </Button>
                <Button
                  onClick={() => {
                    setSubmitted(null);
                    window.history.replaceState(null, "", window.location.pathname);
                  }}
                  size="lg"
                  variant="ghost"
                  className="h-12 rounded-xl font-semibold gap-2 hover:bg-saffron/10 hover:text-saffron"
                >
                  <RotateCcw className="h-4 w-4" /> Edit / New Wish
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* National Heritage & Sacred Emblems Accordion */}
        <NationalSymbols />

        {/* Wall of Recent Wishes */}
        <RecentWishes wishes={recent} onOpen={reopenRecent} onRemove={handleRemoveRecent} />

        {/* Footer */}
        <footer className="mt-20 text-center text-sm text-muted-foreground fade-up print:hidden" style={{ animationDelay: "0.45s" }}>
          <div className="flex justify-center mb-3">
            <TricolorBadge />
          </div>
          <p className="font-semibold text-foreground">
            Dedicated to the Republic of India & all freedom fighters · 15 August {countdown.targetYear}
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Made with ❤️, Heritage & National Pride · Vande Mataram
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Index;
