import { useState } from "react";
import { X, Sparkles, Flag, Volume2 } from "lucide-react";
import { sounds } from "@/lib/soundEffects";
import { triggerFlowerShower } from "./FlowerShower";
import confetti from "canvas-confetti";

interface FlagHoistModalProps {
  isOpen: boolean;
  onClose: () => void;
  year: number;
  edition: string;
}

export const FlagHoistModal = ({
  isOpen,
  onClose,
  year,
  edition,
}: FlagHoistModalProps) => {
  const [isHoisted, setIsHoisted] = useState(false);
  const [isHoisting, setIsHoisting] = useState(false);

  if (!isOpen) return null;

  const handleHoist = () => {
    if (isHoisting || isHoisted) return;
    setIsHoisting(true);
    sounds.playTap();

    // Fanfare starts as the flag rises
    sounds.playFlagHoist();

    setTimeout(() => {
      setIsHoisted(true);
      setIsHoisting(false);
      triggerFlowerShower();

      // Grand celebration burst
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.4 },
        colors: ["#FF9933", "#FFFFFF", "#138808", "#000080", "#FFD700"],
      });
    }, 2200);
  };

  const handleReset = () => {
    sounds.playTap();
    setIsHoisted(false);
    setIsHoisting(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in print:hidden"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl glass-elevated p-6 sm:p-8 text-center shadow-2xl border border-white/40 dark:border-white/10 overflow-hidden card-pop"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron/10 border border-saffron/30 text-saffron text-xs font-bold uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Flag Hoisting Ceremony · ध्वजारोहण
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
          {edition} Independence Day {year}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
          Experience the sacred tradition of hoisting our beloved Tiranga with pride and honor.
        </p>

        {/* Flag Pole Visual Interactive Area */}
        <div className="relative h-64 sm:h-72 my-6 flex justify-center items-end bg-gradient-to-b from-sky-500/10 via-transparent to-amber-500/10 rounded-2xl border border-border/60 overflow-hidden">
          {/* Ambient sky background rays */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,153,51,0.15),transparent_70%)]" />

          {/* Golden Mast Pole */}
          <div className="relative flex flex-col items-center h-full w-full justify-end">
            {/* Pole Finial Sphere */}
            <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-600 via-amber-300 to-yellow-100 shadow-md border border-amber-400 z-10" />

            {/* Brass / Steel Mast */}
            <div className="w-2.5 h-[88%] bg-gradient-to-r from-slate-300 via-white to-slate-400 dark:from-slate-600 dark:via-slate-300 dark:to-slate-700 shadow-inner relative">
              {/* Flag Assembly that travels along pole */}
              <div
                style={{
                  bottom: isHoisting || isHoisted ? "62%" : "6%",
                  transition: isHoisting
                    ? "bottom 2.2s cubic-bezier(0.25, 1, 0.5, 1)"
                    : isHoisted
                    ? "none"
                    : "bottom 0.5s ease-out",
                }}
                className="absolute left-2.5 flex items-start select-none"
              >
                {!isHoisted && !isHoisting ? (
                  /* Folded ceremonial flag tied at bottom */
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/40 backdrop-blur-sm animate-pulse">
                    <span className="text-2xl">🇮🇳</span>
                    <div className="text-left text-[10px] font-bold text-foreground">
                      <span>Folded with Rose & Marigold petals</span>
                      <span className="block text-muted-foreground">Ready to hoist</span>
                    </div>
                  </div>
                ) : isHoisting ? (
                  /* Rising flag */
                  <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-saffron/20 border border-saffron/40 animate-bounce">
                    <span className="text-2xl">🇮🇳</span>
                    <span className="text-[10px] font-bold text-saffron">Hoisting...</span>
                  </div>
                ) : (
                  /* Unfurled magnificent 3D waving Tiranga flag */
                  <div className="relative flag-wave origin-left shadow-2xl flex flex-col w-36 sm:w-44 rounded-sm overflow-hidden border border-black/10">
                    <div className="h-6 sm:h-7 bg-[#ff9933]" />
                    <div className="h-6 sm:h-7 bg-white flex items-center justify-center relative">
                      <div className="w-5 h-5 rounded-full border-2 border-[#000080] flex items-center justify-center chakra-spin">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#000080]" />
                      </div>
                    </div>
                    <div className="h-6 sm:h-7 bg-[#138808]" />
                  </div>
                )}
              </div>
            </div>

            {/* Pedestal Base */}
            <div className="w-24 h-4 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-800 rounded-t-lg shadow-lg border-t border-amber-300" />
            <div className="w-32 h-3 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800 rounded-t-sm" />
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-3">
          {!isHoisted && !isHoisting ? (
            <button
              onClick={handleHoist}
              type="button"
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-saffron via-amber-500 to-india-green text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-elegant hover:opacity-95 active:scale-[0.97] transition-all"
            >
              <Flag className="w-4 h-4" /> Hoist the Tiranga · ध्वजारोहण करें 🇮🇳
            </button>
          ) : isHoisting ? (
            <div className="h-12 flex items-center justify-center gap-2 text-sm font-bold text-saffron animate-pulse">
              <Volume2 className="w-4 h-4 animate-ping" />
              <span>Hoisting flag to the anthem fanfare...</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-saffron/10 dark:bg-saffron/20 border border-saffron/30 text-xs sm:text-sm font-bold text-foreground">
                🎉 Tiranga Unfurled! Vijayee Vishwa Tiranga Pyaara, Jhanda Ooncha Rahe Hamaara! 🇮🇳
              </div>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={handleReset}
                  type="button"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground transition-colors"
                >
                  Hoist Again
                </button>
                <button
                  onClick={onClose}
                  type="button"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:opacity-90 shadow-sm transition-opacity"
                >
                  Jai Hind! Salute 🫡
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
