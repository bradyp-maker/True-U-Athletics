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

  const AUTO_ADVANCE_ON_NONE = new Set(["q8_allergies"]);

  function handleOptionClick(opt: string, wasSelected: boolean) {
    if (question.kind === "multi") {
      toggleOption(question.key, opt);
      if (
        opt === "none" &&
        !wasSelected &&
        AUTO_ADVANCE_ON_NONE.has(question.key)
      ) {
        setStep((s) => Math.min(s + 1, QUESTIONS.length - 1));
      }
      return;
    }

    selectSingle(question.key, opt);
    if (isLastStep) {
      setResult(buildStack({ ...answers, [question.key]: opt } as Answers));
    } else {
      setStep((s) => s + 1);
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
    <div className="flex flex-1 flex-col items-center bg-background px-6 py-16 sm:py-24">
      <div key={step} className="w-full max-w-xl animate-fade-up">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
          Question {step + 1} of {QUESTIONS.length}
        </p>
        <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-accent transition-all duration-300"
            style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>

        <h1 className="mb-6 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
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
                className={`flex flex-col items-start justify-center rounded-xl border px-5 py-3.5 text-left text-base transition-all duration-150 ${
                  selected
                    ? "border-accent bg-accent text-accent-foreground shadow-[0_0_24px_-6px_rgba(198,255,63,0.5)]"
                    : "border-white/10 bg-surface text-foreground hover:border-white/25 hover:bg-surface-2"
                }`}
              >
                <span className="font-medium">{optionLabel(opt)}</span>
                {description && (
                  <span
                    className={`text-sm ${
                      selected ? "text-accent-foreground/70" : "text-muted"
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
                    className="flex w-full items-center justify-between rounded-xl border border-dashed border-white/15 bg-transparent px-5 py-3.5 text-left text-base text-foreground transition-colors hover:border-white/30 hover:bg-surface"
                  >
                    <span className="font-medium">Other supplements</span>
                    <span className="text-sm text-muted">
                      {otherSelectedCount > 0
                        ? `${otherSelectedCount} selected`
                        : "Show more"}
                    </span>
                  </button>
                  {otherMenuOpen && (
                    <div className="mt-3 flex flex-col gap-2 rounded-xl border border-white/10 bg-surface p-3">
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
                                ? "border-accent bg-accent text-accent-foreground"
                                : "border-white/10 bg-surface-2 text-foreground hover:border-white/25"
                            }`}
                          >
                            <span className="flex flex-col items-start">
                              <span className="font-medium">{optionLabel(opt)}</span>
                              {description && (
                                <span
                                  className={`text-xs ${
                                    selected
                                      ? "text-accent-foreground/70"
                                      : "text-muted"
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
            className="rounded-full px-5 py-2.5 text-base font-medium text-muted transition-colors hover:text-foreground disabled:opacity-0"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed()}
            className="rounded-full bg-accent px-8 py-2.5 text-base font-bold text-accent-foreground transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_24px_-6px_rgba(198,255,63,0.55)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-30"
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

type IngredientPair = { pair: [Ingredient, Ingredient]; reason: string };

const SYNERGIES: IngredientPair[] = [
  {
    pair: ["creatine", "beta_alanine"],
    reason: "Both support high-intensity power output — commonly stacked for strength and explosiveness.",
  },
  {
    pair: ["creatine", "citrulline"],
    reason: "Citrulline's blood flow boost pairs well with creatine's strength and power benefits.",
  },
  {
    pair: ["beta_alanine", "citrulline"],
    reason: "Together they support harder sets — buffering fatigue while improving blood flow.",
  },
  {
    pair: ["caffeine", "beta_alanine"],
    reason: "A classic pre-workout combo: caffeine for focus and drive, beta-alanine for muscular endurance.",
  },
  {
    pair: ["caffeine", "citrulline"],
    reason: "Both are commonly used pre-training to boost energy and blood flow together.",
  },
  {
    pair: ["protein", "creatine"],
    reason: "Protein supplies the building blocks for muscle repair while creatine fuels the effort that creates it.",
  },
  {
    pair: ["protein_plant", "creatine"],
    reason: "Protein supplies the building blocks for muscle repair while creatine fuels the effort that creates it.",
  },
  {
    pair: ["vitamin_d", "calcium"],
    reason: "Vitamin D increases calcium absorption in the gut, so they work best taken together.",
  },
  {
    pair: ["vitamin_d", "magnesium"],
    reason: "Magnesium is required to convert vitamin D into its active form in the body.",
  },
  {
    pair: ["omega3", "joint_support"],
    reason: "Both are anti-inflammatory and support joint comfort from different angles.",
  },
  {
    pair: ["omega3_algae", "joint_support"],
    reason: "Both are anti-inflammatory and support joint comfort from different angles.",
  },
  {
    pair: ["magnesium", "melatonin"],
    reason: "Both support the body's natural wind-down process for deeper sleep.",
  },
  {
    pair: ["magnesium", "glycine"],
    reason: "Both calm the nervous system and support deeper, more restorative sleep.",
  },
  {
    pair: ["magnesium", "ashwagandha"],
    reason: "Together they support the body's stress response and recovery overnight.",
  },
  {
    pair: ["electrolytes", "carb_fuel"],
    reason: "Covers both fluid/mineral balance and energy fueling during long training sessions.",
  },
  {
    pair: ["electrolytes", "beetroot"],
    reason: "Supports hydration and blood flow together during endurance efforts.",
  },
  {
    pair: ["b12", "iron"],
    reason: "Both support energy and red blood cell production — commonly paired on plant-based diets.",
  },
  {
    pair: ["b12", "b_complex"],
    reason: "B-complex covers the broader B-vitamin picture while B12 fills the most diet-restricted gap.",
  },
  {
    pair: ["tart_cherry", "magnesium"],
    reason: "Both support recovery and sleep quality after hard training.",
  },
];

const CAUTIONS: IngredientPair[] = [
  {
    pair: ["calcium", "iron"],
    reason: "Calcium can block iron absorption — take them at different times of day.",
  },
  {
    pair: ["calcium", "magnesium"],
    reason: "High doses compete for absorption — space them out rather than taking a big dose of both at once.",
  },
  {
    pair: ["caffeine", "melatonin"],
    reason: "They work against each other — caffeine stimulates while melatonin signals sleep. Keep them hours apart.",
  },
  {
    pair: ["caffeine", "ashwagandha"],
    reason: "Caffeine can counteract ashwagandha's calming, stress-lowering effect — consider taking at different times.",
  },
  {
    pair: ["iron", "multivitamin"],
    reason: "Many multivitamins already contain iron — check labels to avoid unintentionally doubling your dose.",
  },
  {
    pair: ["melatonin", "ashwagandha"],
    reason: "Both are calming — stacking full doses can cause excess grogginess. Start with one at a time.",
  },
];

function ResultsView({
  result,
  onRestart,
}: {
  result: EngineResult;
  onRestart: () => void;
}) {
  if (result.gate === "UNDER_18_BLOCK") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-16 text-center">
        <div className="w-full max-w-lg animate-fade-up">
          <h1 className="mb-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            We can&apos;t recommend supplements here
          </h1>
          <p className="mb-8 text-lg leading-8 text-muted">
            Supplement recommendations aren&apos;t available for athletes under 18.
            Please talk to a parent, guardian, or physician about what&apos;s
            appropriate.
          </p>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={onRestart}
              className="rounded-full border border-white/10 px-6 py-2.5 text-base font-medium text-foreground transition-colors hover:border-white/25 hover:bg-surface"
            >
              Start over
            </button>
            <Link
              href="/"
              className="flex items-center rounded-full bg-accent px-6 py-2.5 text-base font-bold text-accent-foreground transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_24px_-6px_rgba(198,255,63,0.55)] active:scale-[0.98]"
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
        "border-accent bg-accent text-accent-foreground shadow-[0_0_20px_-6px_rgba(198,255,63,0.5)] hover:scale-[1.04]",
      other:
        "border-white/10 bg-surface text-foreground hover:border-white/25 hover:bg-surface-2 hover:scale-[1.04]",
      covered:
        "border-dashed border-white/15 text-muted hover:border-white/30 hover:scale-[1.04]",
    }[variant];
    return (
      <li key={ing}>
        <button
          type="button"
          onClick={() => setSelected(ing)}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-150 ${styles}`}
        >
          {optionLabel(ing)}
        </button>
      </li>
    );
  }

  const relevantSynergies = SYNERGIES.filter(
    (s) => result.stack.has(s.pair[0]) && result.stack.has(s.pair[1])
  );
  const relevantCautions = CAUTIONS.filter(
    (c) => result.stack.has(c.pair[0]) && result.stack.has(c.pair[1])
  );

  return (
    <div className="flex flex-1 flex-col items-center bg-background px-6 py-16 sm:py-24">
      <div className="w-full max-w-xl animate-fade-up">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
          {result.gate === "certified_only"
            ? "Drug-tested athlete: showing NSF Certified for Sport options only"
            : "Full catalog"}
        </p>
        <h1 className="mb-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Your supplement stack
        </h1>
        <p className="mb-8 text-sm text-muted">
          Tap any supplement to see what it is, how it works, and why it&apos;s in your stack.
        </p>

        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-2">
            Essential
          </h2>
          {essential.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {essential.map((ing) => pillButton(ing, "essential"))}
            </ul>
          ) : (
            <p className="text-base text-muted">
              Nothing new to add — you&apos;re already covering everything we&apos;d
              suggest.
            </p>
          )}
        </section>

        {otherOptions.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-2">
              Other options
            </h2>
            <ul className="flex flex-wrap gap-2">
              {otherOptions.map((ing) => pillButton(ing, "other"))}
            </ul>
          </section>
        )}

        {alreadyCovered.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-2">
              Already covered
            </h2>
            <ul className="flex flex-wrap gap-2">
              {alreadyCovered.map((ing) => pillButton(ing, "covered"))}
            </ul>
          </section>
        )}

        {(relevantSynergies.length > 0 || relevantCautions.length > 0) && (
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-2">
              Synergy breakdown
            </h2>
            <div className="flex flex-col gap-4">
              {relevantSynergies.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">
                    Take together
                  </p>
                  <ul className="flex flex-col gap-2">
                    {relevantSynergies.map((s, i) => (
                      <li
                        key={i}
                        className="rounded-xl border border-accent/20 bg-accent-soft px-4 py-3 text-sm leading-6 text-muted"
                      >
                        <span className="font-medium text-foreground">
                          {optionLabel(s.pair[0])} + {optionLabel(s.pair[1])}
                        </span>
                        <br />
                        {s.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {relevantCautions.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-caution">
                    Take apart / use caution
                  </p>
                  <ul className="flex flex-col gap-2">
                    {relevantCautions.map((c, i) => (
                      <li
                        key={i}
                        className="rounded-xl border border-caution/20 bg-caution-soft px-4 py-3 text-sm leading-6 text-muted"
                      >
                        <span className="font-medium text-foreground">
                          {optionLabel(c.pair[0])} + {optionLabel(c.pair[1])}
                        </span>
                        <br />
                        {c.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {result.notes.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-2">
              Notes
            </h2>
            <ul className="flex flex-col gap-2">
              {result.notes.map((note, i) => (
                <li key={i} className="text-sm leading-6 text-muted">
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
            className="rounded-full border border-white/10 px-6 py-2.5 text-base font-medium text-foreground transition-colors hover:border-white/25 hover:bg-surface"
          >
            Retake survey
          </button>
          <Link
            href="/"
            className="flex items-center rounded-full bg-accent px-6 py-2.5 text-base font-bold text-accent-foreground transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_24px_-6px_rgba(198,255,63,0.55)] active:scale-[0.98]"
          >
            Back home
          </Link>
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-md animate-fade-up rounded-2xl border border-white/10 bg-surface p-6 shadow-[0_0_60px_-12px_rgba(198,255,63,0.15)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <h3 className="font-display text-xl font-bold text-foreground">
                {optionLabel(selected)}
              </h3>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="text-lg text-muted transition-colors hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-4 text-sm leading-6 text-muted">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-2">
                  What it is
                </p>
                <p>{INGREDIENT_INFO[selected].whatItIs}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-2">
                  How it works
                </p>
                <p>{INGREDIENT_INFO[selected].howItWorks}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-2">
                  What it does
                </p>
                <p>{INGREDIENT_INFO[selected].whatItDoes}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-2">
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
