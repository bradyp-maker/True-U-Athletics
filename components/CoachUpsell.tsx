import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { createCheckoutSessionAction } from "@/app/coach/actions";
import type { Tier } from "@/lib/entitlements";

export function CoachUpsell({ tier }: { tier: Tier }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-16 text-center">
      <div className="w-full max-w-lg animate-fade-up">
        <span className="rounded-full border border-white/10 bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
          Coach
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-foreground">
          Meet Coach, your AI training partner
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted">
          Coach knows your stack and answers questions about dosing, timing, and how your
          supplements fit your training — any time you need it.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-surface p-6 text-left">
          <div className="flex items-baseline gap-1">
            <span className="font-display text-4xl font-extrabold text-foreground">$4.99</span>
            <span className="text-sm font-medium text-muted">/ month</span>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>Unlimited stacks, always full results</li>
            <li>Ask Coach anything about your supplement stack</li>
            <li>Cancel anytime</li>
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {tier === "anonymous" ? (
            <>
              <SignUpButton mode="modal" forceRedirectUrl="/coach">
                <button
                  type="button"
                  className="flex h-12 items-center justify-center rounded-full bg-accent px-8 text-base font-bold text-accent-foreground transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_28px_-4px_rgba(198,255,63,0.6)] active:scale-[0.97]"
                >
                  Create free account
                </button>
              </SignUpButton>
              <SignInButton mode="modal" forceRedirectUrl="/coach">
                <button
                  type="button"
                  className="flex h-12 items-center justify-center rounded-full border border-white/15 px-8 text-base font-medium text-foreground transition-colors hover:border-white/30 hover:bg-surface"
                >
                  Log in
                </button>
              </SignInButton>
            </>
          ) : (
            <form action={createCheckoutSessionAction}>
              <button
                type="submit"
                className="flex h-12 items-center justify-center rounded-full bg-accent px-8 text-base font-bold text-accent-foreground transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_28px_-4px_rgba(198,255,63,0.6)] active:scale-[0.97]"
              >
                Upgrade to Coach — $4.99/mo
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
