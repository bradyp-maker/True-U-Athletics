import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/**
 * Lazily constructs the Supabase admin client on first use, instead of at
 * module load. If the env vars are missing or wrong in this environment, the
 * error surfaces (and can be caught/logged) on the first actual call instead
 * of throwing at import time and crashing every route that touches this
 * module before it even runs — the same failure mode we hit with the
 * Anthropic client before it was made lazy.
 *
 * Uses the service role key, which bypasses Row Level Security. This app
 * authenticates through Clerk, not Supabase Auth, so every query made with
 * this client must be manually scoped by the caller (e.g. `.eq("user_id", userId)`).
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!cached) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error(
        `Missing Supabase env var(s): ${[
          !url && "NEXT_PUBLIC_SUPABASE_URL",
          !key && "SUPABASE_SERVICE_ROLE_KEY",
        ]
          .filter(Boolean)
          .join(", ")}`
      );
    }
    cached = createClient(url, key, { auth: { persistSession: false } });
  }
  return cached;
}
