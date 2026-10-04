import Link from "next/link";

// Wordmark from the Coovi brand kit: navy "Coovi" with the i's dot replaced by a cyan dot
export default function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const text = size === "lg" ? "text-5xl" : "text-[30px] sm:text-4xl";

  return (
    <Link href="/" aria-label="Coovi home" className={`${text} inline-block font-display font-black leading-none tracking-tight text-brand`}>
      Coov
      <span className="relative inline-block">
        ı
        <span
          aria-hidden="true"
          className="absolute left-[0.04em] top-[-0.04em] h-[0.2em] w-[0.2em] rounded-full bg-logo-dot"
        />
      </span>
    </Link>
  );
}
