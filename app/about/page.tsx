import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Coovi",
  description: "Learn about Coovi, your trusted source for premium sarees in Bangladesh.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
        About Coovi
      </h1>

      <div className="mt-8 space-y-6 text-zinc-700 dark:text-zinc-300">
        <p className="text-lg leading-relaxed">
          Welcome to Coovi, your trusted destination for beautiful, high-quality sarees
          delivered across Bangladesh.
        </p>

        <p className="leading-relaxed">
          We carefully handpick each saree in our collection, focusing on quality fabrics,
          authentic designs, and honest pricing. Whether you're looking for elegant cotton
          sarees for everyday wear, luxurious silk for special occasions, or lightweight
          georgette for comfort, we have something for every moment.
        </p>

        <h2 className="pt-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Our Promise
        </h2>

        <ul className="list-disc space-y-2 pl-6">
          <li>Authentic, high-quality fabrics</li>
          <li>Honest, transparent pricing</li>
          <li>Delivery across Bangladesh</li>
          <li>Cash on Delivery for your convenience</li>
          <li>Responsive customer support</li>
        </ul>

        <h2 className="pt-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Why Choose Us?
        </h2>

        <p className="leading-relaxed">
          At Coovi, we understand that buying sarees online requires trust. That's why
          we provide detailed product descriptions, multiple product images, and a
          straightforward ordering process. Our Cash on Delivery option means you only
          pay when you receive your order.
        </p>

        <p className="leading-relaxed">
          We're a learning-first project built with care, aiming to provide a seamless
          online shopping experience for saree lovers across Bangladesh.
        </p>
      </div>
    </main>
  );
}
