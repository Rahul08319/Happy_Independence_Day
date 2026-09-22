import { useEffect, useRef, useState } from "react";

export const CursorSpotlight = () => {
  const [mounted, setMounted] = useState(false);
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setMounted(true);

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const updatePosition = () => {
      // Smooth lerp for Apple-grade fluid lag
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;

      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      animId = requestAnimationFrame(updatePosition);
    };

    animId = requestAnimationFrame(updatePosition);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden print:hidden"
    >
      <div
        ref={spotlightRef}
        style={{
          width: 550,
          height: 550,
          marginLeft: -275,
          marginTop: -275,
          willChange: "transform",
        }}
        className="absolute rounded-full bg-[radial-gradient(circle,rgba(255,153,51,0.08)_0%,rgba(19,136,8,0.04)_40%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(255,153,51,0.12)_0%,rgba(0,120,255,0.05)_45%,transparent_70%)] mix-blend-screen filter blur-xl opacity-80 transition-opacity duration-300"
      />
    </div>
  );
};
