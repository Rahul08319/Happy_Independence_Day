import { useState } from "react";
import { ChevronRight, Sparkles, BookOpen, Flag, Shield, Landmark, Music } from "lucide-react";
import { sounds } from "@/lib/soundEffects";
import { RealisticFlag } from "./RealisticFlag";
import { RealisticChakra } from "./RealisticChakra";

interface SymbolItem {
  id: string;
  name: string;
  hindi: string;
  category: string;
  icon: string;
  badgeIcon: React.ReactNode;
  description: string;
  significance: string;
  featured?: boolean;
}

const SYMBOLS: SymbolItem[] = [
  {
    id: "tiranga",
    name: "Tiranga · National Flag",
    hindi: "राष्ट्रीय ध्वज (Tiranga)",
    category: "Sacred Banner",
    icon: "🇮🇳",
    badgeIcon: <Flag className="w-3.5 h-3.5 text-saffron" />,
    description:
      "A horizontal tricolor of deep saffron (kesari) at the top, pure white in the middle, and India green at the bottom in equal proportion, bearing the 24-spoked navy Ashoka Chakra at its center.",
    significance:
      "Saffron represents courage, valour and selfless sacrifice; white embodies peace, unity, and truth; green signifies agricultural prosperity, life, and auspiciousness.",
    featured: true,
  },
  {
    id: "chakra",
    name: "Ashoka Chakra",
    hindi: "धर्म चक्र (Wheel of Law)",
    category: "Eternal Progress",
    icon: "☸️",
    badgeIcon: <Shield className="w-3.5 h-3.5 text-blue-500" />,
    description:
      "The depiction of the Dharmachakra with 24 spokes, originally sculpted on the Lion Capital of Emperor Ashoka at Sarnath.",
    significance:
      "Each spoke embodies an eternal virtue of righteousness, duty, dynamic progress, and moral discipline guiding the destiny of India.",
  },
  {
    id: "lion",
    name: "State Lion Capital",
    hindi: "राष्ट्रीय प्रतीक (State Emblem)",
    category: "Sovereign Authority",
    icon: "🏛️",
    badgeIcon: <Landmark className="w-3.5 h-3.5 text-amber-500" />,
    description:
      "Adapted from the Lion Capital of Ashoka at Sarnath, featuring four Asiatic lions standing back-to-back with the motto 'Satyameva Jayate' (Truth Alone Triumphs).",
    significance:
      "Symbolizes sovereignty, universal justice, courage, and truth guiding the destiny of our sovereign democratic republic.",
  },
  {
    id: "anthem",
    name: "Jana Gana Mana & Vande Mataram",
    hindi: "राष्ट्रगान व राष्ट्रगीत",
    category: "Anthem & Song",
    icon: "🎶",
    badgeIcon: <Music className="w-3.5 h-3.5 text-emerald-500" />,
    description:
      "Jana Gana Mana composed by Nobel laureate Rabindranath Tagore, and Vande Mataram composed by Bankim Chandra Chatterjee in 1882.",
    significance:
      "Unifies India's vast cultural and geographical diversity into an unbreakable sacred bond of collective national consciousness.",
  },
];

export const NationalSymbols = () => {
  const [selected, setSelected] = useState<string | null>("tiranga");

  const toggleSelect = (id: string) => {
    sounds.playTap();
    setSelected((prev) => (prev === id ? null : id));
  };

  return (
    <section className="mt-20 scroll-fade print:hidden">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-saffron/10 border border-saffron/30 text-saffron text-xs font-bold uppercase tracking-widest mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            National Heritage & Identity
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-foreground tracking-tight">
            Sacred Emblems of Our Republic
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto mt-2 leading-relaxed">
            Interactive Apple Bento Grid: Explore the profound history, constitutional ideals, and virtues behind India's national symbols.
          </p>
        </div>

        {/* ── Apple Bento Grid Layout ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {SYMBOLS.map((item) => {
            const isExpanded = selected === item.id;
            const isFeatured = item.featured;

            return (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => toggleSelect(item.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleSelect(item.id);
                  }
                }}
                style={{
                  transition: "all 320ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                className={`group rounded-3xl glass-card border border-white/60 dark:border-white/10 p-5 sm:p-6 cursor-pointer select-none text-left relative overflow-hidden transition-all duration-300 ${
                  isFeatured ? "md:col-span-12 lg:col-span-8" : "md:col-span-6 lg:col-span-4"
                } ${
                  isExpanded
                    ? "ring-2 ring-saffron/40 shadow-elegant"
                    : "hover:border-saffron/40 hover:shadow-card active:scale-[0.99]"
                }`}
              >
                {/* Top Pill Category Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/5 dark:border-white/10 text-[11px] font-bold text-foreground">
                    {item.badgeIcon}
                    <span>{item.category}</span>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
                      isExpanded ? "rotate-90 text-saffron" : "group-hover:translate-x-1"
                    }`}
                  />
                </div>

                {/* Content Header */}
                <div className="flex items-start gap-4">
                  {item.id === "tiranga" ? (
                    <div className="shrink-0 w-14 h-10 rounded-lg overflow-hidden shadow-md">
                      <RealisticFlag width={56} height={38} waving={true} withShadow={false} />
                    </div>
                  ) : item.id === "chakra" ? (
                    <div className="shrink-0 w-11 h-11 flex items-center justify-center">
                      <RealisticChakra size={44} interactive={false} />
                    </div>
                  ) : (
                    <div className="shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/20 border border-amber-500/30 flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 transition-transform">
                      {item.icon}
                    </div>
                  )}

                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-foreground group-hover:text-saffron transition-colors font-heading leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-semibold mt-0.5">{item.hindi}</p>
                  </div>
                </div>

                {/* Description Preview */}
                <p className="text-xs sm:text-sm text-muted-foreground mt-3.5 leading-relaxed line-clamp-2">
                  {item.description}
                </p>

                {/* Expandable Significance Box */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border/60 text-xs sm:text-sm space-y-2.5 animate-accordion-down">
                    <p className="text-foreground leading-relaxed">{item.description}</p>
                    <div className="p-3.5 rounded-2xl bg-saffron/10 dark:bg-saffron/15 border border-saffron/30 text-foreground font-medium leading-relaxed shadow-sm">
                      <span className="font-extrabold text-saffron block mb-1">Sacred Significance:</span>
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
