import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL, pageOpenGraph } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { getProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import NewArrivalCard from "@/components/NewArrivalCard";
import HomeHero from "@/components/HomeHero";
import PromoBanner from "@/components/PromoBanner";
import WhyCoovi from "@/components/WhyCoovi";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: pageOpenGraph("/", `${SITE_NAME} | ${SITE_TAGLINE}`, { description: SITE_DESCRIPTION }),
};

const siteStructuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/apple-icon`,
    description: SITE_DESCRIPTION,
    areaServed: "BD",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/shop?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  },
];

export default async function Home(props: PageProps<"/">) {
  const { search } = await props.searchParams;
  // Old search links pointed at "/?search=..."; the search results live on /shop now
  if (typeof search === "string" && search) {
    redirect(`/shop?search=${encodeURIComponent(search)}`);
  }

  let products = null;
  try {
    products = await getProducts({ limit: 12 });
  } catch {
    products = null;
  }

  const newArrivals = products ? products.data.slice(0, 10) : [];
  const heroImages = products ? products.data.flatMap((product) => product.images.slice(0, 1)).slice(0, 3) : [];

  return (
    <main className="w-full">
      <JsonLd data={siteStructuredData} />
      <HomeHero images={heroImages} />
      <PromoBanner />

      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-[1120px] px-4">
          <div className="rounded-2xl border border-frost bg-mist px-4 py-10 sm:px-6">
            <SectionTitle title="New Arrivals" subtitle="Fresh designs, limited pieces per design." />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {newArrivals.map((product) => (
                <NewArrivalCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="shop" className="mx-auto max-w-[1120px] scroll-mt-24 px-4 py-14">
        <SectionTitle title="All Products" />

        {products === null ? (
          <div className="mx-auto max-w-md border border-amber-300 bg-amber-50 p-6 text-center text-amber-800">
            <p className="font-medium">Could not load products.</p>
            {process.env.NODE_ENV === "development" && (
              <p className="mt-1 text-sm">
                Is the backend running? Start it with{" "}
                <code className="bg-amber-100 px-1.5 py-0.5 font-mono text-xs">cd coovi-api && pnpm dev</code>
              </p>
            )}
          </div>
        ) : products.data.length === 0 ? (
          <p className="py-10 text-center text-zinc-500">
            {process.env.NODE_ENV === "development"
              ? "No products yet. Add some from the admin panel."
              : "New sarees are being added. Please check back soon."}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-[30px] md:grid-cols-3">
              {products.data.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            <div className="mt-12 flex flex-col items-center gap-2">
              <Link
                href="/shop"
                className="btn btn-primary"
              >
                Shop all sarees
              </Link>
              <p className="text-sm text-zinc-500">{products.pagination.total} sarees in the collection</p>
            </div>
          </>
        )}
      </section>

      <WhyCoovi />
    </main>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8 flex flex-col items-center gap-1 text-center">
      <h2 className="text-3xl text-zinc-700">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-zinc-600">{subtitle}</p>}
    </div>
  );
}
