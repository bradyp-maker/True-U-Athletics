import type Stripe from "stripe";
import { clerkClient } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";

async function setPlanForUser(
  clerkUserId: string,
  plan: "paid" | "free",
  extra?: { stripeCustomerId?: string; stripeSubscriptionId?: string | null }
) {
  const client = await clerkClient();
  const user = await client.users.getUser(clerkUserId);

  await client.users.updateUserMetadata(clerkUserId, {
    publicMetadata: { ...user.publicMetadata, plan },
    privateMetadata: {
      ...user.privateMetadata,
      ...(extra?.stripeCustomerId ? { stripeCustomerId: extra.stripeCustomerId } : {}),
      ...(extra ? { stripeSubscriptionId: extra.stripeSubscriptionId ?? null } : {}),
    },
  });
}

function activeSubscriptionStatus(status: Stripe.Subscription.Status): boolean {
  return status === "active" || status === "trialing";
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return new Response("Missing signature or webhook secret.", { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return new Response(`Webhook signature verification failed: ${message}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const clerkUserId = session.client_reference_id ?? session.metadata?.clerkUserId;
      if (clerkUserId) {
        await setPlanForUser(clerkUserId, "paid", {
          stripeCustomerId:
            typeof session.customer === "string" ? session.customer : session.customer?.id,
          stripeSubscriptionId:
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription?.id,
        });
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const clerkUserId = subscription.metadata?.clerkUserId;
      if (clerkUserId) {
        await setPlanForUser(
          clerkUserId,
          activeSubscriptionStatus(subscription.status) ? "paid" : "free",
          { stripeSubscriptionId: subscription.id }
        );
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const clerkUserId = subscription.metadata?.clerkUserId;
      if (clerkUserId) {
        await setPlanForUser(clerkUserId, "free", { stripeSubscriptionId: null });
      }
      break;
    }

    default:
      break;
  }

  return new Response(null, { status: 200 });
}
