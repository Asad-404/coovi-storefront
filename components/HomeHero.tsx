import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import PriceTag from "@/components/PriceTag";

// The promise on the left, the newest saree on the right, shown whole rather than cropped
export default function HomeHero({ featured }: { featured?: Product }) {
  const image = featured?.images[0];

  return (
    <section className="mx-auto max-w-page px-4 pb-4 pt-8 lg:pt-12">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col items-start gap-5">
          <h1 className="text-[44px] leading-[1.05] text-brand sm:text-[56px] lg:text-[64px]">
            See it first.
            <br />
            Pay at your door.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-700">
            Cash on delivery anywhere in Bangladesh. Open the parcel, check your saree, then pay the rider.
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/shop"
              className="btn btn-primary"
            >
              Shop sarees
            </Link>
            <Link href="/delivery-policy" className="text-sm font-medium text-ink underline underline-offset-4 hover:text-brand">
              How delivery works
            </Link>
          </div>
        </div>

        {featured && image && (
          <Link href={`/products/${featured.slug}`} className="group flex flex-col gap-3">
            <div className="relative aspect-3/4 overflow-hidden bg-mist">
              <Image
                src={image}
                alt={featured.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <p className="flex flex-col text-ink transition-colors group-hover:text-brand">
                {featured.nameBn && (
                  <span lang="bn" className="font-display text-2xl leading-snug sm:text-3xl">
                    {featured.nameBn}
                  </span>
                )}
                <span className={featured.nameBn ? "text-sm text-zinc-600" : "font-display text-2xl leading-snug"}>
                  {featured.name}
                </span>
              </p>
              <PriceTag product={featured} className="shrink-0 text-base text-ink" />
            </div>
          </Link>
        )}
      </div>
    </section>
  );
}
