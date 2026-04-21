import { RecentWish } from "@/lib/wishUtils";
import { Button } from "@/components/ui/button";
import { Clock, X, RotateCcw } from "lucide-react";

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
    <section className="mt-12 fade-up print:hidden" style={{ animationDelay: "0.4s" }}>
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Recent wishes on this device
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {wishes.map((w) => (
            <div
              key={w.id}
              className="group relative rounded-2xl bg-card/80 backdrop-blur border border-border shadow-card p-4 hover:shadow-elegant transition-shadow"
            >
              <button
                aria-label="Remove"
                onClick={() => onRemove(w.id)}
                className="absolute top-2 right-2 h-7 w-7 rounded-full bg-muted/80 hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <p className="text-xs text-muted-foreground">{formatTime(w.createdAt)}</p>
              <p className="mt-1 font-bold text-foreground truncate pr-8">{w.name}</p>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{w.message}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onOpen(w)}
                className="mt-3 h-8 text-xs"
              >
                <RotateCcw className="h-3 w-3" /> Reopen
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
