import "server-only";
import { randomUUID } from "crypto";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { nameStackFromGoals, type Answers } from "@/lib/engine";
import { getEntitlement } from "@/lib/entitlements";

export const FREE_SAVED_STACK_LIMIT = 1;
export const PAID_SAVED_STACK_LIMIT = 5;

export type SavedStack = {
  id: string;
  name: string;
  createdAt: string;
  answers: Answers;
};

function readSavedStacks(privateMetadata: unknown): SavedStack[] {
  const saved = (privateMetadata as { savedStacks?: unknown } | null | undefined)?.savedStacks;
  return Array.isArray(saved) ? (saved as SavedStack[]) : [];
}

export function savedStackLimitFor(tier: "free" | "paid"): number {
  return tier === "paid" ? PAID_SAVED_STACK_LIMIT : FREE_SAVED_STACK_LIMIT;
}

/** Reads the signed-in user's saved stacks. Returns an empty list for anonymous visitors. */
export async function getSavedStacks(): Promise<SavedStack[]> {
  const { userId } = await auth();
  if (!userId) return [];
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return readSavedStacks(user.privateMetadata);
}

export type SaveStackResult =
  | { ok: true; stack: SavedStack }
  | { ok: false; reason: "signed_out" | "limit_reached" };

/** Saves a stack for the signed-in user. Uses their chosen name, falling back to one generated from their training goal(s). */
export async function saveStack(answers: Answers, customName?: string): Promise<SaveStackResult> {
  const entitlement = await getEntitlement();
  if (entitlement.tier === "anonymous") {
    return { ok: false, reason: "signed_out" };
  }

  const client = await clerkClient();
  const user = await client.users.getUser(entitlement.userId);
  const existing = readSavedStacks(user.privateMetadata);

  const limit = savedStackLimitFor(entitlement.tier);
  if (existing.length >= limit) {
    return { ok: false, reason: "limit_reached" };
  }

  const trimmedCustomName = customName?.trim();
  const baseName = trimmedCustomName || nameStackFromGoals(answers.q2_goals);
  const existingNames = new Set(existing.map((s) => s.name));
  let name = baseName;
  let suffix = 2;
  while (existingNames.has(name)) {
    name = `${baseName} (${suffix})`;
    suffix += 1;
  }

  const newStack: SavedStack = {
    id: randomUUID(),
    name,
    createdAt: new Date().toISOString(),
    answers,
  };

  await client.users.updateUserMetadata(entitlement.userId, {
    privateMetadata: { ...user.privateMetadata, savedStacks: [...existing, newStack] },
  });

  return { ok: true, stack: newStack };
}

export type RenameStackResult =
  | { ok: true }
  | { ok: false; reason: "signed_out" | "not_found" | "invalid_name" };

/** Renames a saved stack by id for the signed-in user. */
export async function renameSavedStack(id: string, name: string): Promise<RenameStackResult> {
  const trimmed = name.trim();
  if (!trimmed) return { ok: false, reason: "invalid_name" };

  const { userId } = await auth();
  if (!userId) return { ok: false, reason: "signed_out" };

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const existing = readSavedStacks(user.privateMetadata);
  const index = existing.findIndex((s) => s.id === id);
  if (index === -1) return { ok: false, reason: "not_found" };

  const updated = [...existing];
  updated[index] = { ...updated[index], name: trimmed };

  await client.users.updateUserMetadata(userId, {
    privateMetadata: { ...user.privateMetadata, savedStacks: updated },
  });

  return { ok: true };
}

/** Deletes a saved stack by id for the signed-in user. No-op if not found or signed out. */
export async function deleteSavedStack(id: string): Promise<void> {
  const { userId } = await auth();
  if (!userId) return;

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const existing = readSavedStacks(user.privateMetadata);

  await client.users.updateUserMetadata(userId, {
    privateMetadata: {
      ...user.privateMetadata,
      savedStacks: existing.filter((s) => s.id !== id),
    },
  });
}
