import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import ProductListing from "@/components/ProductListing";

export const metadata: Metadata = {
  title: "On Sale - Coovi",
  description: "Coovi sarees at reduced prices.",
};

export default async function SalePage(props: PageProps<"/sale">) {
  const { search, sort, page } = await props.searchParams;
  const parsedPage = typeof page === "string" ? parseInt(page, 10) : 1;

  return (
    <main className="w-full pb-16">
      <PageHeading title="On Sale" crumb="On Sale" />
      <div className="mx-auto max-w-[1120px] px-4">
        <ProductListing
          onSale
          search={typeof search === "string" ? search : undefined}
          sort={typeof sort === "string" ? sort : undefined}
          page={Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1}
          emptyMessage="No products were found matching your selection."
        />
      </div>
    </main>
  );
}
