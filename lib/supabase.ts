import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the service role key, which bypasses Row
 * Level Security. This app authenticates through Clerk, not Supabase Auth, so
 * every query here must be manually scoped by the caller (e.g. `.eq("user_id", userId)`)
 * — the database has no policies of its own protecting rows by user.
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);
