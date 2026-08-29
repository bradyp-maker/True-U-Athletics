"use client";

import { useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";
import { SignUpButton } from "@clerk/nextjs";
import type { EngineResult, Ingredient } from "@/lib/engine";
import { optionLabel } from "@/lib/labels";
import { getProductsForIngredient } from "@/lib/shopProducts";

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
    whatItIs:
      "A whey-based protein powder, a fast-digesting complete protein from milk. It's sold in a " +
      "few forms: whey concentrate (standard, some carbs/fat), whey isolate (leaner, less lactose, " +
      "better if you're cutting or dairy-sensitive), or a \"mass gainer\" blend (whey plus added " +
      "carbs, for a calorie surplus if you're struggling to eat enough to bulk). The amino acid " +
      "profile that builds muscle is essentially the same across all three — pick the one that fits " +
      "your calorie goal.",
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

export function ResultsView({
  result,
  fullResults,
  onRestart,
  backHref = "/",
  backLabel = "Back home",
  extraActions,
  signUpRedirectUrl = "/survey",
  titleOverride,
}: {
  result: EngineResult;
  fullResults: boolean;
  onRestart?: () => void;
  backHref?: string;
  backLabel?: string;
  extraActions?: ReactNode;
  signUpRedirectUrl?: string;
  titleOverride?: ReactNode;
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
            {onRestart && (
              <button
                type="button"
                onClick={onRestart}
                className="rounded-full border border-white/10 px-6 py-2.5 text-base font-medium text-foreground transition-colors hover:border-white/25 hover:bg-surface"
              >
                Start over
              </button>
            )}
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
      backHref={backHref}
      backLabel={backLabel}
      extraActions={extraActions}
      essential={essential}
      otherOptions={otherOptions}
      alreadyCovered={alreadyCovered}
      reasons={reasons}
      fullResults={fullResults}
      signUpRedirectUrl={signUpRedirectUrl}
      titleOverride={titleOverride}
    />
  );
}

function ResultsViewInner({
  result,
  onRestart,
  backHref,
  backLabel,
  extraActions,
  essential,
  otherOptions,
  alreadyCovered,
  reasons,
  fullResults,
  signUpRedirectUrl,
  titleOverride,
}: {
  result: EngineResult;
  onRestart?: () => void;
  backHref: string;
  backLabel: string;
  extraActions?: ReactNode;
  essential: Ingredient[];
  otherOptions: Ingredient[];
  alreadyCovered: Ingredient[];
  reasons: Partial<Record<Ingredient, string[]>>;
  fullResults: boolean;
  signUpRedirectUrl: string;
  titleOverride?: ReactNode;
}) {
  const [selected, setSelected] = useState<Ingredient | null>(null);
  const productsForSelected = selected ? getProductsForIngredient(selected) : [];

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
          className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-150 ${styles}`}
        >
          {optionLabel(ing)}
          {(variant === "essential" || variant === "other") && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5 opacity-60"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <line x1="12" y1="11" x2="12" y2="16" />
              <circle cx="12" cy="8" r="0.5" fill="currentColor" stroke="none" />
            </svg>
          )}
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
        {titleOverride ?? (
          <h1 className="mb-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Your supplement stack
          </h1>
        )}
        <p className="mb-8 text-sm text-muted">
          {fullResults
            ? "Tap any supplement to see what it is, how it works, and why it's in your stack."
            : "Here's a preview of your stack. Create a free account to see the rest."}
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

        {!fullResults && (
          <section className="mb-8 rounded-2xl border border-accent/20 bg-accent-soft p-6">
            <h2 className="font-display text-lg font-bold text-foreground">
              See your full stack
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Create a free account to unlock your full results — every
              supplement we&apos;d recommend, what you&apos;re already
              covering, and the synergy breakdown — and save your stack.
            </p>
            <SignUpButton mode="modal" forceRedirectUrl={signUpRedirectUrl}>
              <button
                type="button"
                className="mt-4 flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-bold text-accent-foreground transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_24px_-6px_rgba(198,255,63,0.55)] active:scale-[0.98]"
              >
                Create free account
              </button>
            </SignUpButton>
          </section>
        )}

        {fullResults && otherOptions.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-2">
              Other supplements for your stack
            </h2>
            <ul className="flex flex-wrap gap-2">
              {otherOptions.map((ing) => pillButton(ing, "other"))}
            </ul>
          </section>
        )}

        {fullResults && alreadyCovered.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-2">
              Already covered
            </h2>
            <ul className="flex flex-wrap gap-2">
              {alreadyCovered.map((ing) => pillButton(ing, "covered"))}
            </ul>
          </section>
        )}

        {fullResults && (relevantSynergies.length > 0 || relevantCautions.length > 0) && (
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

        {fullResults && result.notes.length > 0 && (
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

        {extraActions && <div className="mb-8">{extraActions}</div>}

        <div className="flex flex-wrap gap-4">
          {onRestart && (
            <button
              type="button"
              onClick={onRestart}
              className="rounded-full border border-white/10 px-6 py-2.5 text-base font-medium text-foreground transition-colors hover:border-white/25 hover:bg-surface"
            >
              Retake survey
            </button>
          )}
          <Link
            href={backHref}
            className="flex items-center rounded-full bg-accent px-6 py-2.5 text-base font-bold text-accent-foreground transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_24px_-6px_rgba(198,255,63,0.55)] active:scale-[0.98]"
          >
            {backLabel}
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
              {productsForSelected.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-2">
                    Shop this (affiliate links)
                  </p>
                  <div className="flex flex-col gap-2">
                    {productsForSelected.map((product) => (
                      <a
                        key={product.id}
                        href={product.affiliateUrl}
                        target="_blank"
                        rel="noopener sponsored"
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-surface-2 p-3 transition-colors hover:border-white/25"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element -- per-product Amazon SiteStripe image URLs can't be pre-registered as next/image remote patterns */}
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-12 w-12 shrink-0 object-contain"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">
                            {product.name}
                          </p>
                          <p className="text-xs font-semibold text-accent">Shop on Amazon →</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
