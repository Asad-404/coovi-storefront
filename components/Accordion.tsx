export default function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group border-b border-zinc-200">
      <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-sm font-semibold text-ink">
        {title}
        <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <div className="pb-4 text-sm leading-6 text-zinc-600">{children}</div>
    </details>
  );
}
