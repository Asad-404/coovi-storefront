import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import ProductListing from "@/components/ProductListing";

export const metadata: Metadata = {
  title: "Sarees - Coovi",
  description: "Browse all Coovi sarees. Search, sort and order with cash on delivery.",
};

export default async function ShopPage(props: PageProps<"/shop">) {
  const { search, sort, page } = await props.searchParams;
  const searchTerm = typeof search === "string" ? search : undefined;
  const parsedPage = typeof page === "string" ? parseInt(page, 10) : 1;

  return (
    <main className="w-full pb-16">
      <PageHeading title={searchTerm ? `Results for "${searchTerm}"` : "Sarees"} crumb={searchTerm ? "Search" : "Sarees"} />
      <div className="mx-auto max-w-[1120px] px-4">
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
