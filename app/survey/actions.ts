"use server";

import { buildStack, type Answers, type EngineResult } from "@/lib/engine";
import {
  canGenerate,
  getEntitlement,
  recordAuthedStackGenerated,
  showsFullResults,
  type Tier,
} from "@/lib/entitlements";
import { saveStack, type SaveStackResult } from "@/lib/savedStacks";

export type GenerateStackResponse =
  | {
      blocked: true;
      reason: "signup_required" | "limit_reached" | "daily_limit_reached";
      tier: Tier;
    }
  | {
      blocked: false;
      result: EngineResult;
      tier: Tier;
      fullResults: boolean;
      needsAnonMark: boolean;
    };

export async function generateStackAction(
  answers: Answers
): Promise<GenerateStackResponse> {
  const entitlement = await getEntitlement();

  if (!canGenerate(entitlement)) {
    return {
      blocked: true,
      reason:
        entitlement.tier === "anonymous"
          ? "signup_required"
          : entitlement.tier === "paid"
            ? "daily_limit_reached"
            : "limit_reached",
      tier: entitlement.tier,
    };
  }

  const result = buildStack(answers);
  let needsAnonMark = false;

  // Under-18 blocks don't count as a real recommendation, so don't spend a stack on it.
  if (result.gate !== "UNDER_18_BLOCK") {
    if (entitlement.tier === "anonymous") {
      // Cookie writes have to happen outside this Server Action — see markAnonStackUsed.
      needsAnonMark = true;
    } else {
      await recordAuthedStackGenerated(entitlement);
    }
  }

  return {
    blocked: false,
    result,
    tier: entitlement.tier,
    fullResults: showsFullResults(entitlement),
    needsAnonMark,
  };
}

export async function saveStackAction(
  answers: Answers,
  name?: string
): Promise<SaveStackResult> {
  return saveStack(answers, name);
}
