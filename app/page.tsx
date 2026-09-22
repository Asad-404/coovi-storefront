import { Suspense } from "react";
import { getProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import LoadMoreButton from "@/components/LoadMoreButton";

export default async function Home(props: PageProps<"/">) {
  const { search, sort, page } = await props.searchParams;
  const searchTerm = typeof search === "string" ? search : undefined;
  const sortOption = typeof sort === "string" ? sort : undefined;
  const currentPage = typeof page === "string" ? parseInt(page, 10) : 1;

  let productsData = null;
  let loadError = false;

  try {
    productsData = await getProducts({
      search: searchTerm,
      sort: sortOption,
      page: currentPage,
      limit: 12,
    });
  } catch {
    loadError = true;
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <section className="flex flex-col items-center gap-4 py-16 text-center">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
          Beautiful sarees, delivered across Bangladesh
        </h1>
        <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Handpicked cotton, silk, and georgette sarees at honest prices.
        </p>
      </section>

      {loadError ? (
        <div className="mx-auto mb-16 max-w-md rounded-xl border border-amber-300 bg-amber-50 p-6 text-center text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
          <p className="font-medium">Could not load products.</p>
          {process.env.NODE_ENV === "development" && (
            <p className="mt-1 text-sm">
              Is the backend running? Start it with{" "}
              <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs dark:bg-amber-900">
                cd coovi-api && pnpm dev
              </code>
            </p>
          )}
        </div>
      ) : (
        <section className="pb-16">
          <h2 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {searchTerm ? `Results for "${searchTerm}"` : "Shop all sarees"}
          </h2>

          <Suspense fallback={null}>
            <ProductFilters />
          </Suspense>

          {productsData && productsData.data.length === 0 ? (
            <p className="text-zinc-500 dark:text-zinc-400">
              {searchTerm
                ? "No sarees matched your search. Try a different word."
                : "No products yet. Run the seed script in coovi-api."}
            </p>
          ) : productsData ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {productsData.data.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {productsData.pagination.hasMore && (
                <div className="mt-8 flex justify-center">
                  <LoadMoreButton
                    currentPage={currentPage}
                    hasMore={productsData.pagination.hasMore}
                  />
                </div>
              )}

              <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                Showing {productsData.data.length} of {productsData.pagination.total} products
              </p>
            </>
          ) : null}
        </section>
      )}
    </main>
  );
}
