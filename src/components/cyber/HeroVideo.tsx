"use client";

import { useEffect, useRef } from "react";

// Fundo em video do hero. A regra global de prefers-reduced-motion so zera
// animacoes CSS; <video autoPlay> continua rodando, entao pausa aqui.
export function HeroVideo({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ref.current?.pause();
    }
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src="/hero.mp4"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden
    />
  );
}
