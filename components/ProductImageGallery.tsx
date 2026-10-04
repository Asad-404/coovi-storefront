"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const primaryImage = images[selectedIndex] ?? images[0];

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="relative aspect-3/4 overflow-hidden bg-cream">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={productName}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 700px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-400">No image</div>
          )}

          {primaryImage && (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              aria-label="Zoom image"
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink shadow transition-colors hover:text-brand"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
              </svg>
            </button>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`Show image ${index + 1}`}
                className={`relative aspect-3/4 w-16 shrink-0 overflow-hidden bg-cream transition-opacity sm:w-20 ${
                  selectedIndex === index ? "ring-2 ring-brand" : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={image} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-colors hover:bg-white/20"
            aria-label="Close"
          >
            ×
          </button>

          <div className="relative max-h-[90vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={primaryImage}
              alt={productName}
              width={1200}
              height={1600}
              className="h-auto max-h-[90vh] w-auto object-contain"
            />

            {images.length > 1 && (
              <div className="mt-4 flex justify-center gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedIndex(index)}
                    className={`h-2 w-2 rounded-full transition-all ${
                      selectedIndex === index ? "w-8 bg-white" : "bg-white/50 hover:bg-white/70"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
