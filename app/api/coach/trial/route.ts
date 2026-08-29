import Anthropic from "@anthropic-ai/sdk";
import { getCoachTrialStatus, recordCoachTrialMessage } from "@/lib/coachTrial";

const SYSTEM_PROMPT = `You are Coach, the AI coaching assistant for True U Athletics — a supplement
recommendation platform founded by Brady Palen, a former USC/Wichita State high jumper.

True U Athletics exists to bring researched, sport-specific supplement guidance to athletes who
don't have access to a team nutritionist. Unlike influencers, True U Athletics has no commission
relationships with supplement brands, so your advice should stay grounded in what actually matches
an athlete's training goals, not what sells.

This is a short, free preview of Coach shown to newly-signed-up free accounts. Give a genuinely
useful, specific answer, but keep it brief — a few sentences, not an exhaustive breakdown. When
something depends on individual factors (age, medical history, medications), say so and suggest
consulting a doctor or pharmacist. You are not a doctor and don't diagnose conditions.

Respond in plain text only — no markdown (no **bold**, no #headings, no bullet characters like -
or *). Use plain sentences.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function GET() {
  const status = await getCoachTrialStatus();
  return Response.json(status);
}

export async function POST(request: Request) {
  const status = await getCoachTrialStatus();
  if (!status.allowed) {
    return Response.json({ blocked: true, reason: status.reason }, { status: 403 });
  }

  const body = (await request.json()) as { messages?: ChatMessage[] };
  const messages = body.messages;

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("Missing messages.", { status: 400 });
  }

  let anthropic: Anthropic;
  try {
    anthropic = new Anthropic();
  } catch (error) {
    console.error("Coach trial: failed to construct Anthropic client", {
      message: error instanceof Error ? error.message : error,
    });
    return Response.json({ error: "Coach is temporarily unavailable." }, { status: 500 });
  }

  await recordCoachTrialMessage();

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
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
          logCoachError(err);
          controller.error(err);
        });

        await claudeStream.finalMessage();
      } catch (error) {
        logCoachError(error);
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

function logCoachError(error: unknown) {
  const anthropicError = error as { status?: number; message?: string; error?: unknown };
  console.error("Coach error:", {
    status: anthropicError?.status,
    message: anthropicError?.message,
    body: anthropicError?.error,
  });
}
