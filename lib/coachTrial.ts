import "server-only";
import { cookies } from "next/headers";

export const COACH_TRIAL_COOKIE = "tua_coach_trial";
export const COACH_TRIAL_MESSAGE_LIMIT = 3;

export type CoachTrialState = { email: string; count: number };

export async function getCoachTrialState(): Promise<CoachTrialState | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COACH_TRIAL_COOKIE)?.value;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed.email === "string" && typeof parsed.count === "number") {
      return parsed;
    }
  } catch {
    // malformed cookie — treat as no trial state
  }
  return null;
}

export async function setCoachTrialState(state: CoachTrialState): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COACH_TRIAL_COOKIE, JSON.stringify(state), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
