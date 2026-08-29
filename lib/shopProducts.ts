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
  // Example — replace with your real SiteStripe links, then add more:
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
