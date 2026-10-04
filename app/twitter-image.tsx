import { ogSize, renderShareCard } from "@/lib/ogCard";

export const alt = "Coovi - handcrafted sarees, delivered across Bangladesh";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderShareCard();
}
