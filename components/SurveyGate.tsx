import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

const COPY = {
  signup_required: {
    badge: "Free stack used",
    heading: "You've used your free stack",
    body: "Create a free account to unlock your full results and save your stack.",
  },
  limit_reached: {
    badge: "Free stack used",
    heading: "You've used your free stack",
    body: "Free accounts get one full stack. View what you saved, or go unlimited with up to 5 stacks a day.",
  },
  daily_limit_reached: {
    badge: "Daily limit reached",
    heading: "You've hit today's limit of 5 stacks",
    body: "Come back tomorrow for more, or check out your saved stacks in the meantime.",
  },
} as const;

export function SurveyGate({
  variant,
}: {
  variant: "signup_required" | "limit_reached" | "daily_limit_reached";
}) {
  const copy = COPY[variant];

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-16 text-center">
      <div className="w-full max-w-lg animate-fade-up">
        <span className="rounded-full border border-white/10 bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
          {copy.badge}
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-foreground">
          {copy.heading}
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted">{copy.body}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {variant === "signup_required" && (
            <>
              <SignUpButton mode="modal" forceRedirectUrl="/survey">
                <button
                  type="button"
                  className="flex h-12 items-center justify-center rounded-full bg-accent px-8 text-base font-bold text-accent-foreground transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_28px_-4px_rgba(198,255,63,0.6)] active:scale-[0.97]"
                >
                  Create free account
                </button>
              </SignUpButton>
              <SignInButton mode="modal" forceRedirectUrl="/survey">
                <button
                  type="button"
                  className="flex h-12 items-center justify-center rounded-full border border-white/15 px-8 text-base font-medium text-foreground transition-colors hover:border-white/30 hover:bg-surface"
                >
                  Log in
                </button>
              </SignInButton>
            </>
          )}

          {variant === "limit_reached" && (
            <>
              <Link
                href="/stacks"
                className="flex h-12 items-center justify-center rounded-full bg-accent px-8 text-base font-bold text-accent-foreground transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_28px_-4px_rgba(198,255,63,0.6)] active:scale-[0.97]"
              >
                My Stacks
              </Link>
              <Link
                href="/coach"
                className="flex h-12 items-center justify-center rounded-full border border-white/15 px-8 text-base font-medium text-foreground transition-colors hover:border-white/30 hover:bg-surface"
              >
                Go unlimited
              </Link>
            </>
          )}

          {variant === "daily_limit_reached" && (
            <>
              <Link
                href="/stacks"
                className="flex h-12 items-center justify-center rounded-full bg-accent px-8 text-base font-bold text-accent-foreground transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_28px_-4px_rgba(198,255,63,0.6)] active:scale-[0.97]"
              >
                My Stacks
              </Link>
              <Link
                href="/"
                className="flex h-12 items-center justify-center rounded-full border border-white/15 px-8 text-base font-medium text-foreground transition-colors hover:border-white/30 hover:bg-surface"
              >
                Back home
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
