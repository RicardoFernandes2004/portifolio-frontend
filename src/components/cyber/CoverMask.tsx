"use client";

import { useEffect, useRef } from "react";

// Colocado dentro do hero: mede onde o proximo bloco (o conteudo que sobe) comeca
// e expoe em --cover no hero. A classe .hero-cover usa isso pra apagar o hero
// dali pra baixo, entao o conteudo "cobre" o video sem precisar de fundo opaco
// (e o TechBg global aparece continuo por baixo de tudo).
export function CoverMask() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const hero = ref.current?.parentElement;
    const cover = hero?.nextElementSibling;
    if (!hero || !cover) return;

    const update = () => {
      const edge = cover.getBoundingClientRect().top - hero.getBoundingClientRect().top;
      hero.style.setProperty("--cover", `${edge}px`);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return <span ref={ref} hidden />;
}
