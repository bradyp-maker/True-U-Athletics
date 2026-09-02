import "server-only";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { ScheduleData } from "@/lib/parseCoachMessage";

export type SupplementCheck = { name: string; taken: boolean };

export type CalendarEntry = {
  date: string; // YYYY-MM-DD
  training: string | null;
  supplements: SupplementCheck[];
  source: "manual" | "coach";
};

type Row = {
  entry_date: string;
  training: string | null;
  supplements: SupplementCheck[];
  source: string;
};

function rowToEntry(row: Row): CalendarEntry {
  return {
    date: row.entry_date,
    training: row.training,
    supplements: row.supplements,
    source: row.source === "coach" ? "coach" : "manual",
  };
}

function logSupabaseError(context: string, error: unknown) {
  console.error(`${context}: Supabase error`, {
    message: error instanceof Error ? error.message : error,
  });
}

/** Gets the Supabase client, logging (not throwing) if it can't be constructed. */
function tryGetSupabase(context: string) {
  try {
    return getSupabaseAdmin();
  } catch (error) {
    logSupabaseError(context, error);
    return null;
  }
}

/** Fetches saved calendar entries for the signed-in user within a date range (inclusive). */
export async function getCalendarEntries(
  startDate: string,
  endDate: string
): Promise<CalendarEntry[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const supabase = tryGetSupabase("getCalendarEntries");
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("calendar_entries")
    .select("entry_date, training, supplements, source")
    .eq("user_id", userId)
    .gte("entry_date", startDate)
    .lte("entry_date", endDate)
    .order("entry_date", { ascending: true });

  if (error) {
    logSupabaseError("getCalendarEntries", error);
    return [];
  }

  return (data as Row[]).map(rowToEntry);
}

/** Creates or updates a single day's entry for the signed-in user. */
export async function upsertCalendarEntry(
  date: string,
  updates: { training?: string | null; supplements?: SupplementCheck[] },
  source: "manual" | "coach" = "manual"
): Promise<{ ok: true } | { ok: false; reason: "signed_out" | "error" }> {
  const { userId } = await auth();
  if (!userId) return { ok: false, reason: "signed_out" };

  const supabase = tryGetSupabase("upsertCalendarEntry");
  if (!supabase) return { ok: false, reason: "error" };

  const { data: existing } = await supabase
    .from("calendar_entries")
    .select("training, supplements")
    .eq("user_id", userId)
    .eq("entry_date", date)
    .maybeSingle();

  const { error } = await supabase.from("calendar_entries").upsert(
    {
      user_id: userId,
      entry_date: date,
      training: updates.training !== undefined ? updates.training : (existing?.training ?? null),
      supplements:
        updates.supplements !== undefined ? updates.supplements : (existing?.supplements ?? []),
      source,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,entry_date" }
  );

  if (error) {
    logSupabaseError("upsertCalendarEntry", error);
    return { ok: false, reason: "error" };
  }
  return { ok: true };
}

/** Toggles whether a specific supplement was taken on a given day. */
export async function setSupplementTaken(
  date: string,
  supplementName: string,
  taken: boolean
): Promise<{ ok: true } | { ok: false; reason: "signed_out" | "error" }> {
  const { userId } = await auth();
  if (!userId) return { ok: false, reason: "signed_out" };

  const supabase = tryGetSupabase("setSupplementTaken");
  if (!supabase) return { ok: false, reason: "error" };

  const { data: existing } = await supabase
    .from("calendar_entries")
    .select("supplements")
    .eq("user_id", userId)
    .eq("entry_date", date)
    .maybeSingle();

  const current: SupplementCheck[] = existing?.supplements ?? [];
  const updated = current.map((s) => (s.name === supplementName ? { ...s, taken } : s));

  const { error } = await supabase.from("calendar_entries").upsert(
    {
      user_id: userId,
      entry_date: date,
      supplements: updated,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,entry_date" }
  );

  if (error) {
    logSupabaseError("setSupplementTaken", error);
    return { ok: false, reason: "error" };
  }
  return { ok: true };
}

/** Deletes a day's entry entirely for the signed-in user. */
export async function deleteCalendarEntry(date: string): Promise<void> {
  const { userId } = await auth();
  if (!userId) return;

  const supabase = tryGetSupabase("deleteCalendarEntry");
  if (!supabase) return;

  await supabase.from("calendar_entries").delete().eq("user_id", userId).eq("entry_date", date);
}

const DAY_INDEX: Record<string, number> = {
  mon: 0,
  tue: 1,
  wed: 2,
  thu: 3,
  fri: 4,
  sat: 5,
  sun: 6,
};

function mondayOfCurrentWeek(): string {
  const now = new Date();
  const weekday = now.getDay(); // 0 = Sun ... 6 = Sat
  const diffToMonday = weekday === 0 ? -6 : 1 - weekday;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  return monday.toISOString().slice(0, 10);
}

function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

/**
 * Inserts an AI-generated weekly schedule (from Coach chat or a PDF import)
 * into the calendar, mapping each "Mon"/"Tue"/etc entry onto the actual date
 * for the given week (defaults to the current week). Existing entries for
 * those dates are overwritten.
 */
export async function insertScheduleFromCoach(
  schedule: ScheduleData,
  weekStart: string = mondayOfCurrentWeek()
): Promise<{ ok: true } | { ok: false; reason: "signed_out" | "error" }> {
  const { userId } = await auth();
  if (!userId) return { ok: false, reason: "signed_out" };

  const supabase = tryGetSupabase("insertScheduleFromCoach");
  if (!supabase) return { ok: false, reason: "error" };

  const rows = schedule.days
    .map((day) => {
      const index = DAY_INDEX[day.day.trim().slice(0, 3).toLowerCase()];
      if (index === undefined) return null;
      return {
        user_id: userId,
        entry_date: addDays(weekStart, index),
        training: day.training ?? null,
        supplements: (day.supplements ?? []).map((name) => ({ name, taken: false })),
        source: "coach" as const,
        updated_at: new Date().toISOString(),
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  if (rows.length === 0) return { ok: false, reason: "error" };

  const { error } = await supabase
    .from("calendar_entries")
    .upsert(rows, { onConflict: "user_id,entry_date" });

  if (error) {
    logSupabaseError("insertScheduleFromCoach", error);
    return { ok: false, reason: "error" };
  }
  return { ok: true };
}
