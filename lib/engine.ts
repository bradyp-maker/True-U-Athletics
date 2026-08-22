export const MULTI_SELECT = {
  q1_focus: {
    label: "Training focus",
    options: [
      "strength",
      "bodybuilding",
      "endurance",
      "team_sports",
      "crossfit",
      "combat",
      "general_wellness",
    ],
  },
  q2_goals: {
    label: "Training goals",
    options: [
      "build_muscle",
      "lose_fat",
      "increase_strength",
      "improve_endurance",
      "improve_recovery",
      "general_health",
    ],
  },
  q8_allergies: {
    label: "Allergies / sensitivities",
    options: ["dairy", "soy", "gluten", "shellfish", "caffeine_sens", "none"],
  },
  q11_current: {
    label: "Currently taking",
    options: [
      "protein",
      "creatine",
      "caffeine",
      "electrolytes",
      "omega3",
      "multivitamin",
      "vitamin_d",
      "magnesium",
      "joint_support",
      "ashwagandha",
      "melatonin",
      "iron",
      "b12",
      "none",
    ],
  },
} as const;

export const SINGLE_SELECT = {
  q3_frequency: { label: "Training frequency", options: ["1-2x", "3-4x", "5x+", "none"] },
  q4_tested: { label: "Drug tested?", options: ["yes", "no"] },
  q5_sex: { label: "Biological sex", options: ["male", "female", "na"] },
  q6_age: { label: "Age range", options: ["under18", "18-25", "26-35", "36-50", "50+"] },
  q7_diet: {
    label: "Diet restriction",
    options: ["vegan", "vegetarian", "keto", "none", "gluten_free", "other"],
  },
  q9_meds: { label: "Meds / conditions?", options: ["yes", "no"] },
  q10_sleep: { label: "Sleep quality", options: ["low", "low_quality", "good", "high"] },
} as const;

export type TrainingFocus = (typeof MULTI_SELECT.q1_focus.options)[number];
export type TrainingGoal = (typeof MULTI_SELECT.q2_goals.options)[number];
export type Allergy = (typeof MULTI_SELECT.q8_allergies.options)[number];
export type CurrentSupplement = (typeof MULTI_SELECT.q11_current.options)[number];

export type TrainingFrequency = (typeof SINGLE_SELECT.q3_frequency.options)[number];
export type DrugTested = (typeof SINGLE_SELECT.q4_tested.options)[number];
export type BiologicalSex = (typeof SINGLE_SELECT.q5_sex.options)[number];
export type AgeRange = (typeof SINGLE_SELECT.q6_age.options)[number];
export type DietRestriction = (typeof SINGLE_SELECT.q7_diet.options)[number];
export type MedsCondition = (typeof SINGLE_SELECT.q9_meds.options)[number];
export type SleepQuality = (typeof SINGLE_SELECT.q10_sleep.options)[number];

export interface Answers {
  q1_focus: TrainingFocus[];
  q2_goals: TrainingGoal[];
  q3_frequency: TrainingFrequency;
  q4_tested: DrugTested;
  q5_sex: BiologicalSex;
  q6_age: AgeRange;
  q7_diet: DietRestriction;
  q8_allergies: Allergy[];
  q9_meds: MedsCondition;
  q10_sleep: SleepQuality;
  q11_current: CurrentSupplement[];
}

export type Ingredient =
  | "creatine"
  | "citrulline"
  | "beta_alanine"
  | "caffeine"
  | "protein"
  | "protein_plant"
  | "electrolytes"
  | "carb_fuel"
  | "beetroot"
  | "joint_support"
  | "omega3"
  | "omega3_algae"
  | "magnesium"
  | "ashwagandha"
  | "multivitamin"
  | "vitamin_d"
  | "fiber"
  | "tart_cherry"
  | "b_complex"
  | "glucosamine"
  | "soy_protein"
  | "oat_based"
  | "b12"
  | "iron"
  | "calcium"
  | "melatonin"
  | "glycine";

export type Gate = "UNDER_18_BLOCK" | "certified_only" | "full_catalog";

export interface EngineResult {
  gate: Gate;
  stack: Set<Ingredient>;
  toRecommend?: Set<Ingredient>;
  alreadyCovered?: Set<Ingredient>;
  notes: string[];
}

const Q1_RULES: Record<TrainingFocus, Ingredient[]> = {
  strength: ["creatine", "citrulline", "beta_alanine", "caffeine"],
  bodybuilding: ["protein", "creatine"],
  endurance: ["electrolytes", "carb_fuel", "beetroot", "caffeine"],
  team_sports: ["creatine", "electrolytes", "protein", "beta_alanine", "joint_support"],
  crossfit: ["creatine", "protein", "beta_alanine", "electrolytes", "joint_support"],
  combat: ["electrolytes", "protein", "omega3", "magnesium", "ashwagandha"],
  general_wellness: ["multivitamin", "vitamin_d", "omega3"],
};

const Q2_RULES: Record<TrainingGoal, Ingredient[]> = {
  build_muscle: ["protein", "creatine"],
  lose_fat: ["protein", "caffeine", "fiber"],
  increase_strength: ["creatine", "beta_alanine", "caffeine"],
  improve_endurance: ["electrolytes", "carb_fuel", "beetroot"],
  improve_recovery: ["omega3", "magnesium", "tart_cherry", "protein"],
  general_health: ["multivitamin", "vitamin_d", "b_complex", "omega3"],
};

const ALLERGEN_MAP: Partial<Record<Ingredient, Allergy>> = {
  protein: "dairy",
  glucosamine: "shellfish",
  joint_support: "shellfish",
  caffeine: "caffeine_sens",
  soy_protein: "soy",
  oat_based: "gluten",
};

const WELLNESS_BASELINE: Set<Ingredient> = new Set(["multivitamin", "vitamin_d"]);
const WELLNESS_WHITELIST: Set<Ingredient> = new Set([
  "multivitamin",
  "vitamin_d",
  "b_complex",
  "omega3",
  "omega3_algae",
]);
const STACKING_CONCERN: Set<Ingredient> = new Set(["caffeine", "melatonin", "iron", "creatine"]);

function applyQ3(stack: Set<Ingredient>, freq: TrainingFrequency): Set<Ingredient> {
  if (freq === "3-4x") {
    stack.add("magnesium");
    stack.add("omega3");
  } else if (freq === "5x+") {
    stack.add("joint_support");
    stack.add("electrolytes");
  } else if (freq === "none") {
    (["creatine", "beta_alanine", "caffeine", "citrulline"] as Ingredient[]).forEach((i) =>
      stack.delete(i)
    );
    stack.add("multivitamin");
    stack.add("vitamin_d");
    stack.add("omega3");
  }
  return stack;
}

function applyQ6(age: AgeRange): Set<Ingredient> | null {
  const s = new Set<Ingredient>();
  if (age === "under18") return null;
  if (age === "36-50" || age === "50+") s.add("joint_support");
  if (age === "50+") {
    s.add("vitamin_d");
    s.add("calcium");
    s.add("protein");
  }
  return s;
}

function applyQ7(
  stack: Set<Ingredient>,
  diet: DietRestriction,
  notes: string[]
): Set<Ingredient> {
  if (diet === "vegan") {
    stack.delete("protein");
    stack.add("protein_plant");
    stack.add("b12");
    stack.add("iron");
    stack.add("creatine");
    if (stack.has("omega3")) {
      stack.delete("omega3");
      stack.add("omega3_algae");
    }
    notes.push("vegan: hard filter applied (plant protein, algae omega-3)");
  } else if (diet === "vegetarian") {
    notes.push("vegetarian: plant protein soft-preferred, B12/iron flagged");
  } else if (diet === "keto") {
    stack.delete("carb_fuel");
    notes.push("keto: high-carb fueling excluded");
  } else if (diet === "gluten_free") {
    stack.delete("oat_based");
    notes.push("gluten_free: gluten-containing items excluded");
  }
  return stack;
}

function applyQ8(stack: Set<Ingredient>, allergies: Allergy[], notes: string[]): Set<Ingredient> {
  if (allergies.includes("none") || allergies.length === 0) return stack;
  [...stack].forEach((ing) => {
    const tag = ALLERGEN_MAP[ing];
    if (tag && allergies.includes(tag)) {
      stack.delete(ing);
      notes.push(`allergy filter: removed ${ing} (${tag})`);
    }
  });
  return stack;
}

function applyQ9(stack: Set<Ingredient>, meds: MedsCondition, notes: string[]): Set<Ingredient> {
  if (meds === "yes") {
    notes.push("meds/conditions flagged: soft-gated to wellness-only + consult physician");
    const kept = [...stack].filter((i) => WELLNESS_WHITELIST.has(i));
    return new Set([...kept, ...WELLNESS_BASELINE]);
  }
  return stack;
}

function applyQ10(stack: Set<Ingredient>, sleep: SleepQuality): Set<Ingredient> {
  if (sleep === "low") {
    (["magnesium", "melatonin", "ashwagandha", "glycine"] as Ingredient[]).forEach((i) =>
      stack.add(i)
    );
  } else if (sleep === "low_quality") {
    (["magnesium", "ashwagandha"] as Ingredient[]).forEach((i) => stack.add(i));
  }
  return stack;
}

export function buildStack(answers: Answers): EngineResult {
  const notes: string[] = [];
  const ageResult = applyQ6(answers.q6_age);
  if (ageResult === null) {
    return { gate: "UNDER_18_BLOCK", stack: new Set(), notes: ["blocked: refer to parent/doctor"] };
  }

  let stack: Set<Ingredient> = new Set();
  answers.q1_focus.forEach((f) => Q1_RULES[f].forEach((i) => stack.add(i)));
  answers.q2_goals.forEach((g) => Q2_RULES[g].forEach((i) => stack.add(i)));
  stack = applyQ3(stack, answers.q3_frequency);
  ageResult.forEach((i) => stack.add(i));
  stack = applyQ7(stack, answers.q7_diet, notes);
  stack = applyQ8(stack, answers.q8_allergies, notes);
  stack = applyQ9(stack, answers.q9_meds, notes);
  stack = applyQ10(stack, answers.q10_sleep);
  const catalogGate: Gate = answers.q4_tested === "yes" ? "certified_only" : "full_catalog";

  if (stack.size === 0) {
    stack = new Set(WELLNESS_BASELINE);
    notes.push("safety net: stack was empty after all rules, added wellness baseline");
  }

  const current: Set<Ingredient> = new Set(
    answers.q11_current.filter((i): i is Exclude<CurrentSupplement, "none"> => i !== "none")
  );
  const alreadyCovered = new Set([...stack].filter((i) => current.has(i)));
  const toRecommend = new Set([...stack].filter((i) => !current.has(i)));
  const stackingFlags = [...alreadyCovered].filter((i) => STACKING_CONCERN.has(i));
  stackingFlags.forEach((i) =>
    notes.push(
      `stacking flag: already taking ${i} AND it was independently recommended — don't add a second source, review dosage instead`
    )
  );

  return { gate: catalogGate, stack, toRecommend, alreadyCovered, notes };
}
