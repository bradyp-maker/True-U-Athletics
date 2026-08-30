"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  deleteSavedStack,
  renameSavedStack,
  toggleExcludedIngredient,
  type RenameStackResult,
  type ToggleExcludedResult,
} from "@/lib/savedStacks";
import type { Ingredient } from "@/lib/engine";

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

export async function toggleExcludedIngredientAction(
  id: string,
  ingredient: Ingredient,
  excluded: boolean
): Promise<ToggleExcludedResult> {
  const result = await toggleExcludedIngredient(id, ingredient, excluded);
  if (result.ok) {
    revalidatePath("/stacks");
    revalidatePath(`/stacks/${id}`);
  }
  return result;
}
