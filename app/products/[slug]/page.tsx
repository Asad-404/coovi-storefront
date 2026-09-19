import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

type Props = PageProps<"/products/[slug]">;

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  try {
    const product = await getProductBySlug(slug);
    return {
      title: `${product.name} - Coovi`,
      description: product.description,
    };
  } catch {
    return { title: "Product not found - Coovi" };
  }
}

export default async function ProductDetailPage(props: Props) {
  const { slug } = await props.params;

  let product;
  try {
    product = await getProductBySlug(slug);
  } catch {
    notFound();
  }

  const [primaryImage, ...otherImages] = product.images;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      <nav className="py-4 text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/" className="hover:text-rose-700 dark:hover:text-rose-400">
          ← Back to shop
        </Link>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
            {primaryImage ? (
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-400">
                No image
              </div>
            )}
          </div>

          {otherImages.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              {otherImages.slice(0, 4).map((image) => (
                <div
                  key={image}
                  className="relative aspect-[3/4] overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800"
                >
                  <Image
                    src={image}
                    alt={product.name}
                    fill
                    sizes="20vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {product.category}
            </p>
            <h1 className="mt-1 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {product.name}
            </h1>
            {product.nameBn && (
              <p className="mt-1 text-lg text-zinc-500 dark:text-zinc-400">
                {product.nameBn}
              </p>
            )}
          </div>

          <p className="text-3xl font-semibold text-rose-700 dark:text-rose-400">
            {formatPrice(product.price)}
          </p>

          {product.inStock ? (
            <p className="text-sm font-medium text-green-700 dark:text-green-400">
              In stock ({product.stock} available)
            </p>
          ) : (
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              Out of stock
            </p>
          )}

          {product.description && (
            <p className="leading-7 text-zinc-700 dark:text-zinc-300">
              {product.description}
            </p>
          )}

          {product.descriptionBn && (
            <p className="leading-7 text-zinc-500 dark:text-zinc-400">
              {product.descriptionBn}
            </p>
          )}

          <dl className="grid grid-cols-2 gap-4 border-t border-zinc-200 pt-4 text-sm dark:border-zinc-800">
            {product.size && (
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Size</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                  {product.size}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Category</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                {product.category}
              </dd>
            </div>
          </dl>

          <button
            type="button"
            disabled={!product.inStock}
            className="mt-4 h-12 rounded-full bg-rose-700 px-8 text-base font-semibold text-white transition-colors hover:bg-rose-800 disabled:cursor-not-allowed disabled:bg-zinc-300 dark:disabled:bg-zinc-700"
          >
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </main>
  );
}
