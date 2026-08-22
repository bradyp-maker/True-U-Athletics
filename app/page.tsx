import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col items-center gap-8 px-6 py-32 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-black sm:text-5xl dark:text-zinc-50">
          Train hard. Supplement smarter.
        </h1>
        <p className="max-w-lg text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Take our free 2-minute quiz and get a supplement stack built
          around your sport, your goals, and how you actually train —
          not some generic list.
        </p>
        <Link
          href="/survey"
          className="flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-base font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Take the Quiz
        </Link>
      </main>
    </div>
  );
}
