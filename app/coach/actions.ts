"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { stripe, COACH_PRICE_ID } from "@/lib/stripe";

async function getOrigin(): Promise<string> {
  const hdrs = await headers();
  const host = hdrs.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
  return `${protocol}://${host}`;
}

export async function createCheckoutSessionAction(): Promise<void> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be signed in to upgrade.");
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const origin = await getOrigin();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: COACH_PRICE_ID, quantity: 1 }],
    client_reference_id: userId,
    customer_email: email,
    success_url: `${origin}/coach?checkout=success`,
    cancel_url: `${origin}/coach?checkout=cancelled`,
    metadata: { clerkUserId: userId },
    subscription_data: { metadata: { clerkUserId: userId } },
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL.");
  }

  redirect(session.url);
}

export async function createBillingPortalSessionAction(): Promise<void> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be signed in.");
  }

  const user = await currentUser();
  const customerId = user?.privateMetadata?.stripeCustomerId;
  if (typeof customerId !== "string") {
    throw new Error("No billing account found for this user yet.");
  }

  const origin = await getOrigin();
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${origin}/coach`,
  });

  redirect(portalSession.url);
}
