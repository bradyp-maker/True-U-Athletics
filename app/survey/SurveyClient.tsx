"use client";

import { useState } from "react";
import { MULTI_SELECT, SINGLE_SELECT, type Answers, type EngineResult } from "@/lib/engine";
import { optionLabel } from "@/lib/labels";
import { generateStackAction, saveStackAction } from "./actions";
import { SurveyGate } from "@/components/SurveyGate";
import { ResultsView } from "@/components/ResultsView";
import { SaveStackButton } from "@/components/SaveStackButton";

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

type GateReason = "signup_required" | "limit_reached" | "daily_limit_reached";

export default function SurveyClient() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<DraftAnswers>(INITIAL_ANSWERS);
  const [result, setResult] = useState<EngineResult | null>(null);
  const [fullResults, setFullResults] = useState(true);
  const [gate, setGate] = useState<GateReason | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otherMenuOpen, setOtherMenuOpen] = useState(false);

  const question = QUESTIONS[step];
  const isLastStep = step === QUESTIONS.length - 1;

  function goToStep(next: number) {
    setOtherMenuOpen(false);
    setStep(next);
  }

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

  async function submitForResults(finalAnswers: Answers) {
    setIsSubmitting(true);
    try {
      const response = await generateStackAction(finalAnswers);
      if (response.blocked) {
        setGate(response.reason);
        return;
      }
      if (response.needsAnonMark) {
        // Fire-and-forget: a plain fetch to a Route Handler, not a Server
        // Action, so it can't trigger a route re-render that would clobber
        // the results we're about to show.
        fetch("/api/mark-stack-used", { method: "POST" }).catch(() => {});
      }
      setFullResults(response.fullResults);
      setResult(response.result);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleNext() {
    if (!canProceed() || isSubmitting) return;
    if (isLastStep) {
      await submitForResults(answers as Answers);
    } else {
      goToStep(step + 1);
    }
  }

  function handleBack() {
    goToStep(Math.max(0, step - 1));
  }

  const AUTO_ADVANCE_ON_NONE = new Set(["q8_allergies"]);

  async function handleOptionClick(opt: string, wasSelected: boolean) {
    if (isSubmitting) return;

    if (question.kind === "multi") {
      toggleOption(question.key, opt);
      if (
        opt === "none" &&
        !wasSelected &&
        AUTO_ADVANCE_ON_NONE.has(question.key)
      ) {
        goToStep(Math.min(step + 1, QUESTIONS.length - 1));
      }
      return;
    }

    selectSingle(question.key, opt);
    if (isLastStep) {
      await submitForResults({ ...answers, [question.key]: opt } as Answers);
    } else {
      goToStep(step + 1);
    }
  }

  function handleRestart() {
    setAnswers(INITIAL_ANSWERS);
    setOtherMenuOpen(false);
    setStep(0);
    setResult(null);
    setGate(null);
  }

  if (gate) {
    return <SurveyGate variant={gate} />;
  }

  if (result) {
    return (
      <ResultsView
        result={result}
        onRestart={handleRestart}
        fullResults={fullResults}
        extraActions={
          fullResults ? (
            <SaveStackButton
              onSave={() => saveStackAction(answers as Answers)}
            />
          ) : undefined
        }
      />
    );
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
                disabled={isSubmitting}
                className={`flex flex-col items-start justify-center rounded-xl border px-5 py-3.5 text-left text-base transition-all duration-150 disabled:opacity-60 ${
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
            disabled={step === 0 || isSubmitting}
            className="rounded-full px-5 py-2.5 text-base font-medium text-muted transition-colors hover:text-foreground disabled:opacity-0"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
            className="rounded-full bg-accent px-8 py-2.5 text-base font-bold text-accent-foreground transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_24px_-6px_rgba(198,255,63,0.55)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-30"
          >
            {isSubmitting ? "Generating…" : isLastStep ? "See my results" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
