import type { Ingredient } from "@/lib/engine";

export type ShopProduct = {
  id: string;
  /** Which supplement category this product is a buy option for — matches the
   *  Ingredient tapped in the results/saved-stack detail view. */
  ingredient: Ingredient;
  name: string;
  blurb: string;
  imageUrl: string;
  affiliateUrl: string;
};

/**
 * Amazon Associates products shown on the Supplement Shop page and in the
 * "Shop this" section of the ingredient detail popup on results/stack pages.
 *
 * For each product, open its Amazon listing while signed into your
 * Associates account and use the SiteStripe toolbar at the top of the page:
 *   - affiliateUrl: SiteStripe "Text" tab -> "Get Link". Your tracking tag
 *     is already baked into that URL, so any purchase within Amazon's
 *     cookie window after someone clicks it credits your account.
 *   - imageUrl: SiteStripe "Image" tab -> copy the image URL shown there
 *     (an amazon-adsystem.com widget link). That's the image Amazon
 *     intends for reuse on other sites, so use it instead of hotlinking a
 *     product photo some other way.
 *
 * Don't include a price here — Amazon's Associates terms require pricing
 * shown off-Amazon to stay current, and it's simplest to just not display
 * one and let the "Shop on Amazon" link take people to the live price.
 *
 * You can list more than one product per ingredient (e.g. a whey isolate AND
 * a mass gainer both tagged "protein") — every matching product shows up
 * together wherever that ingredient is displayed.
 */
export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: "venture-pal-creatine-monohydrate",
    ingredient: "creatine",
    name: "Venture Pal Micronized Creatine Monohydrate",
    blurb: "Unflavored micronized creatine — vegan, keto, and gluten-free.",
    imageUrl: "https://m.media-amazon.com/images/I/71u70cG0tqL._AC_SL1500_.jpg",
    affiliateUrl: "https://amzn.to/4ck6V26",
  },
  {
    id: "nutricost-citrulline-malate",
    ingredient: "citrulline",
    name: "Nutricost L-Citrulline Malate (2:1) Powder",
    blurb: "Citrulline malate for blood flow and workout pumps.",
    imageUrl: "https://m.media-amazon.com/images/I/717WRn45KUL._AC_SY300_SX300_QL70_FMwebp_.jpg",
    affiliateUrl: "https://www.amazon.com/dp/B00N1A2JM8?tag=trueusuppleme-20",
  },
  {
    id: "now-foods-beta-alanine",
    ingredient: "beta_alanine",
    name: "NOW Foods Beta-Alanine Pure Powder",
    blurb: "Buffers muscle fatigue during high-intensity sets.",
    imageUrl: "https://m.media-amazon.com/images/I/71s20SHMnSL._AC_SY300_SX300_QL70_FMwebp_.jpg",
    affiliateUrl: "https://www.amazon.com/dp/B0017KU74Q?tag=trueusuppleme-20",
  },
  {
    id: "nutricost-caffeine-pills",
    ingredient: "caffeine",
    name: "Nutricost Caffeine Pills, 200mg",
    blurb: "200mg caffeine capsules for focus and energy pre-training.",
    imageUrl: "https://m.media-amazon.com/images/I/61RJCddLtrL._AC_SY879_.jpg",
    affiliateUrl: "https://www.amazon.com/dp/B01KKX0GXM?tag=trueusuppleme-20",
  },
  {
    id: "naked-whey-protein",
    ingredient: "protein",
    name: "NAKED Whey 100% Grass Fed Whey Protein",
    blurb: "One ingredient, grass-fed whey — easy to mix into anything.",
    imageUrl: "https://m.media-amazon.com/images/I/71eTbwJ22OL._AC_SY300_SX300_QL70_FMwebp_.jpg",
    affiliateUrl: "https://www.amazon.com/dp/B00XIKPUK4?tag=trueusuppleme-20",
  },
  {
    id: "isopure-plant-protein",
    ingredient: "protein_plant",
    name: "Isopure Plant-Based Protein Powder, Unflavored",
    blurb: "Unflavored pea and rice protein blend — dairy-free complete protein.",
    imageUrl: "https://m.media-amazon.com/images/I/61WvfH1ikpL._AC_SX679_.jpg",
    affiliateUrl: "https://www.amazon.com/dp/B07PJZQ621?tag=trueusuppleme-20",
  },
  {
    id: "ultima-replenisher-electrolytes",
    ingredient: "electrolytes",
    name: "Ultima Replenisher Electrolyte Packets",
    blurb: "Sugar-free electrolyte packets for hydration during long sessions.",
    imageUrl: "https://m.media-amazon.com/images/I/711WJgJ7LzL._AC_SY300_SX300_QL70_FMwebp_.jpg",
    affiliateUrl: "https://www.amazon.com/dp/B08XQZX9K3?tag=trueusuppleme-20",
  },
  {
    id: "now-foods-carbo-gain",
    ingredient: "carb_fuel",
    name: "NOW Foods Carbo Gain Powder (Maltodextrin)",
    blurb: "Pure maltodextrin to top off glycogen during long training.",
    imageUrl: "https://m.media-amazon.com/images/I/81qOK7VcEEL._AC_SX679_.jpg",
    affiliateUrl: "https://www.amazon.com/dp/B000MD8AAM?tag=trueusuppleme-20",
  },
  {
    id: "zazzee-beet-root-extract",
    ingredient: "beetroot",
    name: "Zazzee USDA Organic Beet Root Extract",
    blurb: "Concentrated beet root extract to support blood flow and endurance.",
    imageUrl: "https://m.media-amazon.com/images/I/71F44cR-HyL._AC_SX466_.jpg",
    affiliateUrl: "https://www.amazon.com/dp/B07SLFG6JY?tag=trueusuppleme-20",
  },
  {
    id: "nature-made-glucosamine-chondroitin-msm",
    ingredient: "joint_support",
    name: "Nature Made Glucosamine Chondroitin Complex with MSM",
    blurb: "Glucosamine, chondroitin, and MSM for joint comfort under training stress.",
    imageUrl: "https://m.media-amazon.com/images/I/7171pQmt8yL._AC_SX679_.jpg",
    affiliateUrl: "https://www.amazon.com/dp/B09YDMDMDP?tag=trueusuppleme-20",
  },
  {
    id: "sports-research-omega-3-fish-oil",
    ingredient: "omega3",
    name: "Sports Research Omega-3 Fish Oil",
    blurb: "Fish oil delivering EPA and DHA for heart, brain, and joint support.",
    imageUrl: "https://m.media-amazon.com/images/I/61zNAqRyQ5L._AC_SY300_SX300_QL70_FMwebp_.jpg",
    affiliateUrl: "https://www.amazon.com/dp/B07DX89ZHN?tag=trueusuppleme-20",
  },
  {
    id: "nordic-naturals-algae-omega",
    ingredient: "omega3_algae",
    name: "Nordic Naturals Algae Omega",
    blurb: "Algae-derived EPA and DHA — a vegan alternative to fish oil.",
    imageUrl: "https://m.media-amazon.com/images/I/61ap2ekD+ML._AC_SX679_.jpg",
    affiliateUrl: "https://www.amazon.com/dp/B009KTUGSS?tag=trueusuppleme-20",
  },
  {
    id: "nature-made-magnesium-glycinate",
    ingredient: "magnesium",
    name: "Nature Made Magnesium Glycinate",
    blurb: "Highly absorbable magnesium glycinate for recovery and sleep.",
    imageUrl: "https://m.media-amazon.com/images/I/71ngwNEmMVL._AC_SY879_.jpg",
    affiliateUrl: "https://www.amazon.com/dp/B086RQVNDV?tag=trueusuppleme-20",
  },
  {
    id: "nature-made-ashwagandha",
    ingredient: "ashwagandha",
    name: "Nature Made Ashwagandha Capsules",
    blurb: "Clinically studied ashwagandha extract for stress and recovery support.",
    imageUrl: "https://m.media-amazon.com/images/I/71JwUKft2EL._AC_SX466_.jpg",
    affiliateUrl: "https://www.amazon.com/dp/B085V66GKY?tag=trueusuppleme-20",
  },
  {
    id: "nature-made-multivitamin",
    ingredient: "multivitamin",
    name: "Nature Made Multivitamin Tablets with Iron",
    blurb: "A broad-spectrum daily multivitamin with iron.",
    imageUrl: "https://m.media-amazon.com/images/I/712sy9LDh8L._AC_SX679_.jpg",
    affiliateUrl: "https://www.amazon.com/dp/B00YMSLT88?tag=trueusuppleme-20",
  },
  {
    id: "nature-made-vitamin-d3",
    ingredient: "vitamin_d",
    name: "Nature Made Vitamin D3, 1000 IU",
    blurb: "Vitamin D3 softgels for bone, immune, and muscle health.",
    imageUrl: "https://m.media-amazon.com/images/I/71Lm-iy+xoL._AC_SX679_.jpg",
    affiliateUrl: "https://www.amazon.com/dp/B004U3Y8OM?tag=trueusuppleme-20",
  },
  {
    id: "now-foods-psyllium-husk",
    ingredient: "fiber",
    name: "NOW Foods Psyllium Husk Powder",
    blurb: "Psyllium husk powder for digestion and steady blood sugar.",
    imageUrl: "https://m.media-amazon.com/images/I/71e4tg0j+eL._AC_SX466_.jpg",
    affiliateUrl: "https://www.amazon.com/dp/B002RWUNYM?tag=trueusuppleme-20",
  },
  {
    id: "solaray-tart-cherry-extract",
    ingredient: "tart_cherry",
    name: "Solaray Tart Cherry Fruit Extract",
    blurb: "Concentrated tart cherry extract to support recovery and sleep.",
    imageUrl: "https://m.media-amazon.com/images/I/61pdCG6TmzL._AC_SY300_SX300_QL70_FMwebp_.jpg",
    affiliateUrl: "https://www.amazon.com/dp/B00172MWJC?tag=trueusuppleme-20",
  },
  {
    id: "natures-bounty-b-complex",
    ingredient: "b_complex",
    name: "Nature's Bounty Super B Complex",
    blurb: "All eight B vitamins in one tablet for energy metabolism.",
    imageUrl: "https://m.media-amazon.com/images/I/71xlQxg4CAL._AC_SY300_SX300_QL70_FMwebp_.jpg",
    affiliateUrl: "https://www.amazon.com/dp/B0014D2GEK?tag=trueusuppleme-20",
  },
  {
    id: "nature-made-b12",
    ingredient: "b12",
    name: "Nature Made Vitamin B12, 1000 mcg",
    blurb: "Vitamin B12 softgels for energy metabolism.",
    imageUrl: "https://m.media-amazon.com/images/I/71dORcZxKSL._AC_SX679_.jpg",
    affiliateUrl: "https://www.amazon.com/dp/B00DS5BGDY?tag=trueusuppleme-20",
  },
  {
    id: "naturelo-vegan-iron",
    ingredient: "iron",
    name: "NATURELO Vegan Iron Supplement",
    blurb: "Gentle vegan iron with vitamin C, built for plant-based diets.",
    imageUrl: "https://m.media-amazon.com/images/I/71U8TwBL27L._AC_SX679_.jpg",
    affiliateUrl: "https://www.amazon.com/dp/B07ZN3WGJL?tag=trueusuppleme-20",
  },
  {
    id: "nature-made-calcium-d3",
    ingredient: "calcium",
    name: "Nature Made Calcium with Vitamin D3",
    blurb: "Calcium with vitamin D3 for bone density and strength.",
    imageUrl: "https://m.media-amazon.com/images/I/713kuOPGfqL._AC_SX466_.jpg",
    affiliateUrl: "https://www.amazon.com/dp/B004B8JGUW?tag=trueusuppleme-20",
  },
  {
    id: "nature-made-melatonin",
    ingredient: "melatonin",
    name: "Nature Made Melatonin 5mg Extra Strength",
    blurb: "Extra-strength melatonin to help you fall asleep faster.",
    imageUrl: "https://m.media-amazon.com/images/I/71Ar+BL1WVL._AC_SY300_SX300_QL70_FMwebp_.jpg",
    affiliateUrl: "https://www.amazon.com/dp/B005DEK9CC?tag=trueusuppleme-20",
  },
  {
    id: "now-foods-glycine-powder",
    ingredient: "glycine",
    name: "NOW Foods Glycine Pure Powder",
    blurb: "Pure glycine powder to support deeper, more restorative sleep.",
    imageUrl: "https://m.media-amazon.com/images/I/71NGfz0icuL._AC_SX466_.jpg",
    affiliateUrl: "https://www.amazon.com/dp/B0013OVZJW?tag=trueusuppleme-20",
  },
  // Add more below the same way — replace with your own SiteStripe links if
  // you'd rather feature a different brand for any category:
  // {
  //   id: "whey-isolate",
  //   ingredient: "protein",
  //   name: "Whey Protein Isolate",
  //   blurb: "Our go-to pick for lean muscle repair with minimal carbs or fat.",
  //   imageUrl: "https://ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&...",
  //   affiliateUrl: "https://www.amazon.com/dp/XXXXXXXXXX?tag=yourtag-20",
  // },
];

export function getProductsForIngredient(ingredient: Ingredient): ShopProduct[] {
  return SHOP_PRODUCTS.filter((product) => product.ingredient === ingredient);
}
