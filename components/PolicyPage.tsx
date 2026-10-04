import Link from "next/link";
import PageHeading from "@/components/PageHeading";

export interface PolicySection {
  heading: string;
  body: React.ReactNode;
}

export const POLICY_UPDATED = "4 October 2026";

export default function PolicyPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: PolicySection[];
}) {
  return (
    <main className="w-full pb-16">
      <PageHeading title={title} crumb={title} />
      <div className="mx-auto max-w-3xl px-4">
        <p className="text-lg leading-8 text-zinc-700">{intro}</p>
        <p className="mt-2 text-sm text-zinc-500">Last updated: {POLICY_UPDATED}</p>

        <div className="mt-8 space-y-8">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-semibold text-ink">{section.heading}</h2>
              <div className="mt-2 space-y-3 leading-7 text-zinc-700">{section.body}</div>
            </section>
          ))}
        </div>

        <p className="mt-12 border-t border-zinc-200 pt-6 text-sm text-zinc-600">
          Questions about this page? Visit our{" "}
          <Link href="/contact" className="underline hover:text-brand">
            Contact page
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
