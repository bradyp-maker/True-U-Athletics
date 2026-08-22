"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type ChatMessage = { role: "user" | "assistant"; content: string };

const TRIAL_LIMIT = 3;

const STARTER_PROMPTS = [
  "When should I take creatine?",
  "Is caffeine safe with pre-workout?",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CoachTeaser() {
  const [email, setEmail] = useState("");
  const [emailLocked, setEmailLocked] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [count, setCount] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const remaining = TRIAL_LIMIT - count;

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming || blocked) return;

    if (!emailLocked && !EMAIL_RE.test(email.trim())) {
      setError("Enter a valid email to start chatting with Coach.");
      return;
    }

    setError(null);
    setEmailLocked(true);
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setIsStreaming(true);

    try {
      const response = await fetch("/api/coach/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), messages: nextMessages }),
      });

      if (response.status === 403) {
        setBlocked(true);
        return;
      }

      if (!response.ok || !response.body) {
        throw new Error("Coach couldn't respond. Please try again.");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

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

      setCount((c) => {
        const next = c + 1;
        if (next >= TRIAL_LIMIT) setBlocked(true);
        return next;
      });
    } catch {
      setError("Something went wrong reaching Coach. Please try again.");
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <section className="relative z-10 w-full max-w-5xl px-6 pb-28">
      <div className="flex flex-col-reverse items-center gap-10 rounded-3xl border border-white/10 bg-surface p-6 sm:flex-row sm:items-stretch sm:gap-10 sm:p-10">
        <div className="flex w-full flex-col">
          <span className="rounded-full border border-white/10 bg-surface-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent w-fit">
            Meet Coach
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Start a conversation with as little as your email
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            {TRIAL_LIMIT} free questions, no account required. Then create a free account or go
            unlimited with Coach for $4.99/mo.
          </p>

          <div
            ref={scrollRef}
            className="mt-5 flex-1 space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-background p-4 max-h-72 min-h-[9rem]"
          >
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 py-4 text-center">
                <p className="text-sm text-muted">Ask Coach anything about your supplements.</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className="rounded-full border border-white/10 bg-surface-2 px-3 py-1.5 text-xs text-muted transition-colors hover:border-white/20 hover:text-foreground"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-6 ${
                      message.role === "user"
                        ? "bg-accent text-accent-foreground"
                        : "bg-surface-2 text-foreground"
                    }`}
                  >
                    {message.content || (isStreaming && index === messages.length - 1 ? "…" : "")}
                  </div>
                </div>
              ))
            )}
          </div>

          {blocked ? (
            <div className="mt-4 rounded-2xl border border-white/10 bg-surface-2 p-4 text-center">
              <p className="text-sm text-muted">
                You&apos;ve used your {TRIAL_LIMIT} free questions. Keep the conversation going with
                a free account, or go unlimited with Coach.
              </p>
              <Link
                href="/coach"
                className="mt-3 inline-flex h-10 items-center justify-center rounded-full bg-accent px-6 text-sm font-bold text-accent-foreground transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_24px_-4px_rgba(198,255,63,0.6)] active:scale-[0.97]"
              >
                Continue with Coach
              </Link>
            </div>
          ) : (
            <>
              {!emailLocked && (
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@email.com"
                  type="email"
                  className="mt-4 h-11 w-full rounded-full border border-white/10 bg-background px-4 text-sm text-foreground placeholder:text-muted-2 focus:border-accent/50"
                />
              )}
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  sendMessage(input);
                }}
                className="mt-3 flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask Coach a question..."
                  disabled={isStreaming}
                  className="h-11 flex-1 rounded-full border border-white/10 bg-background px-4 text-sm text-foreground placeholder:text-muted-2 focus:border-accent/50"
                />
                <button
                  type="submit"
                  disabled={isStreaming || !input.trim()}
                  className="flex h-11 shrink-0 items-center justify-center rounded-full bg-accent px-5 text-sm font-bold text-accent-foreground transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_24px_-4px_rgba(198,255,63,0.6)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  Send
                </button>
              </form>
              {error && <p className="mt-2 text-xs text-caution">{error}</p>}
              {count > 0 && (
                <p className="mt-2 text-xs text-muted-2">
                  {remaining} free {remaining === 1 ? "question" : "questions"} left
                </p>
              )}
            </>
          )}
        </div>

        <div className="flex w-full shrink-0 flex-col items-center justify-center sm:w-64">
          <div className="relative h-56 w-56 sm:h-64 sm:w-64">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full bg-accent/25 blur-3xl"
            />
            <Image
              src="/coach.png"
              alt="Coach, the AI coaching assistant for True U Athletics"
              fill
              sizes="256px"
              className="relative object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
