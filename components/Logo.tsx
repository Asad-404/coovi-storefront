import Link from "next/link";

export default function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const circle = size === "lg" ? "h-16 w-16" : "h-11 w-11 sm:h-14 sm:w-14";
  const text = size === "lg" ? "text-4xl" : "text-2xl sm:text-3xl";

  return (
    <Link href="/" className="inline-flex items-center gap-3" aria-label="Coovi home">
      <span className={`${circle} flex items-center justify-center rounded-full bg-brand`}>
        <span className="flex h-[62%] w-[62%] items-center justify-center border-2 border-white/90 font-display text-lg font-bold leading-none text-white">
          C
        </span>
      </span>
      <span className={`${text} font-display font-bold tracking-wide text-brand`}>Coovi</span>
    </Link>
  );
}
