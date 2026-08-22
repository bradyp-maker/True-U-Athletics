import SurveyClient from "./SurveyClient";
import { SurveyGate } from "@/components/SurveyGate";
import { canGenerate, getEntitlement } from "@/lib/entitlements";

export default async function SurveyPage() {
  const entitlement = await getEntitlement();

  if (!canGenerate(entitlement)) {
    return (
      <SurveyGate
        variant={entitlement.tier === "anonymous" ? "signup_required" : "limit_reached"}
      />
    );
  }

  return <SurveyClient />;
}
