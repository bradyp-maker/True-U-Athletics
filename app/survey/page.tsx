import SurveyClient from "./SurveyClient";
import { SurveyGate } from "@/components/SurveyGate";
import { canGenerate, getEntitlement } from "@/lib/entitlements";

export default async function SurveyPage() {
  const entitlement = await getEntitlement();

  if (!canGenerate(entitlement)) {
    const variant =
      entitlement.tier === "anonymous"
        ? "signup_required"
        : entitlement.tier === "paid"
          ? "daily_limit_reached"
          : "limit_reached";
    return <SurveyGate variant={variant} />;
  }

  return <SurveyClient />;
}
