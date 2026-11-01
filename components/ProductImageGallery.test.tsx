// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import ProductImageGallery from "./ProductImageGallery";

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    sizes,
    loading,
    fetchPriority,
  }: {
    src: string;
    alt: string;
    sizes?: string;
    loading?: "eager" | "lazy";
    fetchPriority?: "high" | "low" | "auto";
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} data-sizes={sizes} loading={loading} fetchPriority={fetchPriority} />
  ),
}));

afterEach(cleanup);

// jsdom has no PointerEvent, so fireEvent drops pointerType and clientX/Y; set them by hand
function pointer(type: "pointerEnter" | "pointerMove", target: Element, pointerType: string, clientX = 0, clientY = 0) {
  const event = new MouseEvent(type === "pointerEnter" ? "pointerover" : "pointermove", {
    bubbles: true,
    clientX,
    clientY,
  });
  Object.defineProperty(event, "pointerType", { value: pointerType });
  fireEvent(target, event);
}

function setup(images = ["/one.jpg", "/two.jpg"]) {
  render(<ProductImageGallery images={images} productName="Renu" />);
  const image = screen.getByAltText("Renu");
  const layer = image.parentElement as HTMLElement;
  const box = layer.parentElement as HTMLElement;
  box.getBoundingClientRect = () => ({ left: 100, top: 50, width: 200, height: 400 }) as DOMRect;
  return { box, layer };
}

const sharpCopies = (container: HTMLElement) => container.querySelectorAll('img[data-sizes="1400px"]');

describe("ProductImageGallery main photo loading", () => {
  function expectHighPriority(src: string) {
    const main = screen.getByAltText("Renu");
    expect(main.getAttribute("src")).toBe(src);
    expect(main.getAttribute("loading")).toBe("eager");
    expect(main.getAttribute("fetchpriority")).toBe("high");
  }

  it("requests the main photo eagerly at high priority, also after picking a thumbnail", () => {
    setup();
    expectHighPriority("/one.jpg");

    fireEvent.click(screen.getByRole("button", { name: "Show image 2" }));
    expectHighPriority("/two.jpg");
  });

  it("keeps high priority off the thumbnails and the zoom copy", () => {
    const { box } = setup();
    pointer("pointerEnter", box, "mouse", 150, 150);

    const others = Array.from(document.querySelectorAll("img")).filter((img) => img.alt !== "Renu");
    expect(others).toHaveLength(3);
    others.forEach((img) => expect(img.getAttribute("fetchpriority")).toBeNull());
  });
});

describe("ProductImageGallery hover zoom", () => {
  it("zooms towards the mouse as it moves", () => {
    const { box, layer } = setup();

    pointer("pointerMove", box, "mouse", 150, 150);
    expect(layer.style.transformOrigin).toBe("25% 25%");

    pointer("pointerMove", box, "mouse", 250, 350);
    expect(layer.style.transformOrigin).toBe("75% 75%");
  });

  it("loads the sharper copy only once a mouse hovers the image", () => {
    const { box } = setup();
    expect(sharpCopies(box)).toHaveLength(0);

    pointer("pointerEnter", box, "mouse", 150, 150);
    expect(sharpCopies(box)).toHaveLength(1);
  });

  it("leaves touch alone", () => {
    const { box, layer } = setup();

    pointer("pointerEnter", box, "touch", 150, 150);
    pointer("pointerMove", box, "touch", 150, 150);

    expect(layer.style.transformOrigin).toBe("");
    expect(sharpCopies(box)).toHaveLength(0);
  });

  it("drops the sharper copy when another image is selected", () => {
    const { box } = setup();
    pointer("pointerEnter", box, "mouse", 150, 150);

    fireEvent.click(screen.getByRole("button", { name: "Show image 2" }));

    expect(sharpCopies(box)).toHaveLength(0);
    expect((screen.getByAltText("Renu") as HTMLImageElement).getAttribute("src")).toBe("/two.jpg");
  });
});
