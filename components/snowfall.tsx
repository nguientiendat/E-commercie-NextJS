"use client";

import { useEffect, useState } from "react";

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  opacity: number;
  size: number;
}

export function Snowfall() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    // Generate 50 snowflakes with random properties
    const flakes: Snowflake[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // Random horizontal position (0-100%)
      animationDuration: Math.random() * 3 + 2, // Random fall duration (2-5 seconds)
      opacity: Math.random() * 0.6 + 0.4, // Random opacity (0.4-1)
      size: Math.random() * 4 + 2, // Random size (2-6px)
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute animate-fall"
          style={{
            left: `${flake.left}%`,
            animationDuration: `${flake.animationDuration}s`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: flake.opacity,
          }}
        >
          <div
            className="rounded-full bg-white"
            style={{
              width: `${flake.size}px`,
              height: `${flake.size}px`,
              boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
            }}
          />
        </div>
      ))}
    </div>
  );
}
