import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Music, Play, Pause } from "lucide-react";

interface AudioDockProps {
  src?: string;
}

export const AudioDock = ({ src = "/vandemataram.mp3" }: AudioDockProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;

    // Polite attempt on first user click or touch anywhere on the page
    const handleFirstGesture = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Autoplay was prevented by browser policy, user will press play
        });
      }
    };

    window.addEventListener("pointerdown", handleFirstGesture, { once: true });
    window.addEventListener("keydown", handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
    };
  }, [hasInteracted, volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setHasInteracted(true);
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn("Audio play prevented:", err);
      });
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    const nextMute = !isMuted;
    audio.muted = nextMute;
    setIsMuted(nextMute);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="fixed bottom-5 right-5 z-50 print:hidden">
        <div
          onClick={togglePlay}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              togglePlay();
            }
          }}
          className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-full backdrop-blur-xl border transition-all duration-300 cursor-pointer shadow-lg select-none ${
            isPlaying
              ? "bg-slate-900/90 text-white border-amber-400/40 ring-2 ring-saffron/30 shadow-amber-500/10"
              : "bg-white/85 dark:bg-slate-900/85 text-slate-700 dark:text-slate-200 border-border/70 hover:border-saffron/50"
          }`}
          title={isPlaying ? "Click to pause Vande Mataram" : "Click to play patriotic anthem"}
        >
          {/* Play/Pause Button Icon */}
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
              isPlaying
                ? "bg-gradient-to-r from-saffron to-amber-500 text-white shadow-md shadow-saffron/30"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
            )}
          </div>

          {/* Sound Bars Animation */}
          <div className="flex items-center gap-0.5 h-4">
            <span
              className={`w-0.5 rounded-full bg-saffron transition-all ${
                isPlaying ? "sound-bar-1" : "h-1"
              }`}
            />
            <span
              className={`w-0.5 rounded-full bg-white dark:bg-slate-200 transition-all ${
                isPlaying ? "sound-bar-2" : "h-2"
              }`}
            />
            <span
              className={`w-0.5 rounded-full bg-india-green transition-all ${
                isPlaying ? "sound-bar-3" : "h-1.5"
              }`}
            />
            <span
              className={`w-0.5 rounded-full bg-blue-500 transition-all ${
                isPlaying ? "sound-bar-4" : "h-1"
              }`}
            />
          </div>

          {/* Track Info */}
          <div className="flex flex-col text-left pr-1">
            <span className="text-[11px] font-bold leading-tight flex items-center gap-1">
              <span>Vande Mataram</span>
              <span className="inline-block text-[10px]">🇮🇳</span>
            </span>
            <span className="text-[9px] text-muted-foreground leading-none">
              {isPlaying ? "National Song" : "Tap to Play"}
            </span>
          </div>

          {/* Mute/Unmute quick trigger */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
            className="ml-1 p-1 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-muted-foreground hover:text-foreground transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};
