"use client";

import { useEffect, useRef, useState } from "react";
import { parseCoachMessage } from "@/lib/parseCoachMessage";
import type { ScheduleData } from "@/lib/parseCoachMessage";
import { ScheduleCard, ScheduleLoadingCard } from "@/components/ScheduleCard";

type ChatMessage = { role: "user" | "assistant"; content: string };

const STARTER_PROMPTS = [
  "When should I take creatine relative to my workout?",
  "Is it safe to stack caffeine with my pre-workout?",
  "Build me a supplement schedule based on my training and stack",
];

export default function CoachClient({
  manageBillingAction,
  addScheduleToCalendarAction,
  userId,
}: {
  manageBillingAction: () => Promise<void>;
  addScheduleToCalendarAction: (schedule: ScheduleData) => Promise<{ ok: boolean }>;
  userId: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const storageKey = `coach_messages_${userId}`;

  // Restore chat history from this browser on mount, so navigating away and
  // back (or reloading) doesn't wipe the conversation. This has to happen in
  // an effect, not a lazy useState initializer: the server has no access to
  // localStorage, so reading it during the initial render would make the
  // client's first render disagree with the server-rendered HTML.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[];
        // eslint-disable-next-line react-hooks/set-state-in-effect -- see comment above
        if (Array.isArray(parsed)) setMessages(parsed);
      }
    } catch {
      // ignore corrupt/unavailable storage
    }
    setHydrated(true);
  }, [storageKey]);

  // Persist on every change, but only after the initial restore above has
  // run — otherwise this fires first (with the empty initial state) and
  // wipes out history before it's had a chance to load.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {
      // ignore unavailable storage (e.g. private browsing quota)
    }
  }, [messages, hydrated, storageKey]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    setError(null);
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Coach couldn't respond. Please try again.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = { ...last, content: last.content + chunk };
          return updated;
        });
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
      }
    } catch {
      setMessages((prev) => prev.slice(0, -1));
      setError("Something went wrong reaching Coach. Please try again.");
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-10">
        <div className="flex items-center justify-between animate-fade-up">
          <div>
            <span className="rounded-full border border-white/10 bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
              Coach
            </span>
            <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Ask Coach anything
            </h1>
          </div>
          <form action={manageBillingAction}>
            <button
              type="submit"
              className="hidden h-10 shrink-0 items-center justify-center rounded-full border border-white/15 px-4 text-sm font-medium text-muted transition-colors hover:border-white/30 hover:text-foreground sm:flex"
            >
              Manage billing
            </button>
          </form>
        </div>

        <div
          ref={scrollRef}
          className="mt-8 h-[30rem] space-y-4 overflow-y-auto rounded-2xl border border-white/10 bg-surface p-6"
        >
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="text-muted">
                Coach can help with dosing, timing, stacking, and how supplements fit your
                training.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="rounded-full border border-white/10 bg-surface-2 px-4 py-2 text-sm text-muted transition-colors hover:border-white/20 hover:text-foreground"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message, index) => {
              if (message.role === "user") {
                return (
                  <div key={index} className="flex justify-end">
                    <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl bg-accent px-4 py-3 text-sm leading-6 text-accent-foreground">
                      {message.content}
                    </div>
                  </div>
                );
              }

              const isLast = index === messages.length - 1;
              const segments =
                !message.content && isStreaming && isLast
                  ? [{ type: "text" as const, text: "Game planning…" }]
                  : parseCoachMessage(message.content);

              return (
                <div key={index} className="flex flex-col items-start gap-2">
                  {segments.map((segment, si) => {
                    if (segment.type === "schedule") {
                      return (
                        <ScheduleCard
                          key={si}
                          data={segment.data}
                          onAddToCalendar={addScheduleToCalendarAction}
                        />
                      );
                    }
                    if (segment.type === "schedule-loading") {
                      return <ScheduleLoadingCard key={si} />;
                    }
                    return (
                      <div
                        key={si}
                        className="max-w-[85%] whitespace-pre-wrap rounded-2xl bg-surface-2 px-4 py-3 text-sm leading-6 text-foreground"
                      >
                        {segment.text}
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {error && <p className="mt-3 text-sm text-caution">{error}</p>}

        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage(input);
          }}
          className="mt-4 flex items-center gap-3"
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask Coach a question..."
            disabled={isStreaming}
            className="h-12 flex-1 rounded-full border border-white/10 bg-surface px-5 text-sm text-foreground placeholder:text-muted-2 focus:border-accent/50"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="flex h-12 shrink-0 items-center justify-center rounded-full bg-accent px-6 text-sm font-bold text-accent-foreground transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_24px_-4px_rgba(198,255,63,0.6)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
