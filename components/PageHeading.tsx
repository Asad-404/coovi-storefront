import Link from "next/link";

export default function PageHeading({
  title,
  crumb,
  description,
}: {
  title: string;
  crumb: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-[1170px] px-4 pb-6 pt-6">
      <nav className="text-sm text-zinc-600" aria-label="Breadcrumb">
        <Link href="/" className="text-ink hover:text-brand">Home</Link>
        <span className="mx-2 text-zinc-300">/</span>
        <span>{crumb}</span>
      </nav>
      <h1 className="mt-4 text-4xl text-ink sm:text-5xl">{title}</h1>
      {description && (
        <p className="mt-8 bg-[#e7eef7] px-5 py-6 text-base leading-7 text-ink sm:px-8 sm:text-lg">{description}</p>
      )}
    </div>
  );
}
