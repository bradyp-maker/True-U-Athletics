"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RenameStackResult } from "@/lib/savedStacks";

export function StackNameHeader({
  id,
  initialName,
  onRename,
}: {
  id: string;
  initialName: string;
  onRename: (id: string, name: string) => Promise<RenameStackResult>;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [savedName, setSavedName] = useState(initialName);
  const [name, setName] = useState(initialName);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");

  async function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setStatus("saving");
    try {
      const result = await onRename(id, trimmed);
      if (result.ok) {
        setSavedName(trimmed);
        setEditing(false);
        setStatus("idle");
        router.refresh();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (!editing) {
    return (
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {savedName}
        </h1>
        <button
          type="button"
          onClick={() => {
            setName(savedName);
            setStatus("idle");
            setEditing(true);
          }}
          className="text-xs font-semibold uppercase tracking-wide text-muted transition-colors hover:text-foreground"
        >
          Edit name
        </button>
      </div>
    );
  }

  return (
    <div className="mb-2">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={60}
          disabled={status === "saving"}
          autoFocus
          className="h-10 min-w-0 flex-1 rounded-full border border-white/10 bg-surface px-4 text-lg font-bold text-foreground focus:border-accent/50 disabled:opacity-60 sm:max-w-sm"
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={status === "saving" || !name.trim()}
          className="flex h-9 items-center justify-center rounded-full bg-accent px-4 text-sm font-bold text-accent-foreground transition-all duration-200 hover:scale-[1.04] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
        >
          {status === "saving" ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => {
            setEditing(false);
            setStatus("idle");
          }}
          disabled={status === "saving"}
          className="flex h-9 items-center justify-center rounded-full border border-white/15 px-4 text-sm font-medium text-muted transition-colors hover:border-white/30 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
      {status === "error" && (
        <p className="mt-2 text-xs text-caution">Something went wrong saving that name. Please try again.</p>
      )}
    </div>
  );
}
