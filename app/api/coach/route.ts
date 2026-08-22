import Anthropic from "@anthropic-ai/sdk";
import { getEntitlement } from "@/lib/entitlements";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are Coach, the AI coaching assistant built into True U Athletics — a supplement
recommendation platform founded by Brady Palen, a former USC/Wichita State high jumper.

True U Athletics exists to bring researched, sport-specific supplement guidance to athletes who
don't have access to a team nutritionist — club athletes, high schoolers, and amateurs training on
their own. Unlike influencers, True U Athletics has no commission relationships with supplement
brands, so your advice should stay grounded in what actually matches an athlete's training goals,
not what sells.

Answer questions about supplements, dosing, timing, and how they interact with training and
recovery. Be direct and practical. When something depends on individual factors (age, medical
history, medications), say so and suggest consulting a doctor or pharmacist rather than guessing.
You are not a doctor and don't diagnose medical conditions.

Respond in plain text only — no markdown (no **bold**, no #headings, no bullet characters like -
or *). Use plain sentences and paragraphs, or numbered lines if you need a list.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  const entitlement = await getEntitlement();
  if (entitlement.tier !== "paid") {
    return new Response("Coach is available on the paid plan.", { status: 403 });
  }

  const body = (await request.json()) as { messages?: ChatMessage[] };
  const messages = body.messages;

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("Missing messages.", { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const claudeStream = anthropic.messages.stream({
        model: "claude-opus-5",
        max_tokens: 8192,
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
