import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import { Volume2, VolumeX, Download, Share2, Copy, RotateCcw, Printer } from "lucide-react";

const TARGET_DATE = new Date("2026-08-15T00:00:00+05:30").getTime();

const DEFAULT_MESSAGE =
  "Independence Day is an occasion to celebrate, and to remember the struggles of those who fought to give us this gift. Wishing you and your family a joyful, proud, and prosperous Independence Day.";

const useCountdown = () => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const distance = Math.max(0, TARGET_DATE - now);
  return {
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance % 86400000) / 3600000),
    minutes: Math.floor((distance % 3600000) / 60000),
    seconds: Math.floor((distance % 60000) / 1000),
  };
};

const AshokaChakra = ({ size = 80 }: { size?: number }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className="chakra" aria-label="Ashoka Chakra">
    <circle cx="50" cy="50" r="46" fill="none" stroke="hsl(var(--ashoka-blue))" strokeWidth="3" />
    <circle cx="50" cy="50" r="6" fill="hsl(var(--ashoka-blue))" />
    {Array.from({ length: 24 }).map((_, i) => (
      <line key={i} x1="50" y1="50" x2="50" y2="6" stroke="hsl(var(--ashoka-blue))" strokeWidth="1.5" transform={`rotate(${i * 15} 50 50)`} />
    ))}
  </svg>
);

const TricolorFlag = () => (
  <div className="wave inline-flex flex-col rounded-md overflow-hidden shadow-card border border-border">
    <div className="h-3 w-16 bg-saffron" />
    <div className="h-3 w-16 bg-white flex items-center justify-center">
      <div className="h-2 w-2 rounded-full border border-ashoka-blue" />
    </div>
    <div className="h-3 w-16 bg-india-green" />
  </div>
);

const Stat = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl bg-card/80 backdrop-blur px-4 py-3 md:px-7 md:py-5 shadow-card border border-border min-w-[76px] md:min-w-[110px]">
    <span className="text-3xl md:text-5xl font-extrabold text-gradient-tricolor tabular-nums leading-none">
      {String(value).padStart(2, "0")}
    </span>
    <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground mt-2">{label}</span>
  </div>
);

const Index = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [submitted, setSubmitted] = useState<{ name: string; message: string } | null>(null);
  const { days, hours, minutes, seconds } = useCountdown();
  const cardRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Decode shared link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bl = params.get("bl");
    const msg = params.get("msg");
    if (bl) {
      setSubmitted({
        name: decodeURIComponent(bl.replace(/-/g, " ")),
        message: msg ? decodeURIComponent(msg) : DEFAULT_MESSAGE,
      });
    }
  }, []);

  // Start music only after first interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        setMuted(false);
        audioRef.current?.play().catch(() => {});
      }
    };
    window.addEventListener("pointerdown", handleFirstInteraction, { once: true });
    window.addEventListener("keydown", handleFirstInteraction, { once: true });
    return () => {
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, [hasInteracted]);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (muted) {
      audio.muted = false;
      audio.play().catch(() => {});
      setMuted(false);
      setHasInteracted(true);
    } else {
      audio.muted = true;
      setMuted(true);
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Please type your name first");
      return;
    }
    setSubmitted({ name: trimmed, message: message.trim() || DEFAULT_MESSAGE });
    setTimeout(() => cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const shareUrl = useMemo(() => {
    if (!submitted) return "";
    const base = window.location.href.split("?")[0];
    const params = new URLSearchParams({
      bl: submitted.name.replace(/ /g, "-"),
      msg: submitted.message,
    });
    return `${base}?${params.toString()}`;
  }, [submitted]);

  const handleWhatsApp = () => {
    const text = `*${submitted?.name}* has sent you a special Independence Day 2026 wish 🇮🇳\nClick the link to view 👉 ${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Happy Independence Day 2026",
          text: `${submitted?.name} has sent you a special Independence Day wish 🇮🇳`,
          url: shareUrl,
        });
      } catch {
        // user cancelled
      }
    } else {
      handleWhatsApp();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied! Share it anywhere.");
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  const handleDownloadPng = async () => {
    if (!cardRef.current) return;
    try {
      toast.loading("Generating image...", { id: "dl" });
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `independence-wish-${submitted?.name.replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Downloaded!", { id: "dl" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to download", { id: "dl" });
    }
  };

  const handlePrint = () => window.print();

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-hero">
      <audio ref={audioRef} src="/vandemataram.mp3" loop muted={muted} />

      {/* Top/bottom tricolor strips */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-saffron via-white to-india-green print:hidden" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-india-green via-white to-saffron print:hidden" />

      {/* Floating flags */}
      <div aria-hidden className="pointer-events-none absolute left-6 top-24 hidden md:block float-slow opacity-70 print:hidden">
        <TricolorFlag />
      </div>
      <div aria-hidden className="pointer-events-none absolute right-6 top-40 hidden md:block float-slow opacity-70 print:hidden" style={{ animationDelay: "1.2s" }}>
        <TricolorFlag />
      </div>

      {/* Music toggle */}
      <button
        onClick={toggleMute}
        aria-label={muted ? "Unmute music" : "Mute music"}
        className="fixed top-4 right-4 z-50 h-11 w-11 rounded-full bg-card/90 backdrop-blur border border-border shadow-card flex items-center justify-center hover:scale-105 transition-transform print:hidden"
      >
        {muted ? <VolumeX className="h-5 w-5 text-muted-foreground" /> : <Volume2 className="h-5 w-5 text-primary" />}
      </button>

      <div className="container mx-auto px-4 py-10 md:py-20 max-w-5xl">
        {/* Header */}
        <header className="text-center fade-up print:hidden">
          <div className="flex justify-center mb-5">
            <AshokaChakra size={72} />
          </div>
          <p className="text-xs md:text-sm uppercase tracking-[0.35em] text-accent font-semibold">
            15 August 2026 · 79th Independence Day
          </p>
          <h1 className="mt-4 font-['Playfair_Display'] italic text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] text-gradient-tricolor glow-pulse">
            Happy Independence Day
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Celebrate the spirit of freedom. Create a beautiful personalised wish and share it with your loved ones.
          </p>
        </header>

        {/* Countdown */}
        <section className="mt-12 md:mt-16 fade-up print:hidden" style={{ animationDelay: "0.15s" }}>
          <p className="text-center text-[11px] md:text-xs uppercase tracking-[0.3em] text-muted-foreground mb-5">
            Countdown to 15 August 2026
          </p>
          <div className="flex items-center justify-center gap-2 md:gap-5">
            <Stat value={days} label="Days" />
            <Stat value={hours} label="Hours" />
            <Stat value={minutes} label="Minutes" />
            <Stat value={seconds} label="Seconds" />
          </div>
        </section>

        {/* Form */}
        <section className="mt-14 md:mt-20 fade-up print:hidden" style={{ animationDelay: "0.3s" }}>
          {!submitted ? (
            <form
              onSubmit={handleGenerate}
              className="mx-auto max-w-xl rounded-3xl bg-card/90 backdrop-blur border border-border shadow-elegant p-6 md:p-10"
            >
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">Create Your Wish</h2>
              <p className="text-sm text-muted-foreground mb-6">Personalise it with your name and message.</p>

              <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                Your Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Arjun Sharma"
                className="h-12 text-base"
                maxLength={40}
                autoFocus
              />

              <label htmlFor="msg" className="block text-sm font-semibold text-foreground mb-2 mt-5">
                Your Wish Message
              </label>
              <textarea
                id="msg"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                maxLength={400}
                placeholder="Write your heartfelt Independence Day message..."
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-base md:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
              <div className="text-right text-xs text-muted-foreground mt-1">{message.length}/400</div>

              <Button
                type="submit"
                size="lg"
                className="w-full mt-5 h-12 text-base font-semibold bg-gradient-to-r from-saffron via-primary to-india-green text-white hover:opacity-95 transition-opacity shadow-elegant"
              >
                Create My Wish 🇮🇳
              </Button>
            </form>
          ) : (
            <div className="mx-auto max-w-2xl space-y-6">
              {/* Card */}
              <div
                ref={cardRef}
                className="rounded-3xl bg-card border border-border shadow-elegant overflow-hidden print:shadow-none print:border-0"
              >
                <div className="h-3 bg-saffron" />
                <div className="h-3 bg-white flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full border border-ashoka-blue" />
                </div>
                <div className="h-3 bg-india-green" />

                <div className="p-8 md:p-14 text-center">
                  <div className="flex justify-center mb-6">
                    <AshokaChakra size={90} />
                  </div>
                  <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-accent font-semibold">
                    A wish from
                  </p>
                  <h2 className="mt-3 font-['Playfair_Display'] italic text-3xl sm:text-4xl md:text-5xl font-extrabold text-gradient-tricolor leading-tight">
                    {submitted.name}
                  </h2>
                  <p className="mt-7 text-base md:text-lg text-foreground leading-relaxed max-w-lg mx-auto whitespace-pre-line">
                    {submitted.message}
                  </p>
                  <p className="mt-8 text-2xl md:text-3xl font-bold text-secondary font-['Playfair_Display'] italic">
                    जय हिन्द · Jai Hind 🇮🇳
                  </p>
                  <p className="mt-2 text-xs md:text-sm text-muted-foreground tracking-wider">
                    Happy 79th Independence Day — 15 August 2026
                  </p>
                </div>

                <div className="h-3 bg-india-green" />
                <div className="h-3 bg-white" />
                <div className="h-3 bg-saffron" />
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 print:hidden">
                <Button onClick={handleWhatsApp} size="lg" className="bg-[#25D366] hover:bg-[#1fb957] text-white h-12">
                  <Share2 className="h-4 w-4" /> WhatsApp
                </Button>
                <Button onClick={handleNativeShare} size="lg" variant="secondary" className="h-12">
                  <Share2 className="h-4 w-4" /> Share
                </Button>
                <Button onClick={handleCopy} size="lg" variant="outline" className="h-12">
                  <Copy className="h-4 w-4" /> Copy Link
                </Button>
                <Button onClick={handleDownloadPng} size="lg" variant="outline" className="h-12">
                  <Download className="h-4 w-4" /> Download PNG
                </Button>
                <Button onClick={handlePrint} size="lg" variant="outline" className="h-12">
                  <Printer className="h-4 w-4" /> Print Poster
                </Button>
                <Button
                  onClick={() => {
                    setSubmitted(null);
                    setName("");
                    setMessage(DEFAULT_MESSAGE);
                    window.history.replaceState(null, "", window.location.pathname);
                  }}
                  size="lg"
                  variant="ghost"
                  className="h-12"
                >
                  <RotateCcw className="h-4 w-4" /> New Wish
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-20 text-center text-sm text-muted-foreground fade-up print:hidden" style={{ animationDelay: "0.45s" }}>
          <div className="flex justify-center mb-3">
            <TricolorFlag />
          </div>
          <p>Made with ❤️ for India · {new Date().getFullYear()}</p>
        </footer>
      </div>
    </main>
  );
};

export default Index;
