"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { deleteSavedStack, renameSavedStack, type RenameStackResult } from "@/lib/savedStacks";

export async function deleteSavedStackAction(id: string): Promise<void> {
  await deleteSavedStack(id);
  redirect("/stacks");
}

export async function renameSavedStackAction(
  id: string,
  name: string
): Promise<RenameStackResult> {
  const result = await renameSavedStack(id, name);
  if (result.ok) {
    revalidatePath("/stacks");
    revalidatePath(`/stacks/${id}`);
  }
  return result;
}
