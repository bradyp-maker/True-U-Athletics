import Link from "next/link";

const COMPANY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/coach", label: "Coach" },
  { href: "/stacks", label: "My Stacks" },
  { href: "/calendar", label: "Calendar" },
];

const LEGAL_LINKS = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/disclaimer", label: "Health Disclaimer" },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-surface">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 sm:grid-cols-3">
        <div>
          <p className="font-display text-lg font-extrabold tracking-tight text-foreground">
            True U <span className="text-accent">Athletics</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-muted">
            Supplement stacks designed for every athlete — researched, sport-specific, and built
            around your training.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-2">Company</p>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-muted">
            {COMPANY_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="mailto:team@trueusupplements.com"
                className="transition-colors hover:text-foreground"
              >
                team@trueusupplements.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-2">Legal</p>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-muted">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 px-6 py-6">
        <p className="mx-auto max-w-6xl text-xs leading-5 text-muted-2">
          © {year} True U LLC. All rights reserved. Supplement recommendations are for
          informational purposes only and have not been evaluated by the FDA — see our{" "}
          <Link href="/disclaimer" className="underline hover:text-foreground">
            Health Disclaimer
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
