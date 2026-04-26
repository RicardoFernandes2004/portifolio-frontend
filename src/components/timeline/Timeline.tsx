import { CyberCard } from "@/components/cyber/CyberCard";
import { Chip } from "@/components/cyber/Chip";
import { formatDateRange } from "@/lib/utils";

export interface TimelineItem {
  id: number | string;
  title: string;
  subtitle: string;
  description?: string;
  startDate?: string | null;
  endDate?: string | null;
  current?: boolean;
}

export function Timeline({ items, accent = "cyan" }: { items: TimelineItem[]; accent?: "cyan" | "magenta" }) {
  if (items.length === 0) {
    return (
      <CyberCard variant="purple">
        <div className="p-10 text-center">
          <p className="font-mono text-sm text-fg-muted terminal-prompt">
            sem registros.
          </p>
        </div>
      </CyberCard>
    );
  }

  const dotClass =
    accent === "magenta"
      ? "bg-neon-magenta shadow-neon-magenta"
      : "bg-neon-cyan shadow-neon-cyan";

  return (
    <ol className="relative space-y-8 pl-8 md:pl-10 border-l border-dashed border-border">
      {items.map((item) => (
        <li key={item.id} className="relative">
          <span
            className={`absolute -left-[37px] md:-left-[45px] top-2 h-3 w-3 rounded-full ${dotClass}`}
            aria-hidden
          />
          <CyberCard variant={accent === "magenta" ? "magenta" : "cyan"} hoverable>
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-display text-lg font-bold text-fg">
                    {item.title}
                  </h3>
                  <p
                    className={
                      accent === "magenta"
                        ? "font-mono text-sm text-neon-magenta"
                        : "font-mono text-sm text-neon-cyan"
                    }
                  >
                    {item.subtitle}
                  </p>
                </div>
                <Chip variant={item.endDate ? "cyan" : "green"}>
                  {formatDateRange(item.startDate, item.endDate)}
                </Chip>
              </div>
              {item.description && (
                <p className="font-body text-sm text-fg-dim whitespace-pre-line">
                  {item.description}
                </p>
              )}
            </div>
          </CyberCard>
        </li>
      ))}
    </ol>
  );
}
