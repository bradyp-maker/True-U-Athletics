"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export default function SiteHeader() {
  const pathname = usePathname();
  const showQuizCta = pathname !== "/";
  const { isLoaded, isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3 sm:py-4">
        <div className="flex flex-col justify-center">
          <Link
            href="/"
            className="font-display text-lg font-extrabold tracking-tight text-foreground sm:text-xl"
          >
            True U <span className="text-accent">Athletics</span>
          </Link>
          <span className="text-sm font-medium text-muted">
            Supplement stacks designed for every athlete
          </span>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted sm:flex">
          <Link href="/about" className="transition-colors hover:text-foreground">
            About Us
          </Link>
          <Link href="/shop" className="transition-colors hover:text-foreground">
            Supplement Shop
          </Link>
          <Link href="/contact" className="transition-colors hover:text-foreground">
            Contact Us
          </Link>
        </nav>

        <div className="flex items-center gap-4 text-sm font-medium">
          {showQuizCta && (
            <Link
              href="/survey"
              className="hidden items-center justify-center rounded-full border border-white/15 px-4 py-2 text-foreground transition-colors hover:border-white/30 hover:bg-surface sm:flex"
            >
              Take the Quiz
            </Link>
          )}

          {isLoaded && isSignedIn ? (
            <UserButton />
          ) : isLoaded ? (
            <>
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="text-muted transition-colors hover:text-foreground"
                >
                  Log in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="flex h-10 items-center justify-center rounded-full bg-accent px-5 font-semibold text-accent-foreground transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_24px_-4px_rgba(198,255,63,0.6)] active:scale-[0.97]"
                >
                  Sign up
                </button>
              </SignUpButton>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
