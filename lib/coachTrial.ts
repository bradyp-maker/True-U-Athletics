import "server-only";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";

export const COACH_TRIAL_MESSAGE_LIMIT = 3;

export type CoachTrialStatus =
  | { allowed: false; reason: "signed_out" }
  | { allowed: false; reason: "limit_reached" }
  | { allowed: true; remaining: number | null }; // null = unlimited (paid)

/** Reads whether the signed-in user can send a Coach trial message right now. */
export async function getCoachTrialStatus(): Promise<CoachTrialStatus> {
  const { userId } = await auth();
  if (!userId) {
    return { allowed: false, reason: "signed_out" };
  }

  const user = await currentUser();
  const plan = user?.publicMetadata?.plan === "paid" ? "paid" : "free";
  if (plan === "paid") {
    return { allowed: true, remaining: null };
  }

  const count =
    typeof user?.privateMetadata?.coachTrialCount === "number"
      ? user.privateMetadata.coachTrialCount
      : 0;

  if (count >= COACH_TRIAL_MESSAGE_LIMIT) {
    return { allowed: false, reason: "limit_reached" };
  }
  return { allowed: true, remaining: COACH_TRIAL_MESSAGE_LIMIT - count };
}

/** Increments the signed-in free-tier user's Coach trial usage. No-op for paid users. */
export async function recordCoachTrialMessage(): Promise<void> {
  const { userId } = await auth();
  if (!userId) return;

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const plan = user.publicMetadata?.plan === "paid" ? "paid" : "free";
  if (plan === "paid") return;

  const count =
    typeof user.privateMetadata?.coachTrialCount === "number"
      ? user.privateMetadata.coachTrialCount
      : 0;

  await client.users.updateUserMetadata(userId, {
    privateMetadata: { ...user.privateMetadata, coachTrialCount: count + 1 },
  });
}
