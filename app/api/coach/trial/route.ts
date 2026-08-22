import Anthropic from "@anthropic-ai/sdk";
import {
  COACH_TRIAL_MESSAGE_LIMIT,
  getCoachTrialState,
  setCoachTrialState,
} from "@/lib/coachTrial";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are Coach, the AI coaching assistant for True U Athletics — a supplement
recommendation platform founded by Brady Palen, a former USC/Wichita State high jumper.

True U Athletics exists to bring researched, sport-specific supplement guidance to athletes who
don't have access to a team nutritionist. Unlike influencers, True U Athletics has no commission
relationships with supplement brands, so your advice should stay grounded in what actually matches
an athlete's training goals, not what sells.

This is a short, free preview of Coach shown to visitors who haven't created an account yet. Give a
genuinely useful, specific answer, but keep it brief — a few sentences, not an exhaustive breakdown.
When something depends on individual factors (age, medical history, medications), say so and
suggest consulting a doctor or pharmacist. You are not a doctor and don't diagnose conditions.

Respond in plain text only — no markdown (no **bold**, no #headings, no bullet characters like -
or *). Use plain sentences.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; messages?: ChatMessage[] };
  const messages = body.messages;

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("Missing messages.", { status: 400 });
  }

  let state = await getCoachTrialState();

  if (!state) {
    const email = body.email?.trim();
    if (!email || !EMAIL_RE.test(email)) {
      return new Response("A valid email is required to start chatting with Coach.", {
        status: 400,
      });
    }
    state = { email, count: 0 };
  }

  if (state.count >= COACH_TRIAL_MESSAGE_LIMIT) {
    return Response.json({ blocked: true }, { status: 403 });
  }

  await setCoachTrialState({ email: state.email, count: state.count + 1 });

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const claudeStream = anthropic.messages.stream({
        model: "claude-opus-5",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages,
      });

      claudeStream.on("text", (delta) => {
        controller.enqueue(encoder.encode(delta));
      });

      claudeStream.on("error", (err) => {
        controller.error(err);
      });

      try {
        await claudeStream.finalMessage();
      } catch {
        // error already surfaced via the "error" listener above
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
