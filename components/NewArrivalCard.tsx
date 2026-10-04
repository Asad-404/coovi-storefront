import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import PriceTag from "@/components/PriceTag";

export default function NewArrivalCard({ product }: { product: Product }) {
  const image = product.images[0];
  const title = product.nameBn ? `${product.nameBn} - ${product.name}` : product.name;

  return (
    <article className="flex flex-col rounded-xl border border-sand bg-white p-2.5">
      <Link href={`/products/${product.slug}`} className="relative block aspect-3/4 overflow-hidden rounded-lg bg-cream">
        {image && (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
            className="object-cover"
          />
        )}
        <span className="absolute left-2 top-2 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
          New
        </span>
      </Link>

      <p className="mt-3 text-[11px] uppercase tracking-widest text-zinc-500">{product.category}</p>
      <h3 className="mt-1 truncate text-sm text-zinc-700">{title}</h3>
      <PriceTag product={product} className="mt-2 justify-start text-base font-bold text-zinc-700" />

      <Link
        href={`/products/${product.slug}`}
        className="mt-3 rounded-full border border-accent py-2 text-center text-xs font-bold text-accent transition-colors hover:bg-accent hover:text-white"
      >
        View Details
      </Link>
    </article>
  );
}
