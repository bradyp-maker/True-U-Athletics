"use server";

import { revalidatePath } from "next/cache";
import {
  upsertCalendarEntry,
  setSupplementTaken,
  deleteCalendarEntry,
  type SupplementCheck,
} from "@/lib/calendarEntries";

export async function saveTrainingAction(date: string, training: string) {
  const result = await upsertCalendarEntry(date, { training: training.trim() || null });
  revalidatePath("/calendar");
  return result;
}

export async function toggleSupplementAction(date: string, name: string, taken: boolean) {
  const result = await setSupplementTaken(date, name, taken);
  revalidatePath("/calendar");
  return result;
}

export async function addSupplementAction(
  date: string,
  name: string,
  currentSupplements: SupplementCheck[]
) {
  const trimmed = name.trim();
  if (!trimmed) return { ok: false as const, reason: "error" as const };
  const updated = [...currentSupplements, { name: trimmed, taken: false }];
  const result = await upsertCalendarEntry(date, { supplements: updated });
  revalidatePath("/calendar");
  return result;
}

export async function removeSupplementAction(
  date: string,
  name: string,
  currentSupplements: SupplementCheck[]
) {
  const updated = currentSupplements.filter((s) => s.name !== name);
  const result = await upsertCalendarEntry(date, { supplements: updated });
  revalidatePath("/calendar");
  return result;
}

export async function clearDayAction(date: string) {
  await deleteCalendarEntry(date);
  revalidatePath("/calendar");
}

/** Appends a saved stack's supplements to a day, skipping any already present by name. */
export async function loadStackIntoDayAction(
  date: string,
  names: string[],
  currentSupplements: SupplementCheck[]
) {
  const existingNames = new Set(currentSupplements.map((s) => s.name));
  const additions = names
    .filter((name) => !existingNames.has(name))
    .map((name) => ({ name, taken: false }));
  const updated = [...currentSupplements, ...additions];
  const result = await upsertCalendarEntry(date, { supplements: updated });
  revalidatePath("/calendar");
  return result;
}
