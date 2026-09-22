import React, { useState, useRef, useCallback } from "react";

interface CardTiltProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
}

export const CardTilt: React.FC<CardTiltProps> = ({
  children,
  className = "",
  maxTilt = 7,
  scale = 1.02,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>(
    "perspective(1400px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
  );
  const [boxShadow, setBoxShadow] = useState<string>(
    "0 20px 45px -12px rgba(0, 0, 0, 0.18)"
  );
  const [glarePosition, setGlarePosition] = useState<{
    x: number;
    y: number;
    opacity: number;
  }>({
    x: 50,
    y: 50,
    opacity: 0,
  });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (-maxTilt to +maxTilt)
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      // Realistic physical directional shadow (shadow moves opposite to tilt)
      const shadowX = (-rotateY * 2.8).toFixed(1);
      const shadowY = (rotateX * 2.8 + 26).toFixed(1);
      const shadowBlur = (
        Math.abs(rotateX) * 2 +
        Math.abs(rotateY) * 2 +
        38
      ).toFixed(1);

      // Glare position in percentages
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      setTransform(
        `perspective(1400px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(
          2
        )}deg) scale3d(${scale}, ${scale}, ${scale})`
      );
      setBoxShadow(
        `${shadowX}px ${shadowY}px ${shadowBlur}px -10px rgba(0, 0, 0, 0.28), 0 10px 20px -5px rgba(255, 153, 51, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.4)`
      );
      setGlarePosition({ x: glareX, y: glareY, opacity: 0.3 });
    },
    [maxTilt, scale]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smooth physical settle back to rest position
    setTransform(
      "perspective(1400px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
    );
    setBoxShadow("0 20px 45px -12px rgba(0, 0, 0, 0.18)");
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        boxShadow,
        transition: isHovered
          ? "transform 75ms ease-out, box-shadow 75ms ease-out"
          : "transform 550ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 550ms cubic-bezier(0.16, 1, 0.3, 1)",
        transformStyle: "preserve-3d",
        willChange: "transform, box-shadow",
      }}
      className={`relative group ${className}`}
    >
      {children}

      {/* Dynamic Specular Light Glare Layer */}
      <div
        aria-hidden="true"
        style={{
          background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, ${glarePosition.opacity}) 0%, rgba(255, 215, 0, ${
            glarePosition.opacity * 0.4
          }) 30%, transparent 68%)`,
          transition: "opacity 280ms ease-out",
        }}
        className="pointer-events-none absolute inset-0 rounded-3xl z-30 mix-blend-overlay print:hidden"
      />

      {/* Subtle Beveled Glass Edge Refraction */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl z-30 border border-white/20 dark:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)] print:hidden"
      />
    </div>
  );
};
