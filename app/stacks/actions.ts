"use server";

import { redirect } from "next/navigation";
import { deleteSavedStack } from "@/lib/savedStacks";

export async function deleteSavedStackAction(id: string): Promise<void> {
  await deleteSavedStack(id);
  redirect("/stacks");
}
