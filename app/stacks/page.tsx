import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { getEntitlement } from "@/lib/entitlements";
import { getSavedStacks, savedStackLimitFor } from "@/lib/savedStacks";
import { deleteSavedStackAction } from "./actions";

// Reads live per-user Clerk metadata (saved stacks) that changes via Server
// Actions on this same route (rename, exclude ingredient, delete). Without
// this, edits can silently fail to show up until Next.js's cache expires.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function StacksPage() {
  const entitlement = await getEntitlement();

  if (entitlement.tier === "anonymous") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-16 text-center">
        <div className="w-full max-w-lg animate-fade-up">
          <span className="rounded-full border border-white/10 bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
            My Stacks
          </span>
          <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-foreground">
            Create a free account to save your stacks
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted">
            Sign up to save your supplement stack and come back to it anytime.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <SignUpButton mode="modal" forceRedirectUrl="/stacks">
              <button
                type="button"
                className="flex h-12 items-center justify-center rounded-full bg-accent px-8 text-base font-bold text-accent-foreground transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_28px_-4px_rgba(198,255,63,0.6)] active:scale-[0.97]"
              >
                Create free account
              </button>
            </SignUpButton>
            <SignInButton mode="modal" forceRedirectUrl="/stacks">
              <button
                type="button"
                className="flex h-12 items-center justify-center rounded-full border border-white/15 px-8 text-base font-medium text-foreground transition-colors hover:border-white/30 hover:bg-surface"
              >
                Log in
              </button>
            </SignInButton>
          </div>
        </div>
      </div>
    );
  }

  const stacks = await getSavedStacks();
  const limit = savedStackLimitFor(entitlement.tier);
  const sorted = [...stacks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="flex flex-1 flex-col items-center bg-background px-6 py-16 sm:py-24">
      <div className="w-full max-w-2xl animate-fade-up">
        <span className="rounded-full border border-white/10 bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
          My Stacks
        </span>
        <div className="mt-6 flex items-baseline justify-between">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Saved stacks
          </h1>
          <span className="text-sm text-muted">
            {stacks.length} of {limit} saved
          </span>
        </div>

        {sorted.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-surface p-8 text-center">
            <p className="text-base text-muted">
              You haven&apos;t saved a stack yet. Take the quiz to build one, then save it here.
            </p>
            <Link
              href="/survey"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-bold text-accent-foreground transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_24px_-4px_rgba(198,255,63,0.6)] active:scale-[0.97]"
            >
              Take the Quiz
            </Link>
          </div>
        ) : (
          <ul className="mt-8 flex flex-col gap-4">
            {sorted.map((stack) => (
              <li
                key={stack.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-surface p-5"
              >
                <div>
                  <p className="font-display text-lg font-bold text-foreground">{stack.name}</p>
                  <p className="text-sm text-muted">
                    Saved {new Date(stack.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Link
                    href={`/stacks/${stack.id}`}
                    className="flex h-10 items-center justify-center rounded-full bg-accent px-5 text-sm font-bold text-accent-foreground transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_20px_-4px_rgba(198,255,63,0.6)] active:scale-[0.97]"
                  >
                    View
                  </Link>
                  <form action={deleteSavedStackAction.bind(null, stack.id)}>
                    <button
                      type="submit"
                      className="flex h-10 items-center justify-center rounded-full border border-white/15 px-5 text-sm font-medium text-muted transition-colors hover:border-white/30 hover:text-foreground"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
