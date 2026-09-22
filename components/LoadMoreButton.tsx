"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface LoadMoreButtonProps {
  currentPage: number;
  hasMore: boolean;
}

export default function LoadMoreButton({ currentPage, hasMore }: LoadMoreButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  if (!hasMore) return null;

  const handleLoadMore = () => {
    setLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", (currentPage + 1).toString());
    router.push(`/?${params.toString()}`);
  };

  return (
    <button
      onClick={handleLoadMore}
      disabled={loading}
      className="rounded-full bg-rose-700 px-8 py-3 font-semibold text-white transition-colors hover:bg-rose-800 disabled:cursor-not-allowed disabled:bg-zinc-300 dark:disabled:bg-zinc-700"
    >
      {loading ? "Loading..." : "Load More"}
    </button>
  );
}
