import type { Metadata } from "next";
import { pageOpenGraph } from "@/lib/site";
import PageHeading from "@/components/PageHeading";
import ProductListing from "@/components/ProductListing";

export async function generateMetadata(props: PageProps<"/sale">): Promise<Metadata> {
  const { search, page } = await props.searchParams;
  const isFiltered = (typeof search === "string" && search.length > 0) || (typeof page === "string" && page !== "1");
  return {
    title: "On sale",
    description: "Coovi sarees at reduced prices. Cash on delivery anywhere in Bangladesh.",
    alternates: { canonical: "/sale" },
    openGraph: pageOpenGraph("/sale", "On sale | Coovi"),
    robots: isFiltered ? { index: false, follow: true } : undefined,
  };
}

export default async function SalePage(props: PageProps<"/sale">) {
  const { search, sort, page } = await props.searchParams;
  const parsedPage = typeof page === "string" ? parseInt(page, 10) : 1;

  return (
    <main className="w-full pb-16">
      <PageHeading
        title="On sale"
        crumb="On sale"
        description="Sarees at reduced prices while the offer lasts. Grab your favourite before it is gone."
      />
      <div className="mx-auto max-w-[1170px] px-4">
        <ProductListing
          onSale
          search={typeof search === "string" ? search : undefined}
          sort={typeof sort === "string" ? sort : undefined}
          page={Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1}
          emptyMessage="No sarees are on sale right now. New offers are added often, so check back soon."
        />
      </div>
    </main>
  );
}
