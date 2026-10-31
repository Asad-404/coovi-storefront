import Image from "next/image";
import Link from "next/link";

// How far each divider leans, sized per breakpoint so the angle stays about the same as the strip gets taller
export const stripSlope = "[--hero-slope:32px] sm:[--hero-slope:48px] lg:[--hero-slope:90px]";

export const panelShape = "polygon(var(--hero-slope) 0, 100% 0, calc(100% - var(--hero-slope)) 100%, 0 100%)";

// Panels overlap by the slope so their sloped edges meet
export const panelOverlap = "calc(var(--hero-slope) * -1)";

const leaves = [
  { x: 74, y: 340, rotate: -150 },
  { x: 75, y: 290, rotate: -30 },
  { x: 77, y: 240, rotate: -150 },
  { x: 82, y: 190, rotate: -30 },
  { x: 88, y: 140, rotate: -150 },
  { x: 97, y: 90, rotate: -30 },
];

function LeafSprig() {
  return (
    <svg
      viewBox="0 0 160 400"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      className="absolute bottom-6 left-[2%] hidden h-3/4 text-brand/20 lg:block"
    >
      <path d="M80 400C70 280 85 140 110 20" />
      {leaves.map((leaf) => (
        <path
          key={leaf.y}
          d="M0 0C18-14 48-14 66 0C48 14 18 14 0 0Z"
          transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.rotate})`}
        />
      ))}
    </svg>
  );
}

export default function HomeHero({ images }: { images: string[] }) {
  const panels = images.slice(0, 3);

  return (
    <section className="px-2.5 pt-2.5">
      <div className="relative overflow-hidden border border-haze-deep bg-haze">
        <div className="absolute inset-0 bg-radial-[at_0%_100%] from-haze-deep to-transparent to-60%" aria-hidden="true" />
        <LeafSprig />

        <div className="relative flex flex-col lg:min-h-[600px] lg:flex-row lg:items-stretch">
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 py-10 text-center sm:px-12 lg:items-start lg:gap-5 lg:py-12 lg:pl-[11%] lg:pr-8 lg:text-left">
            <span className="rounded-sm border border-highlight/50 bg-white/60 px-4 py-1.5 text-sm font-semibold text-brand">
              Festive collection
            </span>
            <h1 className="font-display text-title-sm leading-[1.25] text-brand sm:text-4xl lg:text-title-lg">
              In every festive colour,
              <br className="hidden sm:block" />{" "}
              Coovi is with you.
            </h1>
            <div className="flex w-56 items-center gap-2 text-accent" aria-hidden="true">
              <span className="h-px flex-1 bg-accent/60" />
              <span className="text-xs">✦</span>
              <span className="h-px flex-1 bg-accent/60" />
            </div>
            <p className="max-w-md text-base leading-7 text-brand/80 lg:text-lg lg:leading-8">
              Handpicked cotton, silk and georgette sarees — a little festive spirit in every drape.
            </p>
            <Link
              href="/#shop"
              className="btn btn-primary mt-2 w-full py-4 shadow-md sm:w-auto"
            >
              Explore the collection
            </Link>
          </div>

          {panels.length > 0 && (
            <div className={`flex h-[210px] w-full overflow-hidden px-0 pb-0 sm:h-[320px] lg:mr-[8%] lg:h-auto lg:w-[46%] ${stripSlope}`}>
              {panels.map((src, index) => (
                // The white panel behind the photo shows as a thin line along each sloped edge
                <div
                  key={src}
                  className="relative h-full min-w-0 flex-1 bg-white"
                  style={{ clipPath: panelShape, marginLeft: index > 0 ? panelOverlap : undefined }}
                >
                  <div className="absolute inset-x-[3px] inset-y-0" style={{ clipPath: panelShape }}>
                    <Image
                      src={src}
                      alt=""
                      fill
                      priority={index === 0}
                      sizes="(max-width: 1024px) 45vw, 22vw"
                      className="object-cover"
                    />
                    <span
                      className="hero-sheen absolute inset-y-0 left-0 w-1/2 bg-linear-to-r from-transparent via-white/40 to-transparent"
                      style={{ animationDelay: `${index * 0.5}s` }}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
