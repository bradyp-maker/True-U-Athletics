export type ScheduleDay = {
  day: string;
  training?: string;
  supplements?: string[];
};

export type ScheduleData = {
  title: string;
  days: ScheduleDay[];
};

export type CoachMessageSegment =
  | { type: "text"; text: string }
  | { type: "schedule"; data: ScheduleData }
  | { type: "schedule-loading" };

const FENCE_OPEN = "```schedule";
const FENCE_CLOSE = "```";

/** Splits a Coach message into plain-text and structured-schedule segments for rendering. */
export function parseCoachMessage(content: string): CoachMessageSegment[] {
  const openIndex = content.indexOf(FENCE_OPEN);
  if (openIndex === -1) {
    return content ? [{ type: "text", text: content }] : [];
  }

  const before = content.slice(0, openIndex).trim();
  const afterOpen = content.slice(openIndex + FENCE_OPEN.length);
  const closeIndex = afterOpen.indexOf(FENCE_CLOSE);

  const segments: CoachMessageSegment[] = [];
  if (before) segments.push({ type: "text", text: before });

  if (closeIndex === -1) {
    // Schedule block hasn't finished streaming yet.
    segments.push({ type: "schedule-loading" });
    return segments;
  }

  const jsonText = afterOpen.slice(0, closeIndex).trim();
  const after = afterOpen.slice(closeIndex + FENCE_CLOSE.length).trim();

  try {
    const data = JSON.parse(jsonText) as ScheduleData;
    segments.push({ type: "schedule", data });
  } catch {
    // Malformed JSON — fall back to showing the raw text so nothing is silently lost.
    segments.push({ type: "text", text: jsonText });
  }

  if (after) segments.push({ type: "text", text: after });

  return segments;
}
