const reasons = [
  {
    title: "Handpicked fabrics",
    text: "Every saree is chosen for the feel of its fabric and the finish of its weave, so what arrives matches what you saw.",
    icon: <path d="M4 20c0-8 4-14 16-16-1 12-7 16-16 16Zm0 0c4-5 7-8 10-10" />,
  },
  {
    title: "Honest prices",
    text: "Clear prices in BDT, and the delivery fee is shown before you place your order. No surprises at the door.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <text x="12" y="16.5" textAnchor="middle" fontSize="12" fill="currentColor" stroke="none">
          ৳
        </text>
      </>
    ),
  },
  {
    title: "Cash on delivery",
    text: "Order as a guest with just your name, phone and address, then pay when your saree arrives.",
    icon: (
      <>
        <rect x="3" y="7" width="18" height="11" rx="2" />
        <circle cx="12" cy="12.5" r="2.5" />
      </>
    ),
  },
];

export default function WhyCoovi() {
  return (
    <section className="border-y border-zinc-200">
      <div className="mx-auto max-w-[1120px] px-4 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl text-zinc-700">Why Coovi?</h2>
          <p className="mt-4 leading-7 text-zinc-700">
            Buying a saree online takes trust. Here is how we earn it.
          </p>
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {reasons.map((reason) => (
            <div key={reason.title} className="flex flex-col items-center gap-3 text-center">
              <svg
                viewBox="0 0 24 24"
                className="h-14 w-14 text-ink"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {reason.icon}
              </svg>
              <h3 className="text-lg font-bold text-zinc-700">{reason.title}</h3>
              <p className="text-sm leading-6 text-zinc-700">{reason.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
