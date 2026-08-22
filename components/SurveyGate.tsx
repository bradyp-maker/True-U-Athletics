import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

const COPY = {
  signup_required: {
    badge: "Free stack used",
    heading: "You've used your free stack",
    body: "Create a free account to unlock your full results and save your stacks.",
  },
  limit_reached: {
    badge: "Free stacks used",
    heading: "You've used your free stacks",
    body: "You've generated 2 stacks with your free account. Paid plans with more stacks are coming soon.",
  },
} as const;

export function SurveyGate({
  variant,
}: {
  variant: "signup_required" | "limit_reached";
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
          {variant === "signup_required" ? (
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
          ) : (
            <Link
              href="/"
              className="flex h-12 items-center justify-center rounded-full bg-accent px-8 text-base font-bold text-accent-foreground transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_28px_-4px_rgba(198,255,63,0.6)] active:scale-[0.97]"
            >
              Back home
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
