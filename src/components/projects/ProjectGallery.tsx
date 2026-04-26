"use client";

import { useState } from "react";
import { CyberCard } from "@/components/cyber/CyberCard";
import { cn } from "@/lib/utils";

export function ProjectGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  if (images.length === 0) return null;
  const main = images[active];
  return (
    <section className="space-y-4">
      <CyberCard variant="cyan">
        <div className="relative aspect-video overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={main}
            alt={`${title} ${active + 1}`}
            className="h-full w-full object-cover"
          />
          <div className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-widest text-neon-cyan bg-bg-deep/70 px-2 py-1 cyber-clip-sm border border-neon-cyan/40">
            frame {active + 1}/{images.length}
          </div>
        </div>
      </CyberCard>
      {images.length > 1 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {images.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-video overflow-hidden border transition-all cyber-clip-sm",
                i === active
                  ? "border-neon-cyan shadow-neon-cyan"
                  : "border-border hover:border-neon-magenta",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
