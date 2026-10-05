"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

// Fundo animado "placa de video": trilhas de circuito com pacotes de dados
// correndo + um grafo de nos que se conectam (e se ligam ao cursor).

type Pt = { x: number; y: number };
type Trace = { pts: Pt[]; cum: number[]; len: number };
type Packet = { t: Trace; d: number; speed: number; color: string };
type Node = { x: number; y: number; vx: number; vy: number; flash: number };
type Pulse = { a: Node; b: Node; p: number };

const CYAN = "0,240,255";
const MAGENTA = "255,43,214";
const PURPLE = "123,44,255";
const GRID = 24;
const LINK = 150;
const MOUSE_LINK = 200;

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const snap = (v: number) => Math.round(v / GRID) * GRID;

// 8 direcoes; trilhas so viram em 45 graus, como em PCB.
const DIRS: Pt[] = [
  { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }, { x: -1, y: 1 },
  { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
];

function makeTrace(start: Pt, dir: number): Trace {
  const pts = [start];
  let p = start;
  let d = dir;
  for (let s = 0, n = Math.floor(rand(2, 5)); s < n; s++) {
    const steps = Math.floor(rand(2, 7));
    p = { x: p.x + DIRS[d].x * GRID * steps, y: p.y + DIRS[d].y * GRID * steps };
    pts.push(p);
    d = (d + (Math.random() < 0.5 ? 1 : 7)) % 8;
  }
  const cum = [0];
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  }
  return { pts, cum, len: cum[cum.length - 1] };
}

function pointAt(t: Trace, d: number): Pt {
  let i = 1;
  while (i < t.cum.length - 1 && t.cum[i] < d) i++;
  const a = t.pts[i - 1];
  const b = t.pts[i];
  const k = (d - t.cum[i - 1]) / (t.cum[i] - t.cum[i - 1] || 1);
  return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
}

// Desenha chips + trilhas uma vez num canvas offscreen; por frame so copia.
function buildBoard(w: number, h: number, dpr: number) {
  const traces: Trace[] = [];
  const board = document.createElement("canvas");
  board.width = w * dpr;
  board.height = h * dpr;
  const g = board.getContext("2d")!;
  g.scale(dpr, dpr);

  const chips = Math.max(2, Math.round((w * h) / 400_000));
  for (let c = 0; c < chips; c++) {
    const cw = snap(rand(96, 168));
    const ch = snap(rand(72, 144));
    const x = snap(rand(GRID, w - cw - GRID));
    const y = snap(rand(GRID, h - ch - GRID));

    g.strokeStyle = `rgba(${PURPLE},0.35)`;
    g.fillStyle = "rgba(12,6,28,0.6)";
    g.lineWidth = 1;
    g.fillRect(x, y, cw, ch);
    g.strokeRect(x, y, cw, ch);
    g.strokeStyle = `rgba(${CYAN},0.15)`;
    g.strokeRect(x + 10, y + 10, cw - 20, ch - 20);

    // pinos nas 4 bordas; alguns viram trilhas saindo do chip
    const sides: [Pt, Pt, number][] = [
      [{ x, y }, { x: cw, y: 0 }, 6],
      [{ x, y: y + ch }, { x: cw, y: 0 }, 2],
      [{ x, y }, { x: 0, y: ch }, 4],
      [{ x: x + cw, y }, { x: 0, y: ch }, 0],
    ];
    for (const [o, span, dir] of sides) {
      const count = Math.floor((span.x + span.y) / 12);
      for (let i = 1; i < count; i++) {
        const k = i / count;
        const pin = { x: o.x + span.x * k, y: o.y + span.y * k };
        g.fillStyle = `rgba(${CYAN},0.3)`;
        g.fillRect(pin.x - 1, pin.y - 1, 2 + DIRS[dir].x * 3, 2 + DIRS[dir].y * 3);
        if (Math.random() < 0.35) traces.push(makeTrace(pin, dir));
      }
    }
  }

  const free = Math.round((w * h) / 30_000);
  for (let i = 0; i < free; i++) {
    traces.push(makeTrace({ x: snap(rand(0, w)), y: snap(rand(0, h)) }, Math.floor(rand(0, 8))));
  }

  for (const t of traces) {
    g.strokeStyle = Math.random() < 0.7 ? `rgba(${CYAN},0.12)` : `rgba(${PURPLE},0.2)`;
    g.lineWidth = 1.2;
    g.beginPath();
    t.pts.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)));
    g.stroke();
    const end = t.pts[t.pts.length - 1];
    g.strokeStyle = `rgba(${CYAN},0.3)`;
    g.beginPath();
    g.arc(end.x, end.y, 2.5, 0, Math.PI * 2);
    g.stroke();
  }

  return { board, traces };
}

// Paginas de leitura (post / projeto aberto): so a placa, parada e nas bordas,
// pra nao distrair do texto.
const READING = /^\/(blog|projects)\/[^/]+/;

export function TechBg({ className }: { className?: string }) {
  const calm = READING.test(usePathname());
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const still =
      calm || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let board: HTMLCanvasElement;
    let traces: Trace[] = [];
    let packets: Packet[] = [];
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let mouse: Pt | null = null;
    let visible = true;
    let raf = 0;

    const spawnPacket = (): Packet => ({
      t: pick(traces),
      d: 0,
      speed: rand(1.2, 3.2),
      color: Math.random() < 0.65 ? CYAN : MAGENTA,
    });

    const setup = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ({ board, traces } = buildBoard(w, h, dpr));
      packets = Array.from({ length: Math.min(36, traces.length) }, () => {
        const p = spawnPacket();
        p.d = rand(0, p.t.len);
        return p;
      });
      // ponytail: grafo O(n^2); n limitado a 90, entao ok
      const n = Math.min(90, Math.round((w * h) / 16_000));
      nodes = Array.from({ length: n }, () => ({
        x: rand(0, w),
        y: rand(0, h),
        vx: rand(-0.25, 0.25),
        vy: rand(-0.25, 0.25),
        flash: 0,
      }));
      pulses = [];
    };

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(board, 0, 0, w, h);
      if (calm) return;
      ctx.globalCompositeOperation = "lighter";

      // pacotes de dados nas trilhas, com rastro
      for (const p of packets) {
        p.d += p.speed;
        if (p.d > p.t.len) Object.assign(p, spawnPacket());
        for (let i = 0; i < 8; i++) {
          const d = p.d - i * 3;
          if (d < 0) break;
          const q = pointAt(p.t, d);
          ctx.fillStyle = `rgba(${p.color},${(1 - i / 8) * 0.8})`;
          ctx.beginPath();
          ctx.arc(q.x, q.y, i ? 1.4 : 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // grafo: nos derivando, arestas por proximidade
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        n.flash *= 0.94;
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist > LINK) continue;
          ctx.strokeStyle = `rgba(${CYAN},${(1 - dist / LINK) * 0.3})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          if (Math.random() < 0.0008) pulses.push({ a, b, p: 0 });
        }
        if (mouse) {
          const dist = Math.hypot(a.x - mouse.x, a.y - mouse.y);
          if (dist < MOUSE_LINK) {
            ctx.strokeStyle = `rgba(${MAGENTA},${(1 - dist / MOUSE_LINK) * 0.6})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
            a.x += (mouse.x - a.x) * 0.002;
            a.y += (mouse.y - a.y) * 0.002;
          }
        }
      }

      // pulsos correndo pelas arestas; acende o no de destino
      pulses = pulses.filter((s) => {
        s.p += 0.025;
        if (s.p >= 1) {
          s.b.flash = 1;
          return false;
        }
        const x = s.a.x + (s.b.x - s.a.x) * s.p;
        const y = s.a.y + (s.b.y - s.a.y) * s.p;
        ctx.fillStyle = `rgba(${MAGENTA},0.9)`;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

      for (const n of nodes) {
        ctx.fillStyle = `rgba(${n.flash > 0.1 ? MAGENTA : CYAN},${0.5 + n.flash * 0.5})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.6 + n.flash * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
    };

    const loop = () => {
      if (visible) frame();
      raf = requestAnimationFrame(loop);
    };

    setup();
    if (still) frame();
    else raf = requestAnimationFrame(loop);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setup();
        if (still) frame();
      }, 150);
    };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => (mouse = null);
    // nao gasta frame quando o canvas esta fora da tela
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [calm]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none block h-full w-full transition-opacity duration-700",
        calm &&
          "opacity-50 [mask-image:radial-gradient(ellipse_at_center,transparent_40%,black_85%)]",
        className,
      )}
    />
  );
}
