import { RecentWish, CARD_THEMES } from "@/lib/wishUtils";
import { Button } from "@/components/ui/button";
import { Sparkles, X, RotateCcw, User, Heart } from "lucide-react";

interface Props {
  wishes: RecentWish[];
  onOpen: (w: RecentWish) => void;
  onRemove: (id: string) => void;
}

const formatTime = (ts: number) => {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

export const RecentWishes = ({ wishes, onOpen, onRemove }: Props) => {
  if (wishes.length === 0) return null;

  return (
    <section className="mt-16 fade-up print:hidden" style={{ animationDelay: "0.4s" }}>
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between mb-5 px-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-saffron/15 dark:bg-saffron/25 flex items-center justify-center text-saffron">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-foreground">
                Your Created Wishes
              </h3>
              <p className="text-xs text-muted-foreground">
                Recently personalised and saved on this device
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-saffron/10 text-saffron border border-saffron/20">
            {wishes.length} saved
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {wishes.map((w) => {
            const themeConfig = w.theme ? CARD_THEMES[w.theme] : CARD_THEMES.royal;
            return (
              <div
                key={w.id}
                className="group relative rounded-2xl bg-card/85 backdrop-blur-md border border-border/80 p-4 hover:border-saffron/40 hover:shadow-elegant transition-all duration-300 flex flex-col justify-between"
              >
                {/* Delete button */}
                <button
                  type="button"
                  aria-label="Remove wish"
                  onClick={() => onRemove(w.id)}
                  className="absolute top-3 right-3 h-7 w-7 rounded-full bg-muted/70 hover:bg-destructive hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                  title="Remove from history"
                >
                  <X className="h-3.5 w-3.5" />
                </button>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
                      <User className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-bold text-sm text-foreground truncate pr-6">
                      {w.name}
                    </span>
                    <span className="ml-auto text-[10px] text-muted-foreground font-mono">
                      {formatTime(w.createdAt)}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed pl-1 italic">
                    "{w.message}"
                  </p>
                </div>

                <div className="mt-3.5 pt-3 border-t border-border/50 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/80">
                    {themeConfig?.name || "Tricolor"}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onOpen(w)}
                    className="h-7 px-3 text-xs font-medium gap-1.5 rounded-full border-border hover:border-saffron hover:bg-saffron/10 hover:text-saffron transition-colors"
                  >
                    <RotateCcw className="h-3 w-3" /> Re-open Card
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
