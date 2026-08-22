"use client";

import { useState } from "react";
import Link from "next/link";
import type { SaveStackResult } from "@/lib/savedStacks";

export function SaveStackButton({
  onSave,
}: {
  onSave: () => Promise<SaveStackResult>;
}) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "limit_reached" | "error">(
    "idle"
  );
  const [savedName, setSavedName] = useState<string | null>(null);

  async function handleSave() {
    setStatus("saving");
    try {
      const result = await onSave();
      if (result.ok) {
        setSavedName(result.stack.name);
        setStatus("saved");
      } else if (result.reason === "limit_reached") {
        setStatus("limit_reached");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "saved") {
    return (
      <div className="rounded-2xl border border-accent/20 bg-accent-soft p-4 text-sm leading-6 text-muted">
        Saved as <span className="font-medium text-foreground">“{savedName}”</span>.{" "}
        <Link href="/stacks" className="font-medium text-accent hover:underline">
          View my stacks
        </Link>
      </div>
    );
  }

  if (status === "limit_reached") {
    return (
      <div className="rounded-2xl border border-white/10 bg-surface-2 p-4 text-sm leading-6 text-muted">
        You&apos;ve reached your saved stack limit.{" "}
        <Link href="/stacks" className="font-medium text-accent hover:underline">
          Manage your saved stacks
        </Link>{" "}
        to delete one and save this instead.
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleSave}
        disabled={status === "saving"}
        className="flex h-11 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-bold text-foreground transition-colors hover:border-white/30 hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "saving" ? "Saving…" : "Save this stack"}
      </button>
      {status === "error" && (
        <p className="mt-2 text-xs text-caution">
          Something went wrong saving your stack. Please try again.
        </p>
      )}
    </div>
  );
}
