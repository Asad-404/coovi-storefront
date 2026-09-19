export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400 sm:px-6">
        <p className="font-semibold tracking-widest text-rose-700 dark:text-rose-400">COOVI</p>
        <p>Beautiful sarees, delivered across Bangladesh.</p>
        <p>© {new Date().getFullYear()} Coovi. A learning project.</p>
      </div>
    </footer>
  );
}
