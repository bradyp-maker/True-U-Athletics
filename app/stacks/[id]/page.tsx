import Link from "next/link";
import { buildStack } from "@/lib/engine";
import { getSavedStacks } from "@/lib/savedStacks";
import { ResultsView } from "@/components/ResultsView";
import { StackNameHeader } from "@/components/StackNameHeader";
import {
  deleteSavedStackAction,
  renameSavedStackAction,
  toggleExcludedIngredientAction,
} from "../actions";

export default async function StackDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const stacks = await getSavedStacks();
  const saved = stacks.find((s) => s.id === id);

  if (!saved) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-16 text-center">
        <div className="w-full max-w-lg animate-fade-up">
          <h1 className="mb-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Stack not found
          </h1>
          <p className="mb-8 text-lg leading-8 text-muted">
            This saved stack doesn&apos;t exist, or it&apos;s been deleted.
          </p>
          <Link
            href="/stacks"
            className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-8 text-base font-bold text-accent-foreground transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_28px_-4px_rgba(198,255,63,0.6)] active:scale-[0.97]"
          >
            Back to my stacks
          </Link>
        </div>
      </div>
    );
  }

  const result = buildStack(saved.answers);

  return (
    <ResultsView
      result={result}
      fullResults
      backHref="/stacks"
      backLabel="Back to my stacks"
      editable
      initialExcludedIngredients={saved.excludedIngredients ?? []}
      onToggleExclude={toggleExcludedIngredientAction.bind(null, saved.id)}
      titleOverride={
        <StackNameHeader
          id={saved.id}
          initialName={saved.name}
          onRename={renameSavedStackAction}
        />
      }
      extraActions={
        <form action={deleteSavedStackAction.bind(null, saved.id)}>
          <button
            type="submit"
            className="flex h-11 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-medium text-muted transition-colors hover:border-white/30 hover:text-foreground"
          >
            Delete “{saved.name}”
          </button>
        </form>
      }
    />
  );
}
