import { Suspense } from "react";
import { getFirstProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import LoadMoreButton from "@/components/LoadMoreButton";
import ProductListingError from "@/components/ProductListingError";

interface ProductListingProps {
  search?: string;
  sort?: string;
  page: number;
  onSale?: boolean;
  emptyMessage: string;
}

// Server component: fetches the products and renders the filters, grid and "Load more" button.
// Page N shows products 1..N*12, so "Load more" simply asks for the next page number. getFirstProducts
// splits that into API-sized pages, since the API caps one request at 50 products.
export default async function ProductListing({ search, sort, page, onSale, emptyMessage }: ProductListingProps) {
  let data = null;
  try {
    data = await getFirstProducts({ search, sort, onSale }, 12 * page);
  } catch {
    data = null;
  }

  if (!data) {
    return <ProductListingError />;
  }

  return (
    <>
      <Suspense fallback={null}>
        <ProductFilters total={data.pagination.total} shown={data.data.length} />
      </Suspense>

      {data.data.length === 0 ? (
        <p className="border-l-4 border-brand bg-mist px-6 py-3.5 text-sm text-ink">{emptyMessage}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-[30px] md:grid-cols-3">
            {/* The top row is above the fold, and any of its photos can be the page's largest paint */}
            {data.data.map((product, index) => (
              <ProductCard key={product._id} product={product} eager={index < 3} />
            ))}
          </div>

          {data.pagination.hasMore && (
            <div className="mt-12 flex justify-center">
              <LoadMoreButton currentPage={page} hasMore={data.pagination.hasMore} />
            </div>
          )}

        </>
      )}
    </>
  );
}
