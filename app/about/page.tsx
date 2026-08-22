import Image from "next/image";
import Link from "next/link";

const STATS = [
  { value: "8x", label: "All-Conference high jumper (2 golds, 6 silvers)" },
  { value: "3x", label: "NCAA First-Team All-American, high jump" },
  { value: "7'3.75\"", label: "Personal-best high jump clearance" },
  { value: "2024", label: "U.S. Olympic Trials qualifier" },
];

export default function About() {
  return (
    <div className="relative flex flex-1 flex-col items-center overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-0 h-[32rem] w-[32rem] rounded-full bg-accent/15 blur-[120px]"
      />

      <section className="relative z-10 w-full max-w-4xl px-6 py-20 sm:py-28">
        <span className="rounded-full border border-white/10 bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
          The Founder
        </span>
        <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Built by an athlete who&apos;s
          <br className="hidden sm:block" /> been on both sides of it.
        </h1>

        <div className="mt-12 grid gap-10 sm:grid-cols-[220px_1fr] sm:gap-12">
          <div className="mx-auto w-48 shrink-0 sm:mx-0 sm:w-full">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-[0_0_40px_-12px_rgba(198,255,63,0.2)]">
              <Image
                src="/brady.webp"
                alt="Brady Palen, founder of True U Athletics, in USC Track & Field gear"
                fill
                sizes="(min-width: 640px) 220px, 192px"
                className="object-cover"
                priority
              />
            </div>
            <p className="mt-3 text-center text-sm text-muted sm:text-left">
              Brady Palen
              <br />
              Founder, True U Athletics
            </p>
          </div>

          <div className="flex flex-col gap-5 text-base leading-7 text-muted">
            <p>
              I&apos;m Brady Palen, and I grew up in Beloit, Kansas — a small
              town with no sports dietitian, no team nutritionist, and no
              budget for either. As a high jumper, I was training for a
              completely different body composition than, say, the lineman
              lifting next to me in the weight room. It was obvious to me even
              then: if the training is different, the nutrition advice around
              it should be too.
            </p>
            <p>
              I got valuable training and nutrition experience in college at
              Wichita State and USC, where I became an 8-time All-Conference
              high jumper (2 golds, 6 silvers) and a 3x NCAA First-Team
              All-American. But looking back, my biggest regret is not taking
              nutrition as seriously as I took training — mostly because the
              right advice, tailored to what I was actually trying to
              accomplish, was never easy to find.
            </p>
            <p>
              That&apos;s the reason True U Athletics exists. The gap between
              what I had access to at a small Kansas high school and what I
              had access to at USC had nothing to do with how hard I worked —
              it was purely a matter of resources. Club athletes, high school
              teams, and amateurs training on their own shouldn&apos;t have to
              guess. True U Athletics takes that same researched,
              sport-specific thinking and puts it in one place, built around
              your training — not a one-size-fits-all list.
            </p>
            <p>
              And that&apos;s also why we don&apos;t operate like influencers
              do. Influencers don&apos;t know what supplements match your
              training goals — they know what pays them a commission. True U
              Athletics is built on the opposite premise.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/10 bg-surface p-5 text-center transition-colors hover:border-white/20"
            >
              <p className="font-display text-2xl font-extrabold text-accent">
                {s.value}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            href="/survey"
            className="flex h-14 items-center justify-center rounded-full bg-accent px-9 text-base font-bold text-accent-foreground transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_32px_-4px_rgba(198,255,63,0.6)] active:scale-[0.97]"
          >
            Build my stack
          </Link>
        </div>
      </section>
    </div>
  );
}
