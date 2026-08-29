import type { ScheduleData } from "@/lib/parseCoachMessage";

export function ScheduleCard({ data }: { data: ScheduleData }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-accent/20 bg-surface-2">
      <div className="border-b border-white/10 bg-accent-soft px-4 py-3">
        <p className="font-display text-sm font-bold text-foreground">{data.title}</p>
      </div>
      <div className="divide-y divide-white/5">
        {data.days.map((day, index) => (
          <div key={index} className="flex items-start gap-3 px-4 py-3">
            <span className="w-10 shrink-0 pt-0.5 text-xs font-semibold uppercase tracking-wide text-accent">
              {day.day}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground">{day.training || "Rest"}</p>
              {day.supplements && day.supplements.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {day.supplements.map((supplement, si) => (
                    <span
                      key={si}
                      className="rounded-full bg-surface px-2 py-0.5 text-[11px] text-muted"
                    >
                      {supplement}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ScheduleLoadingCard() {
  return (
    <div className="flex w-full items-center gap-2 rounded-2xl border border-white/10 bg-surface-2 px-4 py-3 text-sm text-muted">
      <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-accent" />
      Building your schedule…
    </div>
  );
}
