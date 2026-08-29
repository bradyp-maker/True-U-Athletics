"use client";

import { useState } from "react";
import Link from "next/link";
import type { CalendarEntry, SupplementCheck } from "@/lib/calendarEntries";
import {
  saveTrainingAction,
  toggleSupplementAction,
  addSupplementAction,
  removeSupplementAction,
  clearDayAction,
} from "./actions";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function formatDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function isToday(isoDate: string): boolean {
  return isoDate === new Date().toISOString().slice(0, 10);
}

type DayState = { training: string; supplements: SupplementCheck[] };

export function CalendarClient({
  weekStart,
  entries,
}: {
  weekStart: string;
  entries: CalendarEntry[];
}) {
  const dates = DAY_LABELS.map((_, i) => addDays(weekStart, i));

  const [days, setDays] = useState<Record<string, DayState>>(() => {
    const initial: Record<string, DayState> = {};
    for (const date of dates) {
      const entry = entries.find((e) => e.date === date);
      initial[date] = { training: entry?.training ?? "", supplements: entry?.supplements ?? [] };
    }
    return initial;
  });
  const [newSupplementInput, setNewSupplementInput] = useState<Record<string, string>>({});

  function updateDay(date: string, patch: Partial<DayState>) {
    setDays((prev) => ({ ...prev, [date]: { ...prev[date], ...patch } }));
  }

  function handleTrainingBlur(date: string, value: string) {
    void saveTrainingAction(date, value);
  }

  function handleToggleSupplement(date: string, name: string, taken: boolean) {
    updateDay(date, {
      supplements: days[date].supplements.map((s) => (s.name === name ? { ...s, taken } : s)),
    });
    void toggleSupplementAction(date, name, taken);
  }

  function handleAddSupplement(date: string) {
    const name = (newSupplementInput[date] ?? "").trim();
    if (!name) return;
    const current = days[date].supplements;
    updateDay(date, { supplements: [...current, { name, taken: false }] });
    setNewSupplementInput((prev) => ({ ...prev, [date]: "" }));
    void addSupplementAction(date, name, current);
  }

  function handleRemoveSupplement(date: string, name: string) {
    const current = days[date].supplements;
    updateDay(date, { supplements: current.filter((s) => s.name !== name) });
    void removeSupplementAction(date, name, current);
  }

  function handleClearDay(date: string) {
    updateDay(date, { training: "", supplements: [] });
    void clearDayAction(date);
  }

  const prevWeek = addDays(weekStart, -7);
  const nextWeek = addDays(weekStart, 7);
  const weekEnd = addDays(weekStart, 6);
  const rangeLabel = `${formatDate(weekStart)} – ${formatDate(weekEnd)}`;

  return (
    <div className="flex flex-1 flex-col bg-background px-6 py-16 sm:py-24">
      <div className="mx-auto w-full max-w-3xl">
        <span className="w-fit rounded-full border border-white/10 bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
          Calendar
        </span>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {rangeLabel}
          </h1>
          <div className="flex items-center gap-2">
            <Link
              href={`/calendar?week=${prevWeek}`}
              className="flex h-9 items-center justify-center rounded-full border border-white/15 px-4 text-sm font-medium text-muted transition-colors hover:border-white/30 hover:text-foreground"
            >
              ← Prev
            </Link>
            <Link
              href={`/calendar?week=${nextWeek}`}
              className="flex h-9 items-center justify-center rounded-full border border-white/15 px-4 text-sm font-medium text-muted transition-colors hover:border-white/30 hover:text-foreground"
            >
              Next →
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          {dates.map((date, index) => {
            const day = days[date];
            const hasContent = day.training.trim().length > 0 || day.supplements.length > 0;
            return (
              <div
                key={date}
                className={`rounded-2xl border p-5 ${
                  isToday(date) ? "border-accent/40 bg-accent-soft" : "border-white/10 bg-surface"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                      {DAY_LABELS[index]}
                    </span>
                    <span className="text-xs text-muted-2">{formatDate(date)}</span>
                  </div>
                  {hasContent && (
                    <button
                      type="button"
                      onClick={() => handleClearDay(date)}
                      className="text-xs text-muted-2 transition-colors hover:text-caution"
                    >
                      Clear day
                    </button>
                  )}
                </div>

                <input
                  value={day.training}
                  onChange={(event) => updateDay(date, { training: event.target.value })}
                  onBlur={(event) => handleTrainingBlur(date, event.target.value)}
                  placeholder="Add training for this day..."
                  className="mt-3 h-10 w-full rounded-lg border border-white/10 bg-surface-2 px-3 text-sm text-foreground placeholder:text-muted-2 focus:border-accent/50"
                />

                {day.supplements.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {day.supplements.map((supplement) => (
                      <label
                        key={supplement.name}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors ${
                          supplement.taken
                            ? "border-accent/40 bg-accent text-accent-foreground"
                            : "border-white/10 bg-surface-2 text-muted"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={supplement.taken}
                          onChange={(event) =>
                            handleToggleSupplement(date, supplement.name, event.target.checked)
                          }
                          className="h-3 w-3 accent-accent"
                        />
                        {supplement.name}
                        <button
                          type="button"
                          onClick={() => handleRemoveSupplement(date, supplement.name)}
                          className="ml-0.5 opacity-60 hover:opacity-100"
                          aria-label={`Remove ${supplement.name}`}
                        >
                          ✕
                        </button>
                      </label>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex items-center gap-2">
                  <input
                    value={newSupplementInput[date] ?? ""}
                    onChange={(event) =>
                      setNewSupplementInput((prev) => ({ ...prev, [date]: event.target.value }))
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleAddSupplement(date);
                      }
                    }}
                    placeholder="Add supplement..."
                    className="h-8 flex-1 rounded-full border border-white/10 bg-surface-2 px-3 text-xs text-foreground placeholder:text-muted-2 focus:border-accent/50"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSupplement(date)}
                    className="flex h-8 items-center justify-center rounded-full border border-white/15 px-3 text-xs font-medium text-muted transition-colors hover:border-white/30 hover:text-foreground"
                  >
                    Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
