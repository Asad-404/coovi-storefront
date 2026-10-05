import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL, pageOpenGraph } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { getProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import HomeHero from "@/components/HomeHero";
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
    products = await getProducts({ limit: 13 });
  } catch {
    products = null;
  }

  // The newest saree with a photo fills the hero; the grid shows the rest so nothing appears twice
  const featured = products?.data.find((product) => product.images.length > 0);
  const gridProducts = products ? products.data.filter((product) => product !== featured).slice(0, 12) : [];

  return (
    <main className="w-full">
      <JsonLd data={siteStructuredData} />
      <HomeHero featured={featured} />

      <section id="shop" className="mx-auto max-w-[1120px] scroll-mt-24 px-4 py-14">
        <SectionTitle title="New arrivals" subtitle="Fresh designs, limited pieces per design." />

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
        ) : gridProducts.length === 0 && !featured ? (
          <p className="py-10 text-center text-zinc-500">No products yet. Add some from the admin panel.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-[30px] md:grid-cols-3">
              {gridProducts.map((product) => (
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
