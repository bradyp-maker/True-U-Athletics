import "server-only";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const COACH_PRICE_ID = process.env.STRIPE_COACH_PRICE_ID!;
