import React, { useState } from "react";
import { Flag, Sparkles, Flame, Play, Pause, Sun, Moon, ChevronDown, ChevronUp } from "lucide-react";
import { RealisticFlag } from "./RealisticFlag";
import { triggerFlowerShower } from "./RealisticPetalCanvas";
import { sounds } from "@/lib/soundEffects";
import confetti from "canvas-confetti";

interface DynamicIslandProps {
  onOpenFlagModal: () => void;
  year: number;
  edition: string;
}

export const DynamicIsland: React.FC<DynamicIslandProps> = ({
  onOpenFlagModal,
  year,
  edition,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  const toggleTheme = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playTap();
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("indy_theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("indy_theme", "dark");
      setIsDark(true);
    }
  };

  const handleFireworks = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playSuccessChime();
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.15 },
      colors: ["#FF9933", "#FFFFFF", "#138808", "#000080", "#FFD700"],
    });
  };

  const handlePetals = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerFlowerShower();
  };

  const handleFlag = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playTap();
    onOpenFlagModal();
  };

  return (
    <div className="fixed top-4 inset-x-0 z-50 flex justify-center pointer-events-none print:hidden px-4">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        style={{
          transition: "all 380ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className={`pointer-events-auto select-none rounded-full glass-elevated border border-white/50 dark:border-white/15 shadow-[0_16px_36px_-10px_rgba(0,0,0,0.22),0_4px_12px_rgba(255,153,51,0.08)] cursor-pointer overflow-hidden ${
          isExpanded
            ? "w-full max-w-md p-3.5 rounded-3xl"
            : "px-3.5 py-1.5 hover:scale-[1.02] active:scale-[0.98]"
        }`}
      >
        {/* Compact Mode */}
        {!isExpanded ? (
          <div className="flex items-center gap-2.5 text-xs">
            <RealisticFlag width={22} height={15} waving={true} withShadow={false} />

            <div className="flex items-center gap-1.5 font-bold tracking-tight text-foreground">
              <span>{edition}</span>
              <span className="opacity-40">·</span>
              <span className="text-saffron">15 August {year}</span>
            </div>

            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />

            <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full ml-1">
              <span>Controls</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </div>
          </div>
        ) : (
          /* Expanded Island Controls */
          <div className="space-y-3 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <RealisticFlag width={26} height={17} waving={true} withShadow={false} />
                <span className="font-extrabold text-xs tracking-tight text-foreground font-heading">
                  {edition} Independence Day · {year}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="p-1.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-foreground transition-colors"
                >
                  {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  aria-label="Collapse island"
                  className="p-1.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-foreground transition-colors"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Action Pills */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handleFlag}
                className="flex flex-col items-center justify-center p-2 rounded-2xl bg-saffron/10 hover:bg-saffron/20 border border-saffron/30 text-saffron transition-all btn-spring"
              >
                <Flag className="w-4 h-4 mb-1" />
                <span className="text-[10px] font-bold">Hoist Flag</span>
              </button>

              <button
                type="button"
                onClick={handlePetals}
                className="flex flex-col items-center justify-center p-2 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 transition-all btn-spring"
              >
                <Sparkles className="w-4 h-4 mb-1" />
                <span className="text-[10px] font-bold">Petals 🌸</span>
              </button>

              <button
                type="button"
                onClick={handleFireworks}
                className="flex flex-col items-center justify-center p-2 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 transition-all btn-spring"
              >
                <Flame className="w-4 h-4 mb-1" />
                <span className="text-[10px] font-bold">Fireworks</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
