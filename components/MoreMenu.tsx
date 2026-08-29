"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const MORE_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/shop", label: "Supplement Shop" },
  { href: "/contact", label: "Contact Us" },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-3.5 w-3.5 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function MoreMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 transition-colors hover:text-foreground"
      >
        More
        <ChevronIcon open={open} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-48 rounded-xl border border-white/10 bg-surface p-1.5 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.5)]">
          {MORE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
