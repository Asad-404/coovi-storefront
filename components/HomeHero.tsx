import Image from "next/image";
import Link from "next/link";

const slant = "polygon(7% 0, 100% 0, 93% 100%, 0 100%)";

export default function HomeHero({ images }: { images: string[] }) {
  return (
    <section className="px-2.5 pt-2.5">
      <div className="relative overflow-hidden border border-frost bg-gradient-to-r from-frost via-[#e7f0fa] to-[#dde9f6]">
        <svg
          aria-hidden="true"
          viewBox="0 0 200 300"
          className="pointer-events-none absolute -left-4 bottom-0 hidden h-[85%] text-highlight/30 lg:block"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M20 300 C 40 200, 60 120, 130 20" />
          <path d="M45 220 C 20 190, 25 150, 60 140 C 75 175, 70 200, 45 220Z" />
          <path d="M65 170 C 40 140, 50 100, 85 95 C 95 130, 90 150, 65 170Z" />
          <path d="M90 120 C 70 90, 80 55, 115 55 C 122 85, 115 105, 90 120Z" />
        </svg>

        <div className="relative flex flex-col lg:min-h-[600px] lg:flex-row lg:items-stretch">
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 py-10 text-center sm:px-12 lg:items-start lg:gap-5 lg:py-12 lg:pl-[11%] lg:pr-8 lg:text-left">
            <span className="rounded-full border border-highlight/50 bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Festive collection
            </span>
            <h1 className="font-display text-[28px] font-extrabold leading-[1.25] text-brand sm:text-4xl lg:text-[44px]">
              In every festive colour,
              <br className="hidden sm:block" />{" "}
              Coovi is with you.
            </h1>
            <div className="flex w-56 items-center gap-2 text-highlight" aria-hidden="true">
              <span className="h-px flex-1 bg-highlight/60" />
              <span className="text-xs">✦</span>
              <span className="h-px flex-1 bg-highlight/60" />
            </div>
            <p className="max-w-md text-base leading-7 text-brand/70 lg:text-lg lg:leading-8">
              Handpicked cotton, silk and georgette sarees — a little festive spirit in every drape.
            </p>
            <Link
              href="/#shop"
              className="mt-2 w-full bg-brand px-8 py-4 text-center text-sm font-semibold text-white shadow-lg shadow-brand/30 transition-colors hover:bg-brand-dark sm:w-auto"
            >
              Explore the collection &nbsp;→
            </Link>
          </div>

          {images.length > 0 && (
            <div className="flex h-[210px] w-full overflow-hidden px-0 pb-0 sm:h-[320px] lg:mr-[8%] lg:h-auto lg:w-[46%]">
              {images.slice(0, 3).map((src, index) => (
                <div
                  key={src}
                  className="relative h-full flex-1"
                  style={{ clipPath: slant }}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    priority={index === 0}
                    sizes="(max-width: 1024px) 33vw, 16vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
