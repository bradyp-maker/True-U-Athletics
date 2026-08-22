import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-black/[.08] bg-white/80 backdrop-blur dark:border-white/[.145] dark:bg-black/80">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-black dark:text-zinc-50"
        >
          True U Athletics
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-600 sm:flex dark:text-zinc-400">
          <Link href="/about" className="hover:text-black dark:hover:text-zinc-50">
            About Us
          </Link>
          <Link href="/shop" className="hover:text-black dark:hover:text-zinc-50">
            Supplement Shop
          </Link>
          <Link href="/contact" className="hover:text-black dark:hover:text-zinc-50">
            Contact Us
          </Link>
        </nav>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link
            href="/login"
            className="text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-foreground px-4 py-2 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
