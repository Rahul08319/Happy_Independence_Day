import React from "react";

interface RealisticFlagProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  waving?: boolean;
  withShadow?: boolean;
}

export const RealisticFlag: React.FC<RealisticFlagProps> = ({
  width = 160,
  height = 106,
  className = "",
  waving = true,
  withShadow = true,
}) => {
  return (
    <div
      style={{
        width,
        height,
        aspectRatio: "3 / 2",
        transformOrigin: "left center",
      }}
      className={`relative rounded-sm overflow-hidden select-none ${
        waving ? "flag-wave" : ""
      } ${withShadow ? "shadow-xl" : ""} ${className}`}
    >
      {/* ── Band 1: Kesari / Deep Saffron ── */}
      <div className="h-1/3 w-full bg-[#ff9933] relative">
        {/* Fabric weave grain */}
        <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:3px_3px]" />
      </div>

      {/* ── Band 2: Pure Silk White with Navy Ashoka Chakra ── */}
      <div className="h-1/3 w-full bg-[#ffffff] relative flex items-center justify-center">
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:3px_3px]" />

        {/* Ashoka Chakra */}
        <div className="relative z-10 w-[24%] h-[78%] flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full chakra-spin"
            aria-label="Ashoka Chakra"
          >
            <circle cx="50" cy="50" r="46" fill="none" stroke="#000080" strokeWidth="2.8" />
            <circle cx="50" cy="50" r="41" fill="none" stroke="#000080" strokeWidth="1" strokeDasharray="1.5 2" />
            <circle cx="50" cy="50" r="8.5" fill="#000080" />
            <circle cx="50" cy="50" r="4" fill="#ffffff" />
            {Array.from({ length: 24 }).map((_, i) => (
              <g key={i} transform={`rotate(${i * 15} 50 50)`}>
                <line x1="50" y1="50" x2="50" y2="7" stroke="#000080" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="50" cy="7" r="1.2" fill="#000080" />
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* ── Band 3: India Green ── */}
      <div className="h-1/3 w-full bg-[#138808] relative">
        <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:3px_3px]" />
      </div>

      {/* ── Realistic Silk Cloth Lighting & Shadow Ripple Overlay ── */}
      {waving && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 mix-blend-overlay opacity-75"
          style={{
            background:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.3) 25%, rgba(255,255,255,0.45) 50%, rgba(0,0,0,0.3) 75%, rgba(255,255,255,0.4) 100%)",
            backgroundSize: "200% 100%",
            animation: "silkRipple 3.5s linear infinite",
          }}
        />
      )}

      {/* Subtle Specular Sheen (Silk luster) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-white/15 to-transparent mix-blend-screen"
      />

      {/* Hoist cord border line on left */}
      <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-[2px] bg-gradient-to-b from-amber-200 via-white to-amber-200 opacity-90 shadow-sm" />
    </div>
  );
};
