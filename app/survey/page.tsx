"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MULTI_SELECT,
  SINGLE_SELECT,
  buildStack,
  type Answers,
  type EngineResult,
  type Ingredient,
} from "@/lib/engine";

const LABELS: Record<string, string> = {
  // q1 training focus
  strength: "Strength and explosiveness",
  bodybuilding: "Bodybuilding",
  endurance: "Endurance",
  team_sports: "Team sports",
  crossfit: "CrossFit / mixed conditioning",
  combat: "Combat sports",
  general_wellness: "General wellness",
  // q2 goals
  build_muscle: "Build muscle",
  lose_fat: "Lose fat",
  increase_strength: "Increase strength and explosiveness",
  improve_endurance: "Improve endurance",
  improve_recovery: "Improve recovery",
  general_health: "General health",
  // q3 frequency
  "1-2x": "1–2x per week",
  "3-4x": "3–4x per week",
  "5x+": "5x+ per week",
  // q4 / q9 yes-no
  yes: "Yes",
  no: "No",
  // q5 sex
  male: "Male",
  female: "Female",
  na: "Prefer not to say",
  // q6 age
  under18: "Under 18",
  "18-25": "18–25",
  "26-35": "26–35",
  "36-50": "36–50",
  "50+": "50+",
  // q7 diet
  vegan: "Vegan",
  vegetarian: "Vegetarian",
  keto: "Keto",
  gluten_free: "Gluten-free",
  other: "Other",
  // q8 allergies
  dairy: "Dairy",
  soy: "Soy",
  gluten: "Gluten",
  shellfish: "Shellfish",
  caffeine_sens: "Caffeine sensitivity",
  // q10 sleep
  low: "Low (poor recovery)",
  low_quality: "Low quality (frequent waking)",
  good: "Good",
  high: "High",
  // shared / q11 / ingredients
  none: "None",
  protein: "Protein",
  protein_plant: "Plant protein",
  creatine: "Creatine",
  caffeine: "Caffeine",
  electrolytes: "Electrolytes",
  omega3: "Omega-3",
  omega3_algae: "Omega-3 (algae-based)",
  multivitamin: "Multivitamin",
  vitamin_d: "Vitamin D",
  magnesium: "Magnesium",
  joint_support: "Joint support",
  ashwagandha: "Ashwagandha",
  melatonin: "Melatonin",
  iron: "Iron",
  b12: "Vitamin B12",
  citrulline: "Citrulline",
  beta_alanine: "Beta-alanine",
  carb_fuel: "Carb fueling",
  beetroot: "Beetroot",
  fiber: "Fiber",
  tart_cherry: "Tart cherry",
  b_complex: "B-complex",
  glucosamine: "Glucosamine",
  soy_protein: "Soy protein",
  oat_based: "Oat-based",
  calcium: "Calcium",
  glycine: "Glycine",
};

function optionLabel(value: string): string {
  return LABELS[value] ?? value;
}

const DESCRIPTIONS: Record<string, string> = {
  // q1 training focus
  strength: "Heavy lifting and powerful, explosive movements",
  bodybuilding: "Building muscle size and definition",
  endurance: "Long-duration cardio training",
  team_sports: "Field or court based sports",
  crossfit: "Mixed functional fitness training",
  combat: "Striking, grappling, or fighting sports",
  general_wellness: "Staying active and healthy",
  // q2 goals
  build_muscle: "Gain lean muscle mass",
  lose_fat: "Reduce body fat percentage",
  increase_strength: "Lift heavier and move weight faster",
  improve_endurance: "Go longer without fatigue",
  improve_recovery: "Bounce back faster between sessions",
  general_health: "Overall wellbeing, not performance",
  // q3 frequency
  "1-2x": "A couple sessions per week",
  "3-4x": "Several sessions per week",
  "5x+": "Training nearly every day",
  // q5 sex
  male: "Biologically male",
  female: "Biologically female",
  na: "Would rather skip this",
  // q6 age
  under18: "Younger than 18 years old",
  "18-25": "Young adult range",
  "26-35": "Adult range",
  "36-50": "Middle-aged range",
  "50+": "Older adult range",
  // q7 diet
  vegan: "No animal products at all",
  vegetarian: "No meat, dairy and eggs okay",
  keto: "Very low carb, high fat",
  gluten_free: "No wheat or gluten",
  other: "Some other dietary restriction",
  // q8 allergies
  dairy: "Milk-based products bother you",
  soy: "Soy-based products bother you",
  gluten: "Wheat-based products bother you",
  shellfish: "Shellfish-derived ingredients bother you",
  caffeine_sens: "Sensitive to stimulants",
  // q10 sleep
  low: "Poor, frequently disrupted sleep",
  low_quality: "Sleep, but wake up often",
  good: "Solid, consistent sleep",
  high: "Excellent, restorative sleep",
  // shared / q11 / ingredients
  none: "Not applicable to me",
  protein: "Whey-based protein powder",
  protein_plant: "Plant-based protein powder",
  creatine: "Boosts strength and power output",
  caffeine: "Boosts energy and focus",
  electrolytes: "Replaces minerals lost through sweat",
  omega3: "Fish oil for heart and joints",
  omega3_algae: "Plant-based omega-3 source",
  multivitamin: "Fills common nutrient gaps",
  vitamin_d: "Supports bone and immune health",
  magnesium: "Supports recovery and better sleep",
  joint_support: "Supports joint health and mobility",
  ashwagandha: "Helps manage stress levels",
  melatonin: "Helps you fall asleep faster",
  iron: "Supports oxygen transport in blood",
  b12: "Supports energy metabolism",
  citrulline: "Boosts blood flow and pumps",
  beta_alanine: "Delays muscular fatigue",
  carb_fuel: "Fuels long training sessions",
  beetroot: "Boosts blood flow and endurance",
  fiber: "Supports digestion and fullness",
  tart_cherry: "Reduces soreness and inflammation",
  b_complex: "Supports energy and metabolism",
  glucosamine: "Supports joint cartilage health",
  soy_protein: "Soy-based protein powder",
  oat_based: "Oat-based carbohydrate source",
  calcium: "Supports bone strength",
  glycine: "Supports deeper sleep quality",
};

const QUESTION_OPTION_DESCRIPTIONS: Record<string, string> = {
  "q4_tested:yes": "Subject to routine drug testing",
  "q4_tested:no": "Not tested for banned substances",
  "q9_meds:yes": "Taking medication or managing a condition",
  "q9_meds:no": "No medications or conditions to flag",
};

function optionDescription(questionKey: string, value: string): string {
  return (
    QUESTION_OPTION_DESCRIPTIONS[`${questionKey}:${value}`] ?? DESCRIPTIONS[value] ?? ""
  );
}

const Q11_POPULAR = ["protein", "creatine", "multivitamin", "caffeine"];

const QUESTIONS: {
  key: keyof Answers;
  kind: "multi" | "single";
  label: string;
  options: readonly string[];
}[] = [
  { key: "q1_focus", kind: "multi", ...MULTI_SELECT.q1_focus },
  { key: "q2_goals", kind: "multi", ...MULTI_SELECT.q2_goals },
  { key: "q3_frequency", kind: "single", ...SINGLE_SELECT.q3_frequency },
  { key: "q4_tested", kind: "single", ...SINGLE_SELECT.q4_tested },
  { key: "q5_sex", kind: "single", ...SINGLE_SELECT.q5_sex },
  { key: "q6_age", kind: "single", ...SINGLE_SELECT.q6_age },
  { key: "q7_diet", kind: "single", ...SINGLE_SELECT.q7_diet },
  { key: "q8_allergies", kind: "multi", ...MULTI_SELECT.q8_allergies },
  { key: "q9_meds", kind: "single", ...SINGLE_SELECT.q9_meds },
  { key: "q10_sleep", kind: "single", ...SINGLE_SELECT.q10_sleep },
  { key: "q11_current", kind: "multi", ...MULTI_SELECT.q11_current },
];

type DraftAnswers = Partial<Record<keyof Answers, string | string[]>>;

const INITIAL_ANSWERS: DraftAnswers = {
  q1_focus: [],
  q2_goals: [],
  q8_allergies: [],
  q11_current: [],
};

export default function SurveyPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<DraftAnswers>(INITIAL_ANSWERS);
  const [result, setResult] = useState<EngineResult | null>(null);
  const [otherMenuOpen, setOtherMenuOpen] = useState(false);

  const question = QUESTIONS[step];
  const isLastStep = step === QUESTIONS.length - 1;

  useEffect(() => {
    setOtherMenuOpen(false);
  }, [step]);

  function toggleOption(key: keyof Answers, value: string) {
    setAnswers((prev) => {
      const current = Array.isArray(prev[key]) ? (prev[key] as string[]) : [];
      let next: string[];
      if (value === "none") {
        next = current.includes("none") ? [] : ["none"];
      } else {
        const withoutNone = current.filter((v) => v !== "none");
        next = withoutNone.includes(value)
          ? withoutNone.filter((v) => v !== value)
          : [...withoutNone, value];
      }
      return { ...prev, [key]: next };
    });
  }

  function selectSingle(key: keyof Answers, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function canProceed(): boolean {
    const value = answers[question.key];
    if (question.kind === "multi") return Array.isArray(value) && value.length > 0;
    return typeof value === "string" && value.length > 0;
  }

  function handleNext() {
    if (!canProceed()) return;
    if (isLastStep) {
      setResult(buildStack(answers as Answers));
    } else {
      setStep((s) => s + 1);
    }
  }

  function handleBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  const AUTO_ADVANCE_ON_NONE = new Set(["q7_diet", "q8_allergies"]);

  function handleOptionClick(opt: string, wasSelected: boolean) {
    if (question.kind === "multi") {
      toggleOption(question.key, opt);
    } else {
      selectSingle(question.key, opt);
    }
    if (
      opt === "none" &&
      !wasSelected &&
      AUTO_ADVANCE_ON_NONE.has(question.key)
    ) {
      setStep((s) => Math.min(s + 1, QUESTIONS.length - 1));
    }
  }

  function handleRestart() {
    setAnswers(INITIAL_ANSWERS);
    setStep(0);
    setResult(null);
  }

  if (result) {
    return <ResultsView result={result} onRestart={handleRestart} />;
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <div className="w-full max-w-xl">
        <p className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Question {step + 1} of {QUESTIONS.length}
        </p>
        <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-foreground transition-all"
            style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>

        <h1 className="mb-6 text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          {question.label}
        </h1>

        <div className="mb-10 flex flex-col gap-3">
          {(question.key === "q11_current"
            ? [...Q11_POPULAR, "none"]
            : question.options
          ).map((opt) => {
            const selected =
              question.kind === "multi"
                ? Array.isArray(answers[question.key]) &&
                  (answers[question.key] as string[]).includes(opt)
                : answers[question.key] === opt;
            const description = optionDescription(question.key, opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleOptionClick(opt, selected)}
                className={`flex flex-col items-start justify-center rounded-xl border px-5 py-3 text-left text-base transition-colors ${
                  selected
                    ? "border-foreground bg-foreground text-background"
                    : "border-black/[.08] bg-white text-black hover:border-black/[.2] dark:border-white/[.145] dark:bg-zinc-900 dark:text-zinc-50 dark:hover:border-white/[.3]"
                }`}
              >
                <span>{optionLabel(opt)}</span>
                {description && (
                  <span
                    className={`text-sm ${
                      selected
                        ? "text-background/70"
                        : "text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    {description}
                  </span>
                )}
              </button>
            );
          })}

          {question.key === "q11_current" &&
            (() => {
              const otherOptions = question.options.filter(
                (o) => o !== "none" && !Q11_POPULAR.includes(o)
              );
              const currentSelections = Array.isArray(
                answers[question.key]
              )
                ? (answers[question.key] as string[])
                : [];
              const otherSelectedCount = otherOptions.filter((o) =>
                currentSelections.includes(o)
              ).length;
              return (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOtherMenuOpen((v) => !v)}
                    className="flex w-full items-center justify-between rounded-xl border border-dashed border-black/[.15] bg-white px-5 py-3 text-left text-base text-black transition-colors hover:border-black/[.3] dark:border-white/[.2] dark:bg-zinc-900 dark:text-zinc-50 dark:hover:border-white/[.35]"
                  >
                    <span>Other supplements</span>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      {otherSelectedCount > 0
                        ? `${otherSelectedCount} selected`
                        : "Show more"}
                    </span>
                  </button>
                  {otherMenuOpen && (
                    <div className="mt-3 flex flex-col gap-2 rounded-xl border border-black/[.08] bg-white p-3 dark:border-white/[.145] dark:bg-zinc-900">
                      {otherOptions.map((opt) => {
                        const selected = currentSelections.includes(opt);
                        const description = optionDescription(
                          question.key,
                          opt
                        );
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => toggleOption(question.key, opt)}
                            className={`flex items-center justify-between rounded-lg border px-4 py-2.5 text-left text-sm transition-colors ${
                              selected
                                ? "border-foreground bg-foreground text-background"
                                : "border-black/[.08] bg-white text-black hover:border-black/[.2] dark:border-white/[.145] dark:bg-zinc-900 dark:text-zinc-50 dark:hover:border-white/[.3]"
                            }`}
                          >
                            <span className="flex flex-col items-start">
                              <span>{optionLabel(opt)}</span>
                              {description && (
                                <span
                                  className={`text-xs ${
                                    selected
                                      ? "text-background/70"
                                      : "text-zinc-500 dark:text-zinc-400"
                                  }`}
                                >
                                  {description}
                                </span>
                              )}
                            </span>
                            {selected && <span>✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 0}
            className="rounded-full px-5 py-2.5 text-base font-medium text-zinc-600 disabled:opacity-0 dark:text-zinc-400"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed()}
            className="rounded-full bg-foreground px-8 py-2.5 text-base font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-[#ccc]"
          >
            {isLastStep ? "See my results" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

const INGREDIENT_INFO: Record<
  Ingredient,
  { whatItIs: string; howItWorks: string; whatItDoes: string }
> = {
  creatine: {
    whatItIs: "A naturally occurring compound stored in muscle as phosphocreatine.",
    howItWorks:
      "Replenishes ATP, your muscles' immediate energy source, during short bursts of effort.",
    whatItDoes: "Increases strength, power output, and high-intensity training capacity.",
  },
  citrulline: {
    whatItIs: "A non-essential amino acid, also known as citrulline malate in supplement form.",
    howItWorks: "Converts to arginine in the body, raising nitric oxide and widening blood vessels.",
    whatItDoes: "Improves blood flow and muscle pumps, and may reduce training fatigue.",
  },
  beta_alanine: {
    whatItIs: "An amino acid that combines with histidine to form carnosine in muscle tissue.",
    howItWorks: "Buffers acid buildup in muscles during repeated high-intensity efforts.",
    whatItDoes: "Delays muscular fatigue in sets and sprints lasting one to four minutes.",
  },
  caffeine: {
    whatItIs: "A central nervous system stimulant found in coffee, tea, and pre-workout formulas.",
    howItWorks: "Blocks adenosine receptors in the brain, reducing perceived fatigue and effort.",
    whatItDoes: "Boosts alertness, focus, and power output during training.",
  },
  protein: {
    whatItIs: "A whey-based protein powder, a fast-digesting complete protein from milk.",
    howItWorks: "Supplies essential amino acids that trigger muscle protein synthesis.",
    whatItDoes: "Helps repair and build muscle tissue after training.",
  },
  protein_plant: {
    whatItIs:
      "A plant-based protein blend, often pea, rice, or soy, used as a dairy-free protein source.",
    howItWorks: "Provides a complete or complementary amino acid profile to support muscle repair.",
    whatItDoes: "Supports muscle recovery and growth without animal-derived ingredients.",
  },
  electrolytes: {
    whatItIs: "A blend of minerals, typically sodium, potassium, and magnesium.",
    howItWorks:
      "Replaces minerals lost in sweat and helps maintain fluid balance and nerve/muscle signaling.",
    whatItDoes: "Reduces cramping risk and supports hydration during long or hot sessions.",
  },
  carb_fuel: {
    whatItIs: "A fast-digesting carbohydrate source, often maltodextrin or cluster dextrin.",
    howItWorks: "Tops up muscle and liver glycogen stores that fuel sustained effort.",
    whatItDoes: "Delays fatigue and maintains energy during long training sessions.",
  },
  beetroot: {
    whatItIs: "A concentrated extract from beetroot, naturally rich in dietary nitrates.",
    howItWorks: "Nitrates convert to nitric oxide, which relaxes and widens blood vessels.",
    whatItDoes: "Improves blood flow and oxygen efficiency, boosting endurance performance.",
  },
  joint_support: {
    whatItIs:
      "A blend built around glucosamine, chondroitin, or similar cartilage-supporting compounds.",
    howItWorks: "Supplies raw materials your body uses to maintain cartilage and joint fluid.",
    whatItDoes: "Supports joint comfort and mobility under repeated training stress.",
  },
  omega3: {
    whatItIs: "Fish oil supplying EPA and DHA, the primary omega-3 fatty acids.",
    howItWorks: "Incorporates into cell membranes and lowers production of inflammatory compounds.",
    whatItDoes:
      "Supports heart, brain, and joint health, and helps manage exercise-induced inflammation.",
  },
  omega3_algae: {
    whatItIs: "An algae-derived source of EPA and DHA, a plant-based alternative to fish oil.",
    howItWorks:
      "Works the same way as fish oil, since algae is the original source fish get their omega-3s from.",
    whatItDoes: "Supports heart, brain, and joint health without animal-derived ingredients.",
  },
  magnesium: {
    whatItIs: "An essential mineral involved in hundreds of enzymatic reactions in the body.",
    howItWorks:
      "Regulates muscle contraction and relaxation, nerve function, and the body's stress response.",
    whatItDoes: "Supports muscle recovery, sleep quality, and reduces cramping risk.",
  },
  ashwagandha: {
    whatItIs: "An adaptogenic herb used in traditional medicine for centuries.",
    howItWorks: "May help regulate cortisol, the body's primary stress hormone.",
    whatItDoes: "Helps manage stress and may support recovery, sleep, and steady energy levels.",
  },
  multivitamin: {
    whatItIs: "A broad-spectrum blend of essential vitamins and minerals.",
    howItWorks: "Fills small, common gaps between what your diet provides and what your body needs.",
    whatItDoes: "Supports overall health as a nutritional safety net.",
  },
  vitamin_d: {
    whatItIs: "A fat-soluble vitamin the body also produces from sun exposure.",
    howItWorks: "Regulates calcium absorption and supports immune and hormone signaling.",
    whatItDoes: "Supports bone density, immune function, and healthy hormone levels.",
  },
  fiber: {
    whatItIs: "A non-digestible carbohydrate from plant sources or purified supplement form.",
    howItWorks: "Adds bulk to digestion, feeds gut bacteria, and slows nutrient absorption.",
    whatItDoes: "Supports digestion, fullness, and steady blood sugar, useful during fat loss.",
  },
  tart_cherry: {
    whatItIs: "A concentrated extract from Montmorency tart cherries.",
    howItWorks:
      "Provides natural antioxidants and anti-inflammatory compounds, and supports natural melatonin production.",
    whatItDoes: "May reduce muscle soreness and support recovery after hard training.",
  },
  b_complex: {
    whatItIs: "A blend of all eight B vitamins (B1, B2, B3, B5, B6, B7, B9, B12).",
    howItWorks: "Acts as a cofactor in the metabolic pathways that turn food into usable energy.",
    whatItDoes: "Supports energy metabolism and nervous system function.",
  },
  glucosamine: {
    whatItIs: "A natural compound found in cartilage, taken here as a standalone supplement.",
    howItWorks: "Supplies a building block your body uses to maintain and repair cartilage.",
    whatItDoes: "Supports joint cartilage health, especially under repetitive training stress.",
  },
  soy_protein: {
    whatItIs: "A complete plant-based protein isolated from soybeans.",
    howItWorks: "Supplies a full essential amino acid profile that supports muscle protein synthesis.",
    whatItDoes: "Supports muscle repair and growth as a dairy-free protein source.",
  },
  oat_based: {
    whatItIs: "A carbohydrate source made from oats, often blended into recovery or fueling products.",
    howItWorks: "Provides slow-digesting starches and fiber for sustained energy release.",
    whatItDoes: "Fuels training and refuels glycogen without a fast blood sugar spike.",
  },
  b12: {
    whatItIs: "Vitamin B12 (cobalamin), a nutrient found almost exclusively in animal products.",
    howItWorks: "Supports red blood cell formation and nerve cell maintenance.",
    whatItDoes:
      "Supports energy metabolism, especially important if you eat little or no animal products.",
  },
  iron: {
    whatItIs: "An essential mineral central to the structure of hemoglobin.",
    howItWorks: "Carries oxygen from your lungs to your muscles via red blood cells.",
    whatItDoes: "Supports oxygen delivery and helps prevent fatigue linked to low iron stores.",
  },
  calcium: {
    whatItIs: "The most abundant mineral in the body, mostly stored in bones and teeth.",
    howItWorks: "Provides structural material for bone and enables muscle contraction and nerve signaling.",
    whatItDoes: "Supports bone density and strength, especially important as you age.",
  },
  melatonin: {
    whatItIs: "A hormone your body naturally produces in response to darkness.",
    howItWorks: "Signals your brain that it's time to wind down and shifts your internal body clock.",
    whatItDoes: "Helps you fall asleep faster, especially useful when sleep is disrupted.",
  },
  glycine: {
    whatItIs: "A simple, non-essential amino acid found throughout the body's proteins.",
    howItWorks:
      "May lower core body temperature slightly and support neurotransmitter activity linked to calm.",
    whatItDoes: "Supports deeper, more restorative sleep quality.",
  },
};

function ResultsView({
  result,
  onRestart,
}: {
  result: EngineResult;
  onRestart: () => void;
}) {
  if (result.gate === "UNDER_18_BLOCK") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-16 text-center font-sans dark:bg-black">
        <div className="w-full max-w-lg">
          <h1 className="mb-4 text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            We can&apos;t recommend supplements here
          </h1>
          <p className="mb-8 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Supplement recommendations aren&apos;t available for athletes under 18.
            Please talk to a parent, guardian, or physician about what&apos;s
            appropriate.
          </p>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={onRestart}
              className="rounded-full border border-black/[.08] px-6 py-2.5 text-base font-medium text-black transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a]"
            >
              Start over
            </button>
            <Link
              href="/"
              className="flex items-center rounded-full bg-foreground px-6 py-2.5 text-base font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
            >
              Back home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const toRecommend = [...(result.toRecommend ?? [])];
  const alreadyCovered = [...(result.alreadyCovered ?? [])];
  const reasons = result.reasons;

  const rankedToRecommend = [...toRecommend].sort(
    (a, b) => (reasons[b]?.length ?? 0) - (reasons[a]?.length ?? 0)
  );
  const essential = rankedToRecommend.slice(0, 3);
  const otherOptions = rankedToRecommend.slice(3);

  return (
    <ResultsViewInner
      result={result}
      onRestart={onRestart}
      essential={essential}
      otherOptions={otherOptions}
      alreadyCovered={alreadyCovered}
      reasons={reasons}
    />
  );
}

function ResultsViewInner({
  result,
  onRestart,
  essential,
  otherOptions,
  alreadyCovered,
  reasons,
}: {
  result: EngineResult;
  onRestart: () => void;
  essential: Ingredient[];
  otherOptions: Ingredient[];
  alreadyCovered: Ingredient[];
  reasons: Partial<Record<Ingredient, string[]>>;
}) {
  const [selected, setSelected] = useState<Ingredient | null>(null);

  function pillButton(ing: Ingredient, variant: "essential" | "other" | "covered") {
    const styles = {
      essential:
        "border-foreground bg-foreground text-background hover:opacity-90",
      other:
        "border-black/[.08] bg-white text-black hover:border-black/[.2] dark:border-white/[.145] dark:bg-zinc-900 dark:text-zinc-50 dark:hover:border-white/[.3]",
      covered:
        "border-dashed border-black/[.15] text-zinc-600 hover:border-black/[.3] dark:border-white/[.2] dark:text-zinc-400 dark:hover:border-white/[.35]",
    }[variant];
    return (
      <li key={ing}>
        <button
          type="button"
          onClick={() => setSelected(ing)}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${styles}`}
        >
          {optionLabel(ing)}
        </button>
      </li>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <div className="w-full max-w-xl">
        <p className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {result.gate === "certified_only"
            ? "Drug-tested athlete: showing NSF Certified for Sport options only"
            : "Full catalog"}
        </p>
        <h1 className="mb-2 text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Your recommendations
        </h1>
        <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">
          Tap any supplement to see what it is, how it works, and why it&apos;s in your stack.
        </p>

        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Essential
          </h2>
          {essential.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {essential.map((ing) => pillButton(ing, "essential"))}
            </ul>
          ) : (
            <p className="text-base text-zinc-600 dark:text-zinc-400">
              Nothing new to add — you&apos;re already covering everything we&apos;d
              suggest.
            </p>
          )}
        </section>

        {otherOptions.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Other options
            </h2>
            <ul className="flex flex-wrap gap-2">
              {otherOptions.map((ing) => pillButton(ing, "other"))}
            </ul>
          </section>
        )}

        {alreadyCovered.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Already covered
            </h2>
            <ul className="flex flex-wrap gap-2">
              {alreadyCovered.map((ing) => pillButton(ing, "covered"))}
            </ul>
          </section>
        )}

        {result.notes.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Notes
            </h2>
            <ul className="flex flex-col gap-2">
              {result.notes.map((note, i) => (
                <li
                  key={i}
                  className="text-sm leading-6 text-zinc-600 dark:text-zinc-400"
                >
                  {note}
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onRestart}
            className="rounded-full border border-black/[.08] px-6 py-2.5 text-base font-medium text-black transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a]"
          >
            Retake survey
          </button>
          <Link
            href="/"
            className="flex items-center rounded-full bg-foreground px-6 py-2.5 text-base font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Back home
          </Link>
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <h3 className="text-xl font-semibold text-black dark:text-zinc-50">
                {optionLabel(selected)}
              </h3>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="text-lg text-zinc-500 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
                  What it is
                </p>
                <p>{INGREDIENT_INFO[selected].whatItIs}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
                  How it works
                </p>
                <p>{INGREDIENT_INFO[selected].howItWorks}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
                  What it does
                </p>
                <p>{INGREDIENT_INFO[selected].whatItDoes}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
                  Why it&apos;s in your stack
                </p>
                {(reasons[selected]?.length ?? 0) > 0 ? (
                  <ul className="flex flex-col gap-1">
                    {reasons[selected]!.map((r, i) => (
                      <li key={i}>• {r}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Included as part of your recommended stack.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
