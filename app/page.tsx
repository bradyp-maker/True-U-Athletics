import Link from "next/link";
import { CoachTeaser } from "@/components/CoachTeaser";

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
    </div>
  );
}
