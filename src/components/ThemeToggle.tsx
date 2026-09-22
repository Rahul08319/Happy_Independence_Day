import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial preference from localStorage or system
    const saved = localStorage.getItem("indy_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = saved === "dark" || (!saved && prefersDark);

    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggle = () => {
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

  return (
    <button
      onClick={toggle}
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed top-4 right-4 z-40 h-10 w-10 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-border/80 shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-slate-700 dark:text-slate-200 hover:border-saffron/50 print:hidden"
      title={isDark ? "Switch to Royal Light Theme" : "Switch to Midnight Theme"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 rotate-0 transition-all duration-300" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 -rotate-90 dark:rotate-0 transition-all duration-300" />
      )}
    </button>
  );
};
