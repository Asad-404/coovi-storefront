import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, pageOpenGraph } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { getDeliveryFee, getProductBySlug, getProducts } from "@/lib/api";
import { discountPercent, formatPrice, isAvailable, isOnSale } from "@/lib/utils";
import type { Product } from "@/lib/types";
import AddToCartButton from "@/components/AddToCartButton";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductTabs from "@/components/ProductTabs";
import ProductCard from "@/components/ProductCard";
import PriceTag from "@/components/PriceTag";

type Props = PageProps<"/products/[slug]">;

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  try {
    const product = await getProductBySlug(slug);
    const description = (product.description ?? `Buy ${product.name} at ${SITE_NAME}. Cash on delivery anywhere in Bangladesh.`).slice(0, 200);
    const path = `/products/${product.slug}`;
    const images = product.images.slice(0, 4);
    return {
      title: product.name,
      description,
      alternates: { canonical: path },
      openGraph: pageOpenGraph(path, `${product.name} | ${SITE_NAME}`, { description, images }),
      twitter: { card: "summary_large_image", title: `${product.name} | ${SITE_NAME}`, description, images },
      other: {
        "product:price:amount": String(product.price),
        "product:price:currency": "BDT",
        "product:availability": isAvailable(product) ? "in stock" : "out of stock",
      },
    };
  } catch {
    return { title: "Product not found" };
  }
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group border-b border-zinc-200">
      <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-xs font-semibold uppercase tracking-wide text-ink">
        {title}
        <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <div className="pb-4 text-sm leading-6 text-zinc-600">{children}</div>
    </details>
  );
}

export default async function ProductDetailPage(props: Props) {
  const { slug } = await props.params;

  let product: Product;
  try {
    product = await getProductBySlug(slug);
  } catch (error) {
    // Only call notFound() for actual 404s; let other errors bubble to error.tsx
    if (error instanceof Error && error.message.includes("status 404")) {
      notFound();
    }
    throw error;
  }

  const [deliveryFee, relatedResponse] = await Promise.all([
    getDeliveryFee().catch(() => null),
    getProducts({ limit: 4 }).catch(() => null),
  ]);
  const related = (relatedResponse?.data ?? []).filter((item) => item._id !== product._id).slice(0, 3);
  const title = product.nameBn ? `${product.nameBn} – ${product.name}` : product.name;
  const available = isAvailable(product);

  const details = [
    { label: "Category", value: product.category },
    ...(product.size ? [{ label: "Size", value: product.size }] : []),
    { label: "Availability", value: available ? `In stock (${product.stock} available)` : "Out of stock" },
  ];

  const productUrl = `${SITE_URL}/products/${product.slug}`;
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description ?? undefined,
      image: product.images,
      sku: product.slug,
      category: product.category,
      brand: { "@type": "Brand", name: SITE_NAME },
      offers: {
        "@type": "Offer",
        url: productUrl,
        priceCurrency: "BDT",
        price: product.price,
        itemCondition: "https://schema.org/NewCondition",
        availability: available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Saree", item: `${SITE_URL}/shop` },
        { "@type": "ListItem", position: 3, name: product.name, item: productUrl },
      ],
    },
  ];

  return (
    <main className="w-full">
      <JsonLd data={structuredData} />
      <section className="bg-zinc-50">
        <div className="mx-auto max-w-[1170px] px-4 pb-14">
          <nav className="py-4 text-xs text-zinc-600" aria-label="Breadcrumb">
            <Link href="/" className="text-ink hover:text-brand">Home</Link>
            <span className="mx-2 text-zinc-300">/</span>
            <Link href="/shop" className="text-ink hover:text-brand">Saree</Link>
            <span className="mx-2 text-zinc-300">/</span>
            <span>{title}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1.65fr_1fr] lg:gap-12">
            <ProductImageGallery images={product.images} productName={product.name} />

            <div className="flex flex-col gap-4">
              <h1 className="flex flex-col gap-1 text-ink">
                {product.nameBn && (
                  <span lang="bn" className="text-[40px] leading-tight sm:text-[52px]">
                    {product.nameBn}
                  </span>
                )}
                <span className={product.nameBn ? "font-sans text-lg text-zinc-600" : "text-[32px] leading-tight sm:text-[40px]"}>
                  {product.name}
                </span>
              </h1>

              <div className="flex flex-wrap items-center gap-3">
                <PriceTag product={product} className="text-xl font-medium text-ink" />
                {isOnSale(product) && (
                  <span className="bg-accent px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Save {discountPercent(product)}%
                  </span>
                )}
              </div>

              <dl className="grid grid-cols-[80px_1fr] gap-x-4 gap-y-3 py-2 text-sm">
                <dt className="font-semibold text-ink">Category:</dt>
                <dd className="text-zinc-600">{product.category}</dd>
                {product.size && (
                  <>
                    <dt className="font-semibold text-ink">Size:</dt>
                    <dd className="text-zinc-600">{product.size}</dd>
                  </>
                )}
                <dt className="font-semibold text-ink">Stock:</dt>
                <dd className={available ? "text-green-700" : "text-red-600"}>
                  {available ? `In stock (${product.stock} available)` : "Out of stock"}
                </dd>
              </dl>

              {product.description && <p className="text-sm leading-6 text-zinc-600">{product.description}</p>}

              <div className="mt-2">
                <AddToCartButton
                  product={{
                    _id: product._id,
                    slug: product.slug,
                    name: product.name,
                    price: product.price,
                    image: product.images[0] ?? "",
                  }}
                  inStock={available}
                  maxQuantity={product.stock}
                />
              </div>

              <a
                href={`https://wa.me/8801700000000?text=${encodeURIComponent(
                  `Hi! I'm interested in ${product.name} - ${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/products/${product.slug}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn h-12 border border-green-600 text-green-700 hover:bg-green-600 hover:text-white"
              >
                Ask on WhatsApp
              </a>

              <div className="rounded-sm border border-frost bg-white p-4">
                <p className="text-sm font-semibold text-ink">Pay on delivery, risk nothing</p>
                <p className="mt-1 text-sm text-zinc-600">
                  Order with just your name, phone and address. You pay the rider in cash when your saree arrives.
                </p>
              </div>

              <div className="mt-2 border-t border-zinc-200">
                <Accordion title="Delivery charge">
                  {deliveryFee !== null
                    ? `Delivery across Bangladesh costs ${formatPrice(deliveryFee)} per order. It is added at checkout.`
                    : "The delivery charge is shown at checkout."}
                </Accordion>
                <Accordion title="Payment">
                  Cash on delivery only. No online payment is needed to place an order.
                </Accordion>
                <Accordion title="Check before you pay">
                  Please open the parcel and check the saree in front of the delivery person before you pay. For any
                  problem, message us on WhatsApp or read our{" "}
                  <Link href="/return-policy" className="underline hover:text-brand">
                    return and exchange policy
                  </Link>
                  .
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1170px] px-4">
        <ProductTabs description={product.description} descriptionBn={product.descriptionBn} details={details} />

        {related.length > 0 && (
          <div className="pb-16 pt-6">
            <h2 className="mb-6 text-xl text-zinc-700">Related products</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-[30px] md:grid-cols-3">
              {related.map((item, index) => (
                <div key={item._id} className={index === 2 ? "hidden md:block" : undefined}>
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
