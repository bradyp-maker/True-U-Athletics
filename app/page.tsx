import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";
import { CoachTeaser } from "@/components/CoachTeaser";

type PlanFeature = { text: string; included: boolean };

const PLANS: {
  name: string;
  tagline: string;
  price: string;
  priceSuffix?: string;
  features: PlanFeature[];
  highlight?: boolean;
  badge?: string;
  cta: "quiz" | "signup" | "coach";
  ctaLabel: string;
}[] = [
  {
    name: "Basic",
    tagline: "No account required",
    price: "$0",
    features: [
      { text: "Top 3 supplement picks", included: true },
      { text: "Synergy breakdown", included: false },
      { text: "Save your stack", included: false },
      { text: "Coach access", included: false },
    ],
    cta: "quiz",
    ctaLabel: "Take the Quiz",
  },
  {
    name: "Amateur",
    tagline: "Free account with email",
    price: "$0",
    features: [
      { text: "1 full supplement stack, ever", included: true },
      { text: "Full ingredient breakdown & synergy notes", included: true },
      { text: "Save that stack to your account", included: true },
      { text: "3 free questions with Coach", included: true },
    ],
    cta: "signup",
    ctaLabel: "Create free account",
  },
  {
    name: "MVP",
    tagline: "For athletes who want more",
    price: "$4.99",
    priceSuffix: "/ month",
    features: [
      { text: "Generate up to 5 stacks a day", included: true },
      { text: "Save up to 5 stacks to your account", included: true },
      { text: "Unlimited access to Coach", included: true },
      { text: "Cancel anytime", included: true },
    ],
    highlight: true,
    badge: "Most popular",
    cta: "coach",
    ctaLabel: "Go unlimited with Coach",
  },
];

const FEATURES = [
  {
    title: "Built for your sport",
    description:
      "Answers tailored to your training focus, frequency, and goals — not a one-size-fits-all list.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 text-accent"
      >
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Backed by the science",
    description:
      "Every recommendation is grounded in how each ingredient actually works in your body.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 text-accent"
      >
        <path d="M9 3h6M10 3v6.5L4.5 19a1 1 0 0 0 .87 1.5h13.26a1 1 0 0 0 .87-1.5L14 9.5V3" />
        <path d="M7.5 15h9" />
      </svg>
    ),
  },
  {
    title: "Safe by design",
    description:
      "Diet, allergy, and medication checks built in, plus a certified-only mode for tested athletes.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 text-accent"
      >
        <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col items-center overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]"
      />

      <main className="relative z-10 flex w-full max-w-2xl animate-fade-up flex-col items-center gap-8 px-6 py-28 text-center sm:py-36">
        <span className="rounded-full border border-white/10 bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
          Free 2-Minute Quiz
        </span>
        <h1 className="font-display text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl">
          Train hard.
          <br className="hidden sm:block" /> Supplement{" "}
          <span className="text-accent">smarter.</span>
        </h1>
        <p className="max-w-lg text-lg leading-8 text-muted">
          Take our free 2-minute quiz and get a supplement stack built
          around your sport, your goals, and how you actually train —
          not some generic list.
        </p>
        <Link
          href="/survey"
          className="group flex h-14 items-center justify-center gap-2 rounded-full bg-accent px-9 text-base font-bold text-accent-foreground transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_32px_-4px_rgba(198,255,63,0.6)] active:scale-[0.97]"
        >
          Take the Quiz
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </main>

      <section className="relative z-10 w-full max-w-5xl px-6 pb-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/10 bg-surface p-6 text-left transition-colors hover:border-white/20"
            >
              {f.icon}
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <CoachTeaser />

      <section className="relative z-10 w-full max-w-6xl px-6 pb-28">
        <div className="mx-auto mb-10 max-w-lg text-center">
          <span className="rounded-full border border-white/10 bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
            Plans
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground">
            Free to start. Unlock more when you&apos;re ready.
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl border p-8 ${
                plan.highlight
                  ? "border-accent/30 bg-surface shadow-[0_0_50px_-16px_rgba(198,255,63,0.35)]"
                  : "border-white/10 bg-surface"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 right-8 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-foreground">
                  {plan.badge}
                </span>
              )}
              <h3 className="font-display text-xl font-bold text-foreground">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted">{plan.tagline}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-4xl font-extrabold text-foreground">
                  {plan.price}
                </span>
                {plan.priceSuffix && (
                  <span className="text-sm font-medium text-muted">{plan.priceSuffix}</span>
                )}
              </div>
              <ul className="mt-6 flex flex-col gap-3 text-sm">
                {plan.features.map((feature) => (
                  <li
                    key={feature.text}
                    className={`flex items-start gap-2 ${
                      feature.included ? "text-foreground" : "text-muted-2"
                    }`}
                  >
                    {feature.included ? (
                      <CheckIcon className={plan.highlight ? "text-accent" : "text-muted"} />
                    ) : (
                      <XIcon className="text-muted-2" />
                    )}
                    {feature.text}
                  </li>
                ))}
              </ul>

              {plan.cta === "signup" ? (
                <SignUpButton mode="modal" forceRedirectUrl="/survey">
                  <button
                    type="button"
                    className="mt-8 flex h-11 w-full items-center justify-center rounded-full border border-white/15 px-6 text-sm font-bold text-foreground transition-colors hover:border-white/30 hover:bg-surface-2"
                  >
                    {plan.ctaLabel}
                  </button>
                </SignUpButton>
              ) : (
                <Link
                  href={plan.cta === "quiz" ? "/survey" : "/coach"}
                  className={
                    plan.highlight
                      ? "mt-8 flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-bold text-accent-foreground transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_24px_-6px_rgba(198,255,63,0.55)] active:scale-[0.98]"
                      : "mt-8 flex h-11 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-bold text-foreground transition-colors hover:border-white/30 hover:bg-surface-2"
                  }
                >
                  {plan.ctaLabel}
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`mt-0.5 h-4 w-4 shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function XIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`mt-0.5 h-4 w-4 shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
