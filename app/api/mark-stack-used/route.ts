import { markAnonStackUsed } from "@/lib/entitlements";

export async function POST() {
  await markAnonStackUsed();
  return new Response(null, { status: 204 });
}
