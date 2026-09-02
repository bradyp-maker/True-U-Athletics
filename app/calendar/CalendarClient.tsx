"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { CalendarEntry, SupplementCheck } from "@/lib/calendarEntries";
import {
  saveTrainingAction,
  toggleSupplementAction,
  addSupplementAction,
  removeSupplementAction,
  clearDayAction,
  loadStackIntoDayAction,
  importWorkoutPdfAction,
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

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

type DayState = { training: string; supplements: SupplementCheck[] };
type StackOption = { id: string; name: string; supplements: string[] };

export function CalendarClient({
  weekStart,
  entries,
  stackOptions,
  isPaid,
}: {
  weekStart: string;
  entries: CalendarEntry[];
  stackOptions: StackOption[];
  isPaid: boolean;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
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
  const [expandedDate, setExpandedDate] = useState<string | null>(
    dates.includes(todayIso()) ? todayIso() : null
  );

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

  function handleLoadStack(date: string, stack: StackOption) {
    const current = days[date].supplements;
    const existingNames = new Set(current.map((s) => s.name));
    const additions = stack.supplements
      .filter((name) => !existingNames.has(name))
      .map((name) => ({ name, taken: false }));
    if (additions.length === 0) return;
    updateDay(date, { supplements: [...current, ...additions] });
    void loadStackIntoDayAction(date, stack.supplements, current);
  }

  async function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    if (file.type !== "application/pdf") {
      setUploadStatus("error");
      setUploadError("Please upload a PDF file.");
      return;
    }

    setUploadStatus("uploading");
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await importWorkoutPdfAction(weekStart, formData);
      if (result.ok) {
        setUploadStatus("idle");
        router.refresh();
      } else {
        setUploadStatus("error");
        setUploadError(result.reason);
      }
    } catch {
      setUploadStatus("error");
      setUploadError("Something went wrong reading that PDF. Please try again.");
    }
  }

  const prevWeek = addDays(weekStart, -7);
  const nextWeek = addDays(weekStart, 7);
  const weekEnd = addDays(weekStart, 6);
  const rangeLabel = `${formatDate(weekStart)} – ${formatDate(weekEnd)}`;

  return (
    <div className="flex flex-1 flex-col bg-background px-6 py-16 sm:py-24">
      <div className="mx-auto w-full max-w-4xl">
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

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {isPaid ? (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileSelected}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadStatus === "uploading"}
                className="flex h-9 items-center justify-center rounded-full border border-white/15 px-4 text-sm font-medium text-muted transition-colors hover:border-white/30 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploadStatus === "uploading"
                  ? "Reading PDF…"
                  : `Upload workout PDF (${formatDate(weekStart)} – ${formatDate(addDays(weekStart, 6))})`}
              </button>
              {uploadStatus === "error" && uploadError && (
                <span className="text-xs text-caution">{uploadError}</span>
              )}
            </>
          ) : (
            <span className="text-xs text-muted-2">
              Upload a workout PDF to auto-fill this week —{" "}
              <Link href="/coach" className="text-accent hover:underline">
                available on MVP
              </Link>
              .
            </span>
          )}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {dates.map((date, index) => {
            const day = days[date];
            const isExpanded = expandedDate === date;
            const hasContent = day.training.trim().length > 0 || day.supplements.length > 0;
            const takenCount = day.supplements.filter((s) => s.taken).length;
            const isToday = date === todayIso();

            if (!isExpanded) {
              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => setExpandedDate(date)}
                  className={`flex flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition-colors ${
                    isToday
                      ? "border-accent/40 bg-accent-soft"
                      : "border-white/10 bg-surface hover:border-white/25"
                  }`}
                >
                  <div className="flex w-full items-baseline justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                      {DAY_LABELS[index]}
                    </span>
                    <span className="text-[11px] text-muted-2">{formatDate(date)}</span>
                  </div>
                  {hasContent ? (
                    <>
                      <p className="line-clamp-2 text-xs text-foreground">
                        {day.training || "Training logged"}
                      </p>
                      {day.supplements.length > 0 && (
                        <span className="text-[11px] text-muted">
                          {takenCount}/{day.supplements.length} taken
                        </span>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-muted-2">No entry</p>
                  )}
                </button>
              );
            }

            return (
              <div
                key={date}
                className={`col-span-2 rounded-2xl border p-5 sm:col-span-4 lg:col-span-7 ${
                  isToday ? "border-accent/40 bg-accent-soft" : "border-white/10 bg-surface"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setExpandedDate(null)}
                    className="flex items-baseline gap-2"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                      {DAY_LABELS[index]}
                    </span>
                    <span className="text-xs text-muted-2">{formatDate(date)}</span>
                    <span className="text-xs text-muted-2">(collapse ▲)</span>
                  </button>
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

                {stackOptions.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] uppercase tracking-wide text-muted-2">
                      Load from stack:
                    </span>
                    {stackOptions.map((stack) => (
                      <button
                        key={stack.id}
                        type="button"
                        onClick={() => handleLoadStack(date, stack)}
                        className="flex h-7 items-center justify-center rounded-full border border-white/15 px-3 text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-foreground"
                      >
                        + {stack.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
