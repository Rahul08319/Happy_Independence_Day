import React from "react";
import { sounds } from "@/lib/soundEffects";

export interface SegmentedOption<T extends string> {
  id: T;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (val: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = "",
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      className={`inline-flex items-center p-1 rounded-2xl bg-black/[0.06] dark:bg-white/[0.08] backdrop-blur-md border border-black/5 dark:border-white/10 select-none ${className}`}
    >
      {options.map((opt) => {
        const isActive = value === opt.id;
        return (
          <button
            key={opt.id}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => {
              if (!isActive) {
                sounds.playTap();
                onChange(opt.id);
              }
            }}
            className={`relative flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-[0.96] ${
              isActive
                ? "bg-white dark:bg-slate-800 text-foreground shadow-[0_2px_8px_rgba(0,0,0,0.12)] font-bold ring-1 ring-black/5 dark:ring-white/10"
                : "text-muted-foreground hover:text-foreground hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
            }`}
          >
            {opt.icon && <span className="shrink-0">{opt.icon}</span>}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
