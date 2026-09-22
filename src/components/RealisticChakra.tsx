import React, { useState } from "react";
import { sounds } from "@/lib/soundEffects";

interface RealisticChakraProps {
  size?: number;
  className?: string;
  hero?: boolean;
  interactive?: boolean;
}

export const RealisticChakra: React.FC<RealisticChakraProps> = ({
  size = 96,
  className = "",
  hero = false,
  interactive = true,
}) => {
  const [ripples, setRipples] = useState<number[]>([]);
  const [fastSpin, setFastSpin] = useState(false);

  const handleClick = () => {
    if (!interactive) return;
    sounds.playChakraPulse();
    setFastSpin(true);
    const id = Date.now();
    setRipples((prev) => [...prev, id]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r !== id));
    }, 1600);
    setTimeout(() => setFastSpin(false), 3000);
  };

  const id = React.useId();
  const goldGradId = `gold-grad-${id}`;
  const navyGradId = `navy-grad-${id}`;
  const rimGradId = `rim-grad-${id}`;
  const facetLightId = `facet-light-${id}`;
  const facetDarkId = `facet-dark-${id}`;

  return (
    <div
      onClick={handleClick}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={(e) => {
        if (interactive && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleClick();
        }
      }}
      className={`relative inline-flex items-center justify-center select-none ${
        interactive ? "cursor-pointer group" : ""
      } ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Expanding acoustic harmonic shockwaves on click */}
      {ripples.map((ripId) => (
        <span key={ripId} className="chakra-ripple-ring" />
      ))}

      {/* Ambient gold/navy back-glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#ff9933]/25 via-transparent to-[#138808]/20 blur-xl scale-125 opacity-70 group-hover:opacity-100 transition-opacity" />

      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        style={{
          animationDuration: fastSpin ? "3.2s" : hero ? "28s" : "20s",
          transition: "animation-duration 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          filter: "drop-shadow(0 4px 10px rgba(0, 0, 128, 0.35))",
        }}
        className={`${hero ? "chakra-spin-hero" : "chakra-spin"} transition-transform group-hover:scale-105`}
        aria-label="Ashoka Chakra Medallion"
      >
        <defs>
          {/* Metallic Gold Gradient for Rim */}
          <linearGradient id={goldGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="25%" stopColor="#ffd700" />
            <stop offset="50%" stopColor="#ca8a04" />
            <stop offset="75%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#a16207" />
          </linearGradient>

          {/* Deep Royal Navy Gradient */}
          <linearGradient id={navyGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="50%" stopColor="#000080" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Concentric Milled Rim Gradient */}
          <radialGradient id={rimGradId} cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="60%" stopColor="#000080" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          {/* 3D Chiseled Spoke Facet: Light Side */}
          <linearGradient id={facetLightId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>

          {/* 3D Chiseled Spoke Facet: Shadow Side */}
          <linearGradient id={facetDarkId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000080" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
        </defs>

        {/* ── Outer Brass/Gold Bezel Rim ── */}
        <circle cx="50" cy="50" r="48" fill="none" stroke={`url(#${goldGradId})`} strokeWidth="1.2" opacity="0.85" />

        {/* ── Main Royal Navy Tire Rim ── */}
        <circle cx="50" cy="50" r="45.5" fill="none" stroke={`url(#${navyGradId})`} strokeWidth="3" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="#ffffff" strokeWidth="0.6" opacity="0.6" strokeDasharray="1 1.5" />

        {/* ── 24 Perimeter Relief Beads ── */}
        {Array.from({ length: 24 }).map((_, i) => (
          <g key={`bead-${i}`} transform={`rotate(${i * 15} 50 50)`}>
            <circle cx="50" cy="5.8" r="1.2" fill={`url(#${goldGradId})`} />
            <circle cx="49.6" cy="5.4" r="0.4" fill="#ffffff" opacity="0.9" />
          </g>
        ))}

        {/* ── 24 Chiseled 3D Spokes ── */}
        {Array.from({ length: 24 }).map((_, i) => (
          <g key={`spoke-${i}`} transform={`rotate(${i * 15} 50 50)`}>
            {/* Left lit facet of spoke */}
            <path
              d="M 50 50 L 49.3 8 L 50 7.2 Z"
              fill={`url(#${facetLightId})`}
            />
            {/* Right shaded facet of spoke */}
            <path
              d="M 50 50 L 50.7 8 L 50 7.2 Z"
              fill={`url(#${facetDarkId})`}
            />
          </g>
        ))}

        {/* ── Inner Hub Ring ── */}
        <circle cx="50" cy="50" r="9.5" fill={`url(#${navyGradId})`} stroke={`url(#${goldGradId})`} strokeWidth="1" />

        {/* ── Domed Cabochon Central Hub with Specular Point Highlight ── */}
        <circle cx="50" cy="50" r="5" fill={`url(#${rimGradId})`} />
        <circle cx="48.5" cy="48.5" r="1.8" fill="#ffffff" opacity="0.85" />
      </svg>
    </div>
  );
};
