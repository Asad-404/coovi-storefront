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
      <div className="flex flex-col gap-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="relative aspect-[3/4] overflow-hidden rounded-xl bg-zinc-100 transition-opacity hover:opacity-95 dark:bg-zinc-800"
        >
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={productName}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-400">
              No image
            </div>
          )}
        </button>

        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-4">
            {images.slice(0, 4).map((image, index) => (
              <button
                key={image}
                onClick={() => setSelectedIndex(index)}
                className={`relative aspect-[3/4] overflow-hidden rounded-lg bg-zinc-100 transition-all dark:bg-zinc-800 ${
                  selectedIndex === index
                    ? "ring-2 ring-rose-700 dark:ring-rose-400"
                    : "hover:opacity-80"
                }`}
              >
                <Image
                  src={image}
                  alt={`${productName} - Image ${index + 1}`}
                  fill
                  sizes="20vw"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
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
              className="h-auto max-h-[90vh] w-auto rounded-lg object-contain"
            />

            {images.length > 1 && (
              <div className="mt-4 flex justify-center gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedIndex(index)}
                    className={`h-2 w-2 rounded-full transition-all ${
                      selectedIndex === index
                        ? "w-8 bg-white"
                        : "bg-white/50 hover:bg-white/70"
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
