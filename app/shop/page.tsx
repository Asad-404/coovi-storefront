import type { Metadata } from "next";
import { pageOpenGraph } from "@/lib/site";
import PageHeading from "@/components/PageHeading";
import ProductListing from "@/components/ProductListing";

export async function generateMetadata(props: PageProps<"/shop">): Promise<Metadata> {
  const { search, page } = await props.searchParams;
  const isSearch = typeof search === "string" && search.length > 0;
  const isLaterPage = typeof page === "string" && page !== "1";
  return {
    title: isSearch ? `Search: ${search}` : "Sarees",
    description: "Browse all Coovi sarees. Search, sort and order with cash on delivery anywhere in Bangladesh.",
    alternates: { canonical: "/shop" },
    openGraph: pageOpenGraph("/shop", "Sarees | Coovi"),
    // Search results and deeper pages are thin duplicates of /shop, so keep them out of the index
    robots: isSearch || isLaterPage ? { index: false, follow: true } : undefined,
  };
}

export default async function ShopPage(props: PageProps<"/shop">) {
  const { search, sort, page } = await props.searchParams;
  const searchTerm = typeof search === "string" ? search : undefined;
  const parsedPage = typeof page === "string" ? parseInt(page, 10) : 1;

  return (
    <main className="w-full pb-16">
      <PageHeading title={searchTerm ? `Results for "${searchTerm}"` : "Sarees"} crumb={searchTerm ? "Search" : "Sarees"}
        description={searchTerm ? undefined : "Cotton, silk and georgette sarees. Order as a guest and pay in cash when yours arrives."}
      />
      <div className="mx-auto max-w-[1170px] px-4">
        <ProductListing
          search={searchTerm}
          sort={typeof sort === "string" ? sort : undefined}
          page={Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1}
          emptyMessage={
            searchTerm ? "No sarees matched your search. Try a different word." : "No products were found matching your selection."
          }
        />
      </div>
    </main>
  );
}
