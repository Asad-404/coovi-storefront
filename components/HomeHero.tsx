import Image from "next/image";
import Link from "next/link";

const slant = "polygon(7% 0, 100% 0, 93% 100%, 0 100%)";

export default function HomeHero({ images }: { images: string[] }) {
  return (
    <section className="px-2.5 pt-2.5">
      <div className="relative overflow-hidden border border-frost bg-mist">
        <div className="relative flex flex-col lg:min-h-[600px] lg:flex-row lg:items-stretch">
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 py-10 text-center sm:px-12 lg:items-start lg:gap-5 lg:py-12 lg:pl-[11%] lg:pr-8 lg:text-left">
            <span className="rounded-sm border border-highlight/50 bg-white/60 px-4 py-1.5 text-sm font-semibold text-accent">
              Festive collection
            </span>
            <h1 className="font-display text-title-sm leading-[1.25] text-brand sm:text-4xl lg:text-title-lg">
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
              className="btn btn-primary mt-2 w-full py-4 sm:w-auto"
            >
              Explore the collection
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
