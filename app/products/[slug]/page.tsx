import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import AddToCartButton from "@/components/AddToCartButton";
import ProductImageGallery from "@/components/ProductImageGallery";

type Props = PageProps<"/products/[slug]">;

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  try {
    const product = await getProductBySlug(slug);
    return {
      title: `${product.name} - Coovi`,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description ?? undefined,
        images: product.images.length > 0 ? [product.images[0]] : undefined,
        type: "website",
      },
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
  } catch (error) {
    // Only call notFound() for actual 404s; let other errors bubble to error.tsx
    if (error instanceof Error && error.message.includes("status 404")) {
      notFound();
    }
    throw error;
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
        <ProductImageGallery images={product.images} productName={product.name} />

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

          <AddToCartButton
            product={{
              _id: product._id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: product.images[0] ?? "",
            }}
            inStock={product.inStock}
          />

          <a
            href={`https://wa.me/8801700000000?text=${encodeURIComponent(
              `Hi! I'm interested in ${product.name} - ${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/products/${product.slug}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center gap-2 rounded-full border-2 border-green-600 font-semibold text-green-600 transition-colors hover:bg-green-600 hover:text-white dark:border-green-500 dark:text-green-500 dark:hover:bg-green-500"
          >
            <span>💬</span>
            <span>Ask on WhatsApp</span>
          </a>
        </div>
      </div>
    </main>
  );
}
