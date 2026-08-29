"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";

type ChatMessage = { role: "user" | "assistant"; content: string };

const STARTER_PROMPTS = [
  "When should I take creatine?",
  "Is caffeine safe with pre-workout?",
];

type TrialStatus =
  | { allowed: false; reason: "signed_out" }
  | { allowed: false; reason: "limit_reached" }
  | { allowed: true; remaining: number | null };

export function CoachTeaser() {
  const { isLoaded, isSignedIn } = useUser();
  const [status, setStatus] = useState<TrialStatus | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasSentRef = useRef(false);

  useEffect(() => {
    if (!isSignedIn) return;
    fetch("/api/coach/trial")
      .then((res) => res.json())
      .then((data: TrialStatus) => {
        // Ignore this if a message already went out while the fetch was in
        // flight — the optimistic post-send update is more current.
        if (!hasSentRef.current) setStatus(data);
      })
      .catch(() => setStatus(null));
  }, [isSignedIn]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    if (status && !status.allowed) return;

    hasSentRef.current = true;
    setError(null);
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);

    try {
      const response = await fetch("/api/coach/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (response.status === 403) {
        const data = (await response.json()) as { reason: "signed_out" | "limit_reached" };
        setMessages((prev) => prev.slice(0, -1));
        setStatus({ allowed: false, reason: data.reason });
        return;
      }

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

      setStatus((prev) => {
        if (!prev || !prev.allowed || prev.remaining === null) return prev;
        const remaining = prev.remaining - 1;
        return remaining <= 0
          ? { allowed: false, reason: "limit_reached" }
          : { allowed: true, remaining };
      });
    } catch {
      setMessages((prev) => prev.slice(0, -1));
      setError("Something went wrong reaching Coach. Please try again.");
    } finally {
      setIsStreaming(false);
    }
  }

  const showSignUpGate = isLoaded && !isSignedIn;
  const showLimitReached = status !== null && !status.allowed && status.reason === "limit_reached";
  const remaining = status && status.allowed ? status.remaining : null;

  return (
    <section className="relative z-10 w-full max-w-5xl px-6 pb-28">
      <div className="flex flex-col-reverse items-center gap-10 rounded-3xl border border-white/10 bg-surface p-6 sm:flex-row sm:items-stretch sm:gap-10 sm:p-10">
        <div className="flex w-full flex-col">
          <span className="w-fit rounded-full border border-white/10 bg-surface-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
            Meet Coach
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Create a free account to start chatting with Coach
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Free accounts get 3 questions with Coach. Go unlimited for $4.99/mo.
          </p>

          <div
            ref={scrollRef}
            className="mt-5 max-h-72 min-h-[9rem] flex-1 space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-background p-4"
          >
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 py-4 text-center">
                <p className="text-sm text-muted">Ask Coach anything about your supplements.</p>
                {isSignedIn && (
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
                )}
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
                    {message.content ||
                      (isStreaming && index === messages.length - 1 ? "Game planning…" : "")}
                  </div>
                </div>
              ))
            )}
          </div>

          {showSignUpGate ? (
            <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-bold text-accent-foreground transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_24px_-4px_rgba(198,255,63,0.6)] active:scale-[0.97]"
                >
                  Create free account
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="flex h-11 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-medium text-foreground transition-colors hover:border-white/30 hover:bg-surface-2"
                >
                  Log in
                </button>
              </SignInButton>
            </div>
          ) : showLimitReached ? (
            <div className="mt-4 rounded-2xl border border-white/10 bg-surface-2 p-4 text-center">
              <p className="text-sm text-muted">
                You&apos;ve used your free questions with Coach. Go unlimited for $4.99/mo.
              </p>
              <Link
                href="/coach"
                className="mt-3 inline-flex h-10 items-center justify-center rounded-full bg-accent px-6 text-sm font-bold text-accent-foreground transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_24px_-4px_rgba(198,255,63,0.6)] active:scale-[0.97]"
              >
                Upgrade to Coach
              </Link>
            </div>
          ) : (
            <>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  sendMessage(input);
                }}
                className="mt-4 flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask Coach a question..."
                  disabled={isStreaming || !isSignedIn}
                  className="h-11 flex-1 rounded-full border border-white/10 bg-background px-4 text-sm text-foreground placeholder:text-muted-2 focus:border-accent/50"
                />
                <button
                  type="submit"
                  disabled={isStreaming || !input.trim() || !isSignedIn}
                  className="flex h-11 shrink-0 items-center justify-center rounded-full bg-accent px-5 text-sm font-bold text-accent-foreground transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_24px_-4px_rgba(198,255,63,0.6)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  Send
                </button>
              </form>
              {error && <p className="mt-2 text-xs text-caution">{error}</p>}
              {status?.allowed && remaining === null && (
                <p className="mt-2 text-xs text-muted-2">Unlimited access — thanks for being a Coach subscriber</p>
              )}
              {remaining !== null && (
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
