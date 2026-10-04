import { Suspense } from "react";
import { getProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import LoadMoreButton from "@/components/LoadMoreButton";

interface ProductListingProps {
  search?: string;
  sort?: string;
  page: number;
  onSale?: boolean;
  emptyMessage: string;
}

// Server component: fetches one page of products (12 per page) and renders the filters, grid and Load More button.
// Page N shows products 1..N*12, so "Load More" simply asks for the next page number.
export default async function ProductListing({ search, sort, page, onSale, emptyMessage }: ProductListingProps) {
  let data = null;
  try {
    data = await getProducts({ search, sort, limit: 12 * page, page: 1, onSale });
  } catch {
    data = null;
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-md border border-amber-300 bg-amber-50 p-6 text-center text-amber-800">
        <p className="font-medium">Could not load products.</p>
        {process.env.NODE_ENV === "development" && (
          <p className="mt-1 text-sm">
            Is the backend running? Start it with{" "}
            <code className="bg-amber-100 px-1.5 py-0.5 font-mono text-xs">cd coovi-api && pnpm dev</code>
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      <Suspense fallback={null}>
        <ProductFilters />
      </Suspense>

      {data.data.length === 0 ? (
        <p className="border-l-4 border-sky-500 bg-sky-500 px-6 py-3.5 text-sm text-white">{emptyMessage}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-[30px] md:grid-cols-3">
            {data.data.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {data.pagination.hasMore && (
            <div className="mt-12 flex justify-center">
              <LoadMoreButton currentPage={page} hasMore={data.pagination.hasMore} />
            </div>
          )}

          <p className="mt-6 text-center text-sm text-zinc-500">
            Showing {data.data.length} of {data.pagination.total} products
          </p>
        </>
      )}
    </>
  );
}
