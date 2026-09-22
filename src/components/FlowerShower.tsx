import { useEffect, useRef } from "react";
import { sounds } from "@/lib/soundEffects";

interface Petal {
  x: number;
  y: number;
  size: number;
  color: string;
  type: "rose" | "marigold" | "tricolor";
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  flip: number;
  flipSpeed: number;
  opacity: number;
}

// Global emitter so any component can trigger a flower shower
type Listener = () => void;
const listeners: Listener[] = [];

export const triggerFlowerShower = () => {
  sounds.playFlowerShower();
  listeners.forEach((fn) => fn());
};

export const FlowerShower = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const petals: Petal[] = [];

    const flowerColors = {
      marigold: ["#FFA500", "#FFB703", "#FB8500", "#FFC300"],
      rose: ["#E63946", "#D90429", "#EF233C", "#FF4D6D"],
      tricolor: ["#FF9933", "#FFFFFF", "#138808"],
    };

    const spawnPetals = (count: number, startY: number = -20) => {
      for (let i = 0; i < count; i++) {
        const types: ("rose" | "marigold" | "tricolor")[] = ["marigold", "marigold", "rose", "tricolor"];
        const type = types[Math.floor(Math.random() * types.length)];
        const colorPalette = flowerColors[type];
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];

        petals.push({
          x: Math.random() * width,
          y: startY === -20 ? -Math.random() * 80 - 10 : startY + (Math.random() - 0.5) * 50,
          size: Math.random() * 9 + 8,
          color,
          type,
          vx: (Math.random() - 0.5) * 1.5,
          vy: Math.random() * 1.8 + 1.2,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.04,
          flip: Math.random() * Math.PI,
          flipSpeed: Math.random() * 0.05 + 0.02,
          opacity: Math.random() * 0.3 + 0.7,
        });
      }
    };

    // Initial ambient gentle petals
    spawnPetals(18);

    const onTrigger = () => {
      spawnPetals(55, -10);
    };

    listeners.push(onTrigger);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.02;

      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];

        // Horizontal flutter via sine wave simulation of wind
        p.x += p.vx + Math.sin(time + p.y * 0.01) * 0.8;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.flip += p.flipSpeed;

        // Draw petal with 3D perspective squish
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(1, Math.cos(p.flip));
        ctx.globalAlpha = p.opacity;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        // Curving organic petal shape
        ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
        ctx.fill();

        // Subtle petal vein highlight
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.6);
        ctx.lineTo(0, p.size * 0.6);
        ctx.stroke();

        ctx.restore();

        // If petal fell out of bottom
        if (p.y > height + 20) {
          // If total petals > 25, remove extra burst petals
          if (petals.length > 25) {
            petals.splice(i, 1);
          } else {
            // Recycle ambient petal to top
            p.y = -20;
            p.x = Math.random() * width;
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      const idx = listeners.indexOf(onTrigger);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 opacity-90 print:hidden"
    />
  );
};
