export const LABELS: Record<string, string> = {
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

export function optionLabel(value: string): string {
  return LABELS[value] ?? value;
}
