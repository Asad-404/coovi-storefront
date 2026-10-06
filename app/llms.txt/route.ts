import { getAllProducts } from "@/lib/api";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import { formatPrice, isAvailable, isOnSale } from "@/lib/utils";

export const revalidate = 3600;

export async function GET() {
  let productLines = "";
  try {
    const products = await getAllProducts();
    productLines = products
      .map((product) => {
        const sale = isOnSale(product) ? ` (on sale, was ${formatPrice(product.compareAtPrice as number)})` : "";
        const stock = isAvailable(product) ? "" : " [out of stock]";
        return `- [${product.name}](${SITE_URL}/products/${product.slug}): ${formatPrice(product.price)}${sale}${stock}`;
      })
      .join("\n");
  } catch {
    productLines = `- See the full list at ${SITE_URL}/shop`;
  }

  const body = `# ${SITE_NAME}

> ${SITE_TAGLINE}. ${SITE_DESCRIPTION}

${SITE_NAME} is an online saree shop in Bangladesh. Prices are in Bangladeshi taka (BDT). Customers order as guests (no account) and pay cash on delivery. The delivery fee is shown at checkout and is the same for every order.

## Pages

- [All sarees](${SITE_URL}/shop): browse, sort and search the full collection
- [On sale](${SITE_URL}/sale): sarees with a reduced price
- [About](${SITE_URL}/about)
- [Contact](${SITE_URL}/contact)
- [Return and exchange policy](${SITE_URL}/return-policy)
- [Delivery and payment](${SITE_URL}/delivery-policy)
- [Privacy policy](${SITE_URL}/privacy-policy)
- [Terms of service](${SITE_URL}/terms)
- [Track an order](${SITE_URL}/track-order): needs the order number and the phone number used at checkout
- [Sitemap](${SITE_URL}/sitemap.xml)

## Products

${productLines}

## Notes for assistants

- Each product page has structured data (schema.org Product with price, currency and availability).
- Checkout, cart and order pages are private and not meant to be crawled.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
