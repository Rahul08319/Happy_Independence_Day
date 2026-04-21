import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const TARGET_DATE = new Date("2026-08-15T00:00:00+05:30").getTime();

const useCountdown = () => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const distance = Math.max(0, TARGET_DATE - now);
  const days = Math.floor(distance / 86400000);
  const hours = Math.floor((distance % 86400000) / 3600000);
  const minutes = Math.floor((distance % 3600000) / 60000);
  const seconds = Math.floor((distance % 60000) / 1000);
  return { days, hours, minutes, seconds, done: distance === 0 };
};

const AshokaChakra = ({ size = 80 }: { size?: number }) => {
  const spokes = Array.from({ length: 24 });
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className="chakra"
      aria-label="Ashoka Chakra"
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke="hsl(var(--ashoka-blue))" strokeWidth="3" />
      <circle cx="50" cy="50" r="6" fill="hsl(var(--ashoka-blue))" />
      {spokes.map((_, i) => (
        <line
          key={i}
          x1="50"
          y1="50"
          x2="50"
          y2="6"
          stroke="hsl(var(--ashoka-blue))"
          strokeWidth="1.5"
          transform={`rotate(${i * 15} 50 50)`}
        />
      ))}
    </svg>
  );
};

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
  <div className="flex flex-col items-center justify-center rounded-2xl bg-card/80 backdrop-blur px-4 py-3 md:px-6 md:py-4 shadow-card border border-border min-w-[72px]">
    <span className="text-2xl md:text-4xl font-extrabold text-gradient-tricolor tabular-nums">
      {String(value).padStart(2, "0")}
    </span>
    <span className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground mt-1">
      {label}
    </span>
  </div>
);

const Index = () => {
  const [name, setName] = useState("");
  const [submittedName, setSubmittedName] = useState<string | null>(null);
  const { days, hours, minutes, seconds } = useCountdown();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bl = params.get("bl");
    if (bl) setSubmittedName(decodeURIComponent(bl.replace(/-/g, " ")));
  }, []);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Please type your name first");
      return;
    }
    setSubmittedName(trimmed);
    setTimeout(() => cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const shareUrl = useMemo(() => {
    if (!submittedName) return "";
    const base = window.location.href.split("?")[0];
    return `${base}?bl=${encodeURIComponent(submittedName.replace(/ /g, "-"))}`;
  }, [submittedName]);

  const handleWhatsApp = () => {
    const text = `*${submittedName}* has sent you a special Independence Day 2026 wish 🇮🇳%0AClick the link to view 👉 ${shareUrl}`;
    window.location.href = `https://api.whatsapp.com/send?text=${text}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied! Share it anywhere.");
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-hero">
      {/* Background music */}
      <audio src="/vandemataram.mp3" autoPlay loop />

      {/* Decorative tricolor stripes */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-saffron via-white to-india-green" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-india-green via-white to-saffron" />

      {/* Floating flags */}
      <div aria-hidden className="pointer-events-none absolute left-4 top-20 hidden md:block float-slow opacity-80">
        <TricolorFlag />
      </div>
      <div aria-hidden className="pointer-events-none absolute right-4 top-32 hidden md:block float-slow opacity-80" style={{ animationDelay: "1.2s" }}>
        <TricolorFlag />
      </div>

      <div className="container mx-auto px-4 py-10 md:py-16 max-w-4xl">
        {/* Header */}
        <header className="text-center fade-up">
          <div className="flex justify-center mb-4">
            <AshokaChakra size={72} />
          </div>
          <p className="text-sm md:text-base uppercase tracking-[0.3em] text-accent font-semibold">
            15 August 2026 · 79th Independence Day
          </p>
          <h1 className="mt-3 font-['Playfair_Display'] italic text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-gradient-tricolor glow-pulse">
            Happy Independence Day
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Celebrate the spirit of freedom. Create a beautiful personalised wish and share it with your loved ones.
          </p>
        </header>

        {/* Countdown */}
        <section className="mt-10 md:mt-12 fade-up" style={{ animationDelay: "0.15s" }}>
          <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Countdown to 15 August 2026
          </p>
          <div className="flex items-center justify-center gap-2 md:gap-4">
            <Stat value={days} label="Days" />
            <Stat value={hours} label="Hours" />
            <Stat value={minutes} label="Minutes" />
            <Stat value={seconds} label="Seconds" />
          </div>
        </section>

        {/* Form / Card */}
        <section className="mt-12 fade-up" style={{ animationDelay: "0.3s" }}>
          {!submittedName ? (
            <form
              onSubmit={handleGenerate}
              className="mx-auto max-w-xl rounded-3xl bg-card/90 backdrop-blur border border-border shadow-elegant p-6 md:p-8"
            >
              <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                Enter Your Name
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
              <Button type="submit" size="lg" className="w-full mt-4 h-12 text-base bg-gradient-to-r from-saffron via-primary to-india-green text-white hover:opacity-95 transition-opacity">
                Create My Wish 🇮🇳
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-3">
                Your wish will be personalised with your name.
              </p>
            </form>
          ) : (
            <div
              ref={cardRef}
              className="mx-auto max-w-2xl rounded-3xl bg-card border border-border shadow-elegant overflow-hidden"
            >
              {/* Tricolor band */}
              <div className="h-3 bg-saffron" />
              <div className="h-3 bg-white flex items-center justify-center">
                <div className="h-2 w-2 rounded-full border border-ashoka-blue" />
              </div>
              <div className="h-3 bg-india-green" />

              <div className="p-8 md:p-12 text-center">
                <div className="flex justify-center mb-6">
                  <AshokaChakra size={90} />
                </div>
                <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold">
                  A wish from
                </p>
                <h2 className="mt-2 font-['Playfair_Display'] italic text-3xl md:text-5xl font-extrabold text-gradient-tricolor">
                  {submittedName}
                </h2>
                <p className="mt-6 text-lg md:text-xl text-foreground leading-relaxed">
                  Independence Day is an occasion to celebrate,
                  and to remember the struggles of those who fought to give us this gift.
                </p>
                <p className="mt-4 text-xl md:text-2xl font-bold text-secondary">
                  जय हिन्द · Jai Hind 🇮🇳
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Happy 79th Independence Day — 15 August 2026
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={handleWhatsApp}
                    size="lg"
                    className="bg-[#25D366] hover:bg-[#1fb957] text-white h-12 px-6"
                  >
                    Share on WhatsApp
                  </Button>
                  <Button
                    onClick={handleCopy}
                    size="lg"
                    variant="outline"
                    className="h-12 px-6"
                  >
                    Copy Link
                  </Button>
                  <Button
                    onClick={() => { setSubmittedName(null); setName(""); window.history.replaceState(null, "", window.location.pathname); }}
                    size="lg"
                    variant="ghost"
                    className="h-12 px-6"
                  >
                    Create New
                  </Button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-muted-foreground fade-up" style={{ animationDelay: "0.45s" }}>
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
