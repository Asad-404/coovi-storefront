import Link from "next/link";

export default function PageHeading({ title, crumb }: { title: string; crumb: string }) {
  return (
    <div className="mx-auto max-w-[1120px] px-4 pb-6 pt-6">
      <nav className="text-sm text-zinc-600" aria-label="Breadcrumb">
        <Link href="/" className="text-ink hover:text-brand">Home</Link>
        <span className="mx-2 text-zinc-300">/</span>
        <span>{crumb}</span>
      </nav>
      <h1 className="mt-4 text-4xl font-bold text-ink sm:text-5xl">{title}</h1>
    </div>
  );
}
