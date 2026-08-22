import "server-only";
import { cookies } from "next/headers";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";

export const ANON_STACK_COOKIE = "tua_anon_stack_used";

// Tier 3 (paid) is stubbed for now: no payment flow exists yet, but the
// shape is here so upgrading a user's `publicMetadata.plan` to "paid"
// later is all that's needed to unlock it.
export type Tier = "anonymous" | "free" | "paid";

export const TIER_LIMITS: Record<Tier, { maxStacks: number | null; fullResults: boolean }> = {
  anonymous: { maxStacks: 1, fullResults: false },
  free: { maxStacks: 2, fullResults: true },
  paid: { maxStacks: null, fullResults: true }, // null = unlimited, not wired up yet
};

export type Entitlement =
  | { tier: "anonymous"; stackCount: number }
  | { tier: "free"; stackCount: number; userId: string }
  | { tier: "paid"; stackCount: number; userId: string };

/** Reads the current user/visitor's tier and how many stacks they've generated so far. */
export async function getEntitlement(): Promise<Entitlement> {
  const { userId } = await auth();

  if (!userId) {
    const cookieStore = await cookies();
    const used = cookieStore.get(ANON_STACK_COOKIE)?.value === "1";
    return { tier: "anonymous", stackCount: used ? 1 : 0 };
  }

  const user = await currentUser();
  const plan = user?.publicMetadata?.plan === "paid" ? "paid" : "free";
  const stackCount =
    typeof user?.privateMetadata?.stackCount === "number"
      ? user.privateMetadata.stackCount
      : 0;

  return { tier: plan, stackCount, userId };
}

export function canGenerate(entitlement: Entitlement): boolean {
  const limit = TIER_LIMITS[entitlement.tier].maxStacks;
  if (limit === null) return true;
  return entitlement.stackCount < limit;
}

export function showsFullResults(entitlement: Entitlement): boolean {
  return TIER_LIMITS[entitlement.tier].fullResults;
}

/**
 * Records usage for a signed-in (free/paid) user right after a stack is
 * successfully generated. Safe to call from a Server Action: it only talks
 * to Clerk's API, it never touches `cookies()`, so it can't trigger Next's
 * "mutating cookies re-renders the current route" behavior.
 */
export async function recordAuthedStackGenerated(
  entitlement: Extract<Entitlement, { tier: "free" | "paid" }>
): Promise<void> {
  const client = await clerkClient();
  await client.users.updateUserMetadata(entitlement.userId, {
    privateMetadata: { stackCount: entitlement.stackCount + 1 },
  });
}

/**
 * Marks an anonymous visitor's free stack as used. This sets a cookie, so it
 * must be called from a Route Handler (via `fetch`), NOT from a Server
 * Action invoked directly by the survey UI — Next.js auto-revalidates the
 * current route whenever a Server Action mutates cookies, which would
 * immediately replace the just-rendered results with the "already used"
 * gate. A plain fetch to a Route Handler has no such side effect.
 */
export async function markAnonStackUsed(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ANON_STACK_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
