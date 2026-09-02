import { CoachUpsell } from "@/components/CoachUpsell";
import { getEntitlement } from "@/lib/entitlements";
import CoachClient from "./CoachClient";
import { createBillingPortalSessionAction, addScheduleToCalendarAction } from "./actions";

// "Add to Calendar" (a Server Action invoked from this page) has been timing
// out intermittently under Vercel's default function duration — give it more
// room. Server Actions inherit the duration limit of the route they're
// called from.
export const maxDuration = 30;

export default async function CoachPage() {
  const entitlement = await getEntitlement();

  if (entitlement.tier !== "paid") {
    return <CoachUpsell tier={entitlement.tier} />;
  }

  return (
    <CoachClient
      manageBillingAction={createBillingPortalSessionAction}
      addScheduleToCalendarAction={addScheduleToCalendarAction}
      userId={entitlement.userId}
    />
  );
}
