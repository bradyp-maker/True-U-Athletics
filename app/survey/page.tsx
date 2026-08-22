"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MULTI_SELECT,
  SINGLE_SELECT,
  buildStack,
  type Answers,
  type EngineResult,
} from "@/lib/engine";

const LABELS: Record<string, string> = {
  // q1 training focus
  strength: "Strength",
  bodybuilding: "Bodybuilding",
  endurance: "Endurance",
  team_sports: "Team sports",
  crossfit: "CrossFit / mixed conditioning",
  combat: "Combat sports",
  general_wellness: "General wellness",
  // q2 goals
  build_muscle: "Build muscle",
  lose_fat: "Lose fat",
  increase_strength: "Increase strength",
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

  const question = QUESTIONS[step];
  const isLastStep = step === QUESTIONS.length - 1;

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
          {question.options.map((opt) => {
            const selected =
              question.kind === "multi"
                ? Array.isArray(answers[question.key]) &&
                  (answers[question.key] as string[]).includes(opt)
                : answers[question.key] === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() =>
                  question.kind === "multi"
                    ? toggleOption(question.key, opt)
                    : selectSingle(question.key, opt)
                }
                className={`flex items-center justify-between rounded-xl border px-5 py-3 text-left text-base transition-colors ${
                  selected
                    ? "border-foreground bg-foreground text-background"
                    : "border-black/[.08] bg-white text-black hover:border-black/[.2] dark:border-white/[.145] dark:bg-zinc-900 dark:text-zinc-50 dark:hover:border-white/[.3]"
                }`}
              >
                {optionLabel(opt)}
              </button>
            );
          })}
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

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <div className="w-full max-w-xl">
        <p className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {result.gate === "certified_only"
            ? "Drug-tested athlete: showing NSF Certified for Sport options only"
            : "Full catalog"}
        </p>
        <h1 className="mb-8 text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Your recommendations
        </h1>

        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Recommended for you
          </h2>
          {toRecommend.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {toRecommend.map((ing) => (
                <li
                  key={ing}
                  className="rounded-full border border-black/[.08] bg-white px-4 py-1.5 text-sm font-medium text-black dark:border-white/[.145] dark:bg-zinc-900 dark:text-zinc-50"
                >
                  {optionLabel(ing)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-base text-zinc-600 dark:text-zinc-400">
              Nothing new to add — you&apos;re already covering everything we&apos;d
              suggest.
            </p>
          )}
        </section>

        {alreadyCovered.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Already covered
            </h2>
            <ul className="flex flex-wrap gap-2">
              {alreadyCovered.map((ing) => (
                <li
                  key={ing}
                  className="rounded-full border border-dashed border-black/[.15] px-4 py-1.5 text-sm font-medium text-zinc-600 dark:border-white/[.2] dark:text-zinc-400"
                >
                  {optionLabel(ing)}
                </li>
              ))}
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
    </div>
  );
}
