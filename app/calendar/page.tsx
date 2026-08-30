import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { getEntitlement } from "@/lib/entitlements";
import { getCalendarEntries } from "@/lib/calendarEntries";
import { getSavedStacks } from "@/lib/savedStacks";
import { buildStack } from "@/lib/engine";
import { optionLabel } from "@/lib/labels";
import { CalendarClient } from "./CalendarClient";

function mondayOf(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  const weekday = date.getDay(); // 0 = Sun ... 6 = Sat
  const diff = weekday === 0 ? -6 : 1 - weekday;
  date.setDate(date.getDate() + diff);
  return date.toISOString().slice(0, 10);
}

function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const entitlement = await getEntitlement();

  if (entitlement.tier === "anonymous") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-16 text-center">
        <div className="w-full max-w-lg animate-fade-up">
          <span className="rounded-full border border-white/10 bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
            Calendar
          </span>
          <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-foreground">
            Create a free account to start logging training
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted">
            Track your workouts, mark off your supplements day by day, and let Coach drop weekly
            schedules straight onto your calendar.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <SignUpButton mode="modal" forceRedirectUrl="/calendar">
              <button
                type="button"
                className="flex h-12 items-center justify-center rounded-full bg-accent px-8 text-base font-bold text-accent-foreground transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_28px_-4px_rgba(198,255,63,0.6)] active:scale-[0.97]"
              >
                Create free account
              </button>
            </SignUpButton>
            <SignInButton mode="modal" forceRedirectUrl="/calendar">
              <button
                type="button"
                className="flex h-12 items-center justify-center rounded-full border border-white/15 px-8 text-base font-medium text-foreground transition-colors hover:border-white/30 hover:bg-surface"
              >
                Log in
              </button>
            </SignInButton>
          </div>
        </div>
      </div>
    );
  }

  const { week } = await searchParams;
  const today = new Date().toISOString().slice(0, 10);
  const weekStart = mondayOf(week ?? today);
  const weekEnd = addDays(weekStart, 6);

  const entries = await getCalendarEntries(weekStart, weekEnd);
  const savedStacks = await getSavedStacks();
  const stackOptions = savedStacks.map((stack) => {
    const result = buildStack(stack.answers);
    return {
      id: stack.id,
      name: stack.name,
      supplements: [...(result.toRecommend ?? [])].map(optionLabel),
    };
  });

  return <CalendarClient weekStart={weekStart} entries={entries} stackOptions={stackOptions} />;
}
