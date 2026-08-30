"use client";

import { useState } from "react";
import Link from "next/link";
import type { ScheduleData } from "@/lib/parseCoachMessage";

export function ScheduleCard({
  data,
  onAddToCalendar,
}: {
  data: ScheduleData;
  onAddToCalendar?: (schedule: ScheduleData) => Promise<{ ok: boolean }>;
}) {
  const [status, setStatus] = useState<"idle" | "saving" | "added" | "error">("idle");

  async function handleAdd() {
    if (!onAddToCalendar) return;
    setStatus("saving");
    try {
      const result = await onAddToCalendar(data);
      setStatus(result.ok ? "added" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-accent/20 bg-surface-2">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-accent-soft px-4 py-3">
        <p className="font-display text-sm font-bold text-foreground">{data.title}</p>
        {onAddToCalendar &&
          (status === "added" ? (
            <Link
              href="/calendar"
              className="flex h-7 shrink-0 items-center justify-center rounded-full bg-accent px-3 text-xs font-bold text-accent-foreground transition-all duration-200 hover:scale-[1.04]"
            >
              See Calendar →
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              disabled={status === "saving"}
              className="flex h-7 shrink-0 items-center justify-center rounded-full bg-accent px-3 text-xs font-bold text-accent-foreground transition-all duration-200 hover:scale-[1.04] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
            >
              {status === "saving" ? "Adding…" : "Add to Calendar"}
            </button>
          ))}
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
      {status === "error" && (
        <p className="px-4 py-2 text-xs text-caution">
          Couldn&apos;t add this to your calendar. Please try again.
        </p>
      )}
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
