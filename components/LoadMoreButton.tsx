"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface LoadMoreButtonProps {
  currentPage: number;
  hasMore: boolean;
}

export default function LoadMoreButton({ currentPage, hasMore }: LoadMoreButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  if (!hasMore) return null;

  const handleLoadMore = () => {
    setLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", (currentPage + 1).toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <button
      onClick={handleLoadMore}
      disabled={loading}
      className="btn btn-primary"
    >
      {loading ? "Loading..." : "Load more"}
    </button>
  );
}
