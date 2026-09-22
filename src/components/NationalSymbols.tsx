import { useState } from "react";
import { ChevronRight, Sparkles, BookOpen } from "lucide-react";

interface SymbolItem {
  name: string;
  hindi: string;
  category: string;
  icon: string;
  color: string;
  description: string;
  significance: string;
}

const SYMBOLS: SymbolItem[] = [
  {
    name: "Tiranga",
    hindi: "राष्ट्रीय ध्वज (National Flag)",
    category: "National Flag",
    icon: "🇮🇳",
    color: "from-amber-500/20 to-emerald-500/20 border-amber-500/30",
    description: "Horizontal tricolor of deep saffron at the top, white in the middle, and India green at the bottom in equal proportion.",
    significance: "Saffron represents courage & sacrifice; white represents peace, unity & truth; green signifies prosperity & life.",
  },
  {
    name: "Ashoka Chakra",
    hindi: "धर्म चक्र (Wheel of Law)",
    category: "National Symbol",
    icon: "☸️",
    color: "from-blue-600/20 to-indigo-600/20 border-blue-500/30",
    description: "Depiction of the Dharmachakra with 24 spokes inspired by the Lion Capital of Ashoka at Sarnath.",
    significance: "Each of the 24 spokes embodies a sacred virtue of eternal righteousness, duty, and relentless progress.",
  },
  {
    name: "Lion Capital",
    hindi: "राष्ट्रीय प्रतीक (State Emblem)",
    category: "State Emblem",
    icon: "🏛️",
    color: "from-amber-600/20 to-yellow-600/20 border-amber-500/30",
    description: "Adapted from the Lion Capital of Ashoka with the motto 'Satyameva Jayate' (Truth Alone Triumphs) in Devanagari script.",
    significance: "Symbolizes sovereignty, universal power, courage, and truth guiding the destiny of India.",
  },
  {
    name: "National Anthem & Song",
    hindi: "जन गण मन व वन्दे मातरम्",
    category: "Anthem & Song",
    icon: "🎶",
    color: "from-purple-600/20 to-pink-600/20 border-purple-500/30",
    description: "Jana Gana Mana composed by Rabindranath Tagore, and Vande Mataram composed by Bankim Chandra Chatterjee.",
    significance: "Harmonizes diverse cultures into an unbreakable bond of collective patriotism and freedom.",
  },
];

export const NationalSymbols = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section className="mt-20 fade-up print:hidden">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron/10 border border-saffron/30 text-saffron text-xs font-bold uppercase tracking-widest mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            National Heritage & Pride
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
            Sacred Emblems of Our Nation
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto mt-1">
            Tap each emblem to discover the profound history and ideals behind India's national identity
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {SYMBOLS.map((item, idx) => {
            const isExpanded = selected === idx;
            return (
              <div
                key={item.name}
                onClick={() => setSelected(isExpanded ? null : idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(isExpanded ? null : idx);
                  }
                }}
                className={`group rounded-2xl bg-card/85 dark:bg-slate-900/85 backdrop-blur-md border p-4.5 transition-all duration-300 cursor-pointer select-none text-left ${
                  isExpanded
                    ? "border-saffron shadow-elegant ring-2 ring-saffron/20"
                    : "border-border/80 hover:border-saffron/40 hover:shadow-card"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-white/90 to-muted/80 dark:from-slate-800 dark:to-slate-900 border border-border shadow-sm group-hover:scale-105 transition-transform">
                      {item.icon}
                    </span>
                    <div>
                      <h3 className="font-bold text-base text-foreground group-hover:text-saffron transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium">{item.hindi}</p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
                      isExpanded ? "rotate-90 text-saffron" : "group-hover:translate-x-0.5"
                    }`}
                  />
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-3.5 border-t border-border/60 text-xs sm:text-sm space-y-2 animate-accordion-down">
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                    <div className="p-2.5 rounded-xl bg-saffron/5 dark:bg-saffron/10 border border-saffron/20 text-foreground font-medium leading-relaxed">
                      <span className="font-bold text-saffron">Significance: </span>
                      {item.significance}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
