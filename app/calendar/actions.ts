"use server";

import { revalidatePath } from "next/cache";
import Anthropic from "@anthropic-ai/sdk";
import { getEntitlement } from "@/lib/entitlements";
import {
  upsertCalendarEntry,
  setSupplementTaken,
  deleteCalendarEntry,
  insertScheduleFromCoach,
  type SupplementCheck,
} from "@/lib/calendarEntries";
import type { ScheduleData } from "@/lib/parseCoachMessage";

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

const MAX_PDF_BYTES = 15 * 1024 * 1024; // 15MB

const EXTRACT_SYSTEM_PROMPT = `You read a single week of a workout plan from an attached PDF and
convert it into structured JSON for a training calendar. Only extract what's actually in the
document — don't invent specific exercises, sets, or reps that aren't there.

For each day for Monday through Sunday, write a short description (under 10 words) of that day's
training, or exactly "Rest" if it's a rest day or not mentioned. If the PDF only covers some days,
mark the rest "Rest".

Respond with ONLY valid JSON in exactly this shape, and nothing else — no markdown, no code fences,
no commentary before or after:
{ "title": "short title for this week", "days": [ { "day": "Mon", "training": "..." }, { "day": "Tue", "training": "..." }, { "day": "Wed", "training": "..." }, { "day": "Thu", "training": "..." }, { "day": "Fri", "training": "..." }, { "day": "Sat", "training": "..." }, { "day": "Sun", "training": "..." } ] }`;

export type ImportWorkoutResult = { ok: true } | { ok: false; reason: string };

/** Paid-only: reads a PDF of one week's workout plan and populates the calendar for that week. */
export async function importWorkoutPdfAction(
  weekStart: string,
  formData: FormData
): Promise<ImportWorkoutResult> {
  const entitlement = await getEntitlement();
  if (entitlement.tier !== "paid") {
    return { ok: false, reason: "Uploading a workout PDF is available on the MVP plan." };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false, reason: "No file received." };
  }
  if (file.type !== "application/pdf") {
    return { ok: false, reason: "Please upload a PDF file." };
  }
  if (file.size > MAX_PDF_BYTES) {
    return { ok: false, reason: "That PDF is too large (max 15MB)." };
  }

  let anthropic: Anthropic;
  try {
    anthropic = new Anthropic();
  } catch (error) {
    console.error("importWorkoutPdfAction: failed to construct Anthropic client", {
      message: error instanceof Error ? error.message : error,
    });
    return { ok: false, reason: "Coach is temporarily unavailable. Please try again." };
  }

  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");

  let message;
  try {
    message = await anthropic.messages.create({
      model: "claude-opus-5",
      max_tokens: 8192,
      system: EXTRACT_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: { type: "base64", media_type: "application/pdf", data: base64 },
            },
            { type: "text", text: "Extract this week's training schedule as JSON." },
          ],
        },
      ],
    });
  } catch (error) {
    const anthropicError = error as { status?: number; message?: string };
    console.error("importWorkoutPdfAction: Anthropic error", {
      status: anthropicError?.status,
      message: anthropicError?.message,
    });
    return { ok: false, reason: "Couldn't read that PDF. Please try again." };
  }

  const textBlock = message.content.find(
    (block): block is Anthropic.TextBlock => block.type === "text"
  );
  if (!textBlock) {
    return { ok: false, reason: "Couldn't extract a schedule from that PDF." };
  }

  let schedule: ScheduleData;
  try {
    schedule = JSON.parse(textBlock.text.trim()) as ScheduleData;
  } catch (error) {
    console.error("importWorkoutPdfAction: failed to parse extracted JSON", {
      message: error instanceof Error ? error.message : error,
      text: textBlock.text.slice(0, 500),
    });
    return { ok: false, reason: "Couldn't understand that PDF's layout. Please try again." };
  }

  const result = await insertScheduleFromCoach(schedule, weekStart);
  if (!result.ok) {
    return { ok: false, reason: "Couldn't save that schedule. Please try again." };
  }

  revalidatePath("/calendar");
  return { ok: true };
}
