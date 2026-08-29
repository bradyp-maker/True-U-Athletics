import { optionLabel } from "@/lib/labels";
import { SHOP_PRODUCTS } from "@/lib/shopProducts";

export default function ShopPage() {
  return (
    <div className="flex flex-1 flex-col bg-background px-6 py-16 sm:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <span className="w-fit rounded-full border border-white/10 bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
          Supplement Shop
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Shop the supplements we recommend
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
          As an Amazon Associate, True U Athletics earns from qualifying purchases made through
          the links below, at no extra cost to you.
        </p>

        {SHOP_PRODUCTS.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-surface p-8 text-center text-sm leading-6 text-muted">
            No products added yet — check back soon.
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {SHOP_PRODUCTS.map((product) => (
              <a
                key={product.id}
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener sponsored"
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface transition-colors hover:border-white/25"
              >
                <div className="flex h-36 items-center justify-center bg-surface-2 p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element -- per-product Amazon SiteStripe image URLs can't be pre-registered as next/image remote patterns */}
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1.5 p-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-2">
                    {optionLabel(product.ingredient)}
                  </span>
                  <h2 className="font-display text-sm font-bold text-foreground">
                    {product.name}
                  </h2>
                  <p className="flex-1 text-xs leading-5 text-muted">{product.blurb}</p>
                  <span className="mt-1 text-xs font-semibold text-accent group-hover:underline">
                    Shop on Amazon →
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}

        <p className="mt-10 text-xs leading-5 text-muted-2">
          Prices and availability are set by Amazon and may have changed since this page was
          last updated — confirm current pricing on the product page before buying.
        </p>
      </div>
    </div>
  );
}
