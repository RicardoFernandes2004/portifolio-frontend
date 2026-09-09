export function Scanlines() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 -z-[5] opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 3px)",
        }}
      />
      <div className="pointer-events-none fixed inset-x-0 -z-[4] h-[80px] bg-gradient-to-b from-transparent via-neon-cyan/10 to-transparent animate-scan" />
    </>
  );
}
