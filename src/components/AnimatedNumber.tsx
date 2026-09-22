import React, { useEffect, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  padLength?: number;
  className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  padLength = 2,
  className = "",
}) => {
  const strValue = String(value).padStart(padLength, "0");
  const digits = strValue.split("");

  return (
    <span className={`inline-flex items-center overflow-hidden leading-none tabular-nums ${className}`}>
      {digits.map((digit, idx) => (
        <DigitRoll key={idx} digit={digit} />
      ))}
    </span>
  );
};

const DigitRoll = ({ digit }: { digit: string }) => {
  const [current, setCurrent] = useState(digit);
  const [prev, setPrev] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (digit !== current) {
      setPrev(current);
      setCurrent(digit);
      setAnimating(true);
      const timer = setTimeout(() => {
        setAnimating(false);
        setPrev(null);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [digit, current]);

  return (
    <span className="relative inline-block h-[1em] w-[0.62em] overflow-hidden text-center select-none">
      {/* Previous digit sliding out */}
      {animating && prev !== null && (
        <span
          className="absolute inset-0 flex items-center justify-center animate-digit-slide-out"
          aria-hidden="true"
        >
          {prev}
        </span>
      )}
      {/* Current digit sliding in */}
      <span
        className={`absolute inset-0 flex items-center justify-center ${
          animating ? "animate-digit-slide-in" : ""
        }`}
      >
        {current}
      </span>
    </span>
  );
};
