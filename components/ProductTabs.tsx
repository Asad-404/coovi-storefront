"use client";

import { useState } from "react";

interface ProductTabsProps {
  description?: string;
  descriptionBn?: string;
  details: { label: string; value: string }[];
}

const careGuide = [
  {
    title: "Washing",
    points: [
      "Wash separately in cold water with a mild detergent for the first few washes.",
      "Avoid harsh chemicals and bleach so the colours stay bright.",
      "Hand wash gently instead of machine washing.",
    ],
  },
  {
    title: "Drying",
    points: ["Dry in the shade, away from direct sunlight.", "Hang the saree without clips to avoid marks."],
  },
  {
    title: "Ironing",
    points: [
      "Iron on a medium temperature setting.",
      "Place a thin cotton cloth between the iron and the saree.",
    ],
  },
  {
    title: "Storing",
    points: ["Fold neatly and keep in a dry place.", "Air the saree now and then to avoid a musty smell."],
  },
];

const tabs = ["Care Guide", "Description", "Additional information"] as const;

export default function ProductTabs({ description, descriptionBn, details }: ProductTabsProps) {
  const [active, setActive] = useState<(typeof tabs)[number]>("Description");

  return (
    <div>
      <div
        role="tablist"
        className="flex flex-col items-start border-b border-zinc-200 text-sm sm:flex-row sm:justify-center sm:gap-8"
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            role="tab"
            type="button"
            aria-selected={active === tab}
            onClick={() => setActive(tab)}
            className={`-mb-px shrink-0 border-b-2 px-1 py-3 font-medium transition-colors sm:py-4 ${
              active === tab ? "border-gold text-ink" : "border-transparent text-zinc-600 hover:text-ink"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="mx-auto max-w-4xl py-10 text-[15px] leading-7 text-zinc-700">
        {active === "Description" && (
          <div className="space-y-4">
            {description && <p>{description}</p>}
            {descriptionBn && <p>{descriptionBn}</p>}
            {!description && !descriptionBn && <p>No description has been added for this saree yet.</p>}
          </div>
        )}

        {active === "Care Guide" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-ink">Saree care guide</h2>
            {careGuide.map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold text-ink">{section.title}</h3>
                <ul className="mt-1 space-y-1">
                  {section.points.map((point) => (
                    <li key={point}>✓ {point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {active === "Additional information" && (
          <dl className="divide-y divide-zinc-200 border border-zinc-200">
            {details.map((row) => (
              <div key={row.label} className="grid grid-cols-[140px_1fr] px-4 py-3 sm:grid-cols-[200px_1fr]">
                <dt className="font-medium text-ink">{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}
