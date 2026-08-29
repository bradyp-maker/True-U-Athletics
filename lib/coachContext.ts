import "server-only";
import { buildStack, type Ingredient } from "@/lib/engine";
import { optionLabel } from "@/lib/labels";
import type { SavedStack } from "@/lib/savedStacks";

function describeIngredients(
  ingredients: Ingredient[],
  reasons: Partial<Record<Ingredient, string[]>>
): string {
  if (ingredients.length === 0) return "none";
  return ingredients
    .map((ing) => {
      const why = reasons[ing]?.join("; ");
      return why ? `${optionLabel(ing)} (${why})` : optionLabel(ing);
    })
    .join(", ");
}

/** Builds a system-prompt context block describing the signed-in user's saved stack(s). */
export function buildStackContext(stacks: SavedStack[]): string {
  if (stacks.length === 0) {
    return (
      'The signed-in user has not saved a supplement stack yet. If they ask about "my stack" ' +
      "or a specific supplement without more context, let them know they haven't saved one and " +
      "suggest taking the quiz at /survey."
    );
  }

  const sections = stacks.map((stack) => {
    const result = buildStack(stack.answers);
    const recommended = describeIngredients([...(result.toRecommend ?? [])], result.reasons);
    const covered = describeIngredients([...(result.alreadyCovered ?? [])], result.reasons);
    return [
      `"${stack.name}":`,
      `- Recommended: ${recommended}`,
      `- Already taking (covered): ${covered}`,
    ].join("\n");
  });

  return [
    "The signed-in user has saved the following supplement stack(s) from True U Athletics' quiz.",
    'Use these specifically when answering questions about dosing, timing, or "my stack" — assume',
    'a question about a supplement or "my stack" without more context refers to the stack(s)',
    "below, rather than answering generically.",
    "",
    ...sections,
  ].join("\n");
}
