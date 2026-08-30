import { CoachUpsell } from "@/components/CoachUpsell";
import { getEntitlement } from "@/lib/entitlements";
import CoachClient from "./CoachClient";
import { createBillingPortalSessionAction, addScheduleToCalendarAction } from "./actions";

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
