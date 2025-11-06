'use client';

import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  left: number;
  duration: number;
  delay: number;
  size: number;
  opacity: number;
}

export function Snowfall() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const flakes: Snowflake[] = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 10 + Math.random() * 20, // 10-30s
      delay: Math.random() * 10,
      size: 6 + Math.random() * 10, // 6-16px
      opacity: 0.3 + Math.random() * 0.7, // 0.3-1.0
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute text-white animate-fall"
          style={{
            left: `${flake.left}%`,
            fontSize: `${flake.size}px`,
            opacity: flake.opacity,
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
          }}
        >
          ❄️
        </div>
      ))}
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
          }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
    </div>
  );
}
