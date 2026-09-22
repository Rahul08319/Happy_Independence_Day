import { useEffect, useRef } from "react";
import { sounds } from "@/lib/soundEffects";

interface Petal {
  x: number;
  y: number;
  size: number;
  kind: "marigold" | "rose" | "mogra" | "tricolor-green";
  vx: number;
  vy: number;
  // Aerodynamic oscillations
  swingAngle: number;
  swingSpeed: number;
  swingAmplitude: number;
  // 3D rotations
  rotation: number;
  rotationSpeed: number;
  pitch: number;
  pitchSpeed: number;
  opacity: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
}

type Listener = () => void;
const listeners: Listener[] = [];

export const triggerFlowerShower = () => {
  sounds.playFlowerShower();
  listeners.forEach((fn) => fn());
};

export const RealisticPetalCanvas = () => {
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

    const createPetal = (startY = -30): Petal => {
      const kinds: ("marigold" | "rose" | "mogra" | "tricolor-green")[] = [
        "marigold",
        "marigold",
        "rose",
        "rose",
        "mogra",
        "tricolor-green",
      ];
      const kind = kinds[Math.floor(Math.random() * kinds.length)];
      const size = kind === "rose" ? Math.random() * 10 + 12 : Math.random() * 9 + 10;

      return {
        x: Math.random() * width,
        y: startY === -30 ? -Math.random() * 120 - 20 : startY + (Math.random() - 0.5) * 60,
        size,
        kind,
        vx: (Math.random() - 0.5) * 0.8,
        vy: Math.random() * 1.4 + 1.1,
        swingAngle: Math.random() * Math.PI * 2,
        swingSpeed: Math.random() * 0.03 + 0.02,
        swingAmplitude: Math.random() * 1.8 + 1.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        pitch: Math.random() * Math.PI * 2,
        pitchSpeed: Math.random() * 0.04 + 0.02,
        opacity: Math.random() * 0.25 + 0.75,
        shadowOffsetX: Math.random() * 4 + 2,
        shadowOffsetY: Math.random() * 6 + 4,
      };
    };

    // Initial ambient gentle petals
    for (let i = 0; i < 22; i++) {
      petals.push(createPetal(-Math.random() * height));
    }

    const onTrigger = () => {
      // Grand celebratory shower
      for (let i = 0; i < 60; i++) {
        petals.push(createPetal(-10));
      }
    };

    listeners.push(onTrigger);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    let isTabActive = true;
    const handleVisibilityChange = () => {
      isTabActive = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    /* ─── Draw Realistic Petal Geometry with Natural Shading ─── */
    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      // 3D pitch perspective (scale Y simulates tilt angle)
      const pitchScale = Math.sin(p.pitch);
      const absPitch = Math.abs(pitchScale);
      ctx.scale(1, Math.max(0.08, absPitch));

      // Real light illumination: top face vs bottom face shading
      const isTopFace = pitchScale > 0;
      ctx.globalAlpha = p.opacity;

      const s = p.size;

      if (p.kind === "marigold") {
        // ── Real Marigold (Genda Phool) Petal ──
        // Elongated ruffled teardrop petal with warm fiery gradient
        const grad = ctx.createLinearGradient(0, -s, 0, s);
        if (isTopFace) {
          grad.addColorStop(0, "#ffea00"); // bright golden yellow tip
          grad.addColorStop(0.35, "#ffb300"); // saffron gold
          grad.addColorStop(0.75, "#fb8500"); // rich amber
          grad.addColorStop(1, "#d9480f"); // deep saffron base
        } else {
          // Bottom face with subsurface translucency
          grad.addColorStop(0, "#f59e0b");
          grad.addColorStop(0.5, "#d97706");
          grad.addColorStop(1, "#b45309");
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        // Slender curved petal with ruffled tip
        ctx.moveTo(0, s * 0.85); // narrow base
        ctx.bezierCurveTo(-s * 0.45, s * 0.4, -s * 0.55, -s * 0.4, -s * 0.35, -s * 0.85);
        // Ruffled scalloped tip (natural marigold petal signature)
        ctx.quadraticCurveTo(-s * 0.15, -s * 0.95, 0, -s * 0.88);
        ctx.quadraticCurveTo(s * 0.15, -s * 0.95, s * 0.35, -s * 0.85);
        ctx.bezierCurveTo(s * 0.55, -s * 0.4, s * 0.45, s * 0.4, 0, s * 0.85);
        ctx.closePath();
        ctx.fill();

        // Realistic central vein crease
        ctx.strokeStyle = isTopFace ? "rgba(255, 255, 255, 0.35)" : "rgba(0, 0, 0, 0.15)";
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.7);
        ctx.lineTo(0, -s * 0.75);
        ctx.stroke();
      } else if (p.kind === "rose") {
        // ── Real Velvet Rose Petal ──
        // Cupped heart/scallop with deep crimson ruby gradients
        const grad = ctx.createRadialGradient(0, s * 0.2, 0, 0, 0, s * 0.9);
        if (isTopFace) {
          grad.addColorStop(0, "#b91c1c"); // deep ruby base
          grad.addColorStop(0.6, "#e11d48"); // velvety crimson
          grad.addColorStop(0.9, "#f43f5e"); // vibrant rose
          grad.addColorStop(1, "#fda4af"); // soft pink curved edge highlight
        } else {
          grad.addColorStop(0, "#881337");
          grad.addColorStop(0.7, "#be123c");
          grad.addColorStop(1, "#e11d48");
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.75);
        // Rounded velvety heart contour
        ctx.bezierCurveTo(-s * 0.65, s * 0.35, -s * 0.75, -s * 0.3, -s * 0.35, -s * 0.75);
        ctx.bezierCurveTo(-s * 0.15, -s * 0.9, 0, -s * 0.8, 0, -s * 0.8);
        ctx.bezierCurveTo(0, -s * 0.8, s * 0.15, -s * 0.9, s * 0.35, -s * 0.75);
        ctx.bezierCurveTo(s * 0.75, -s * 0.3, s * 0.65, s * 0.35, 0, s * 0.75);
        ctx.closePath();
        ctx.fill();

        // Translucent edge curl highlight
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 0.6;
        ctx.stroke();
      } else if (p.kind === "mogra") {
        // ── Real Mogra / Jasmine Petal (White Silk) ──
        const grad = ctx.createLinearGradient(0, -s, 0, s);
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(0.7, "#fefce8");
        grad.addColorStop(1, "#ecfccb");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(0, 0, s * 0.38, s * 0.75, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      } else {
        // ── India Green Leaf Petal ──
        const grad = ctx.createLinearGradient(0, -s, 0, s);
        grad.addColorStop(0, "#22c55e");
        grad.addColorStop(0.5, "#15803d");
        grad.addColorStop(1, "#14532d");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.75);
        ctx.quadraticCurveTo(-s * 0.4, 0, 0, -s * 0.8);
        ctx.quadraticCurveTo(s * 0.4, 0, 0, s * 0.75);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    };

    /* ─── Physics Loop ─── */
    const render = () => {
      if (isTabActive) {
        ctx.clearRect(0, 0, width, height);

        for (let i = petals.length - 1; i >= 0; i--) {
          const p = petals[i];

          // Aerodynamic aerodynamic flutter:
          p.swingAngle += p.swingSpeed;
          const horizontalFlutter = Math.sin(p.swingAngle) * p.swingAmplitude;

          // Drag effect: when falling face-flat, fall slower; when edge-on, fall faster
          const orientationDrag = 1 - Math.abs(Math.sin(p.pitch)) * 0.35;
          p.y += p.vy * orientationDrag;
          p.x += p.vx + horizontalFlutter;

          // Tumbling dynamics
          p.rotation += p.rotationSpeed;
          p.pitch += p.pitchSpeed;

          drawPetal(p);

          // Recycle or remove when past bottom
          if (p.y > height + 40) {
            if (petals.length > 25) {
              petals.splice(i, 1);
            } else {
              p.y = -30;
              p.x = Math.random() * width;
            }
          }
        }
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      const idx = listeners.indexOf(onTrigger);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 opacity-95 print:hidden"
    />
  );
};
