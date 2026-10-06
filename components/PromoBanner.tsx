export default function PromoBanner() {
  return (
    <section className="mx-auto max-w-[1120px] px-4 py-10">
      <div className="grid items-center gap-6 md:grid-cols-[510px_1fr]">
        <div className="flex h-[210px] flex-col justify-center gap-2 rounded-sm bg-brand px-8 text-white">
          <p className="text-sm font-semibold text-logo-dot">Pay at your door</p>
          <p className="font-display text-4xl leading-tight">
            Cash on
            <br />
            delivery
          </p>
          <p className="text-sm text-white/80">Anywhere in Bangladesh</p>
        </div>

        <div className="flex flex-col items-start gap-3">
          <span className="rounded-sm bg-accent px-3 py-1.5 text-xs font-bold text-white">
            Delivery offer
          </span>
          <h2 className="font-display text-3xl text-accent">Order now, pay when it arrives!</h2>
          <p className="text-base font-medium text-ink">
            See your saree first and pay the rider on delivery. No online payment, no risk.
          </p>
        </div>
      </div>
    </section>
  );
}
