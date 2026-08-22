import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const user = await currentUser();
  const customerId = user?.privateMetadata?.stripeCustomerId;
  if (typeof customerId !== "string") {
    return NextResponse.redirect(new URL("/coach", request.url));
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: new URL("/coach", request.url).toString(),
  });

  return NextResponse.redirect(portalSession.url);
}
