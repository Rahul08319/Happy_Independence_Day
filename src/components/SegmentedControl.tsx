import React, { useRef, useEffect, useState } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({
    left: 4,
    width: 0,
  });

  const activeIndex = options.findIndex((opt) => opt.id === value);

  useEffect(() => {
    if (!containerRef.current) return;
    const buttons = containerRef.current.querySelectorAll<HTMLButtonElement>("button[role='tab']");
    const activeButton = buttons[activeIndex];
    if (activeButton) {
      setIndicatorStyle({
        left: activeButton.offsetLeft,
        width: activeButton.offsetWidth,
      });
    }
  }, [activeIndex, options]);

  return (
    <div
      ref={containerRef}
      role="tablist"
      className={`relative inline-flex items-center p-1 rounded-2xl bg-black/[0.06] dark:bg-white/[0.08] backdrop-blur-xl border border-black/5 dark:border-white/10 select-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.06)] ${className}`}
    >
      {/* Sliding Active Pill Indicator */}
      <div
        aria-hidden="true"
        style={{
          transform: `translate3d(${indicatorStyle.left}px, 0, 0)`,
          width: indicatorStyle.width,
          transition: "transform 320ms cubic-bezier(0.16, 1, 0.3, 1), width 320ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className="pointer-events-none absolute top-1 bottom-1 left-0 rounded-xl bg-white dark:bg-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.08)] ring-1 ring-black/5 dark:ring-white/10"
      />

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
            className={`relative z-10 flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors duration-200 active:scale-[0.96] ${
              isActive
                ? "text-foreground font-bold"
                : "text-muted-foreground hover:text-foreground"
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
