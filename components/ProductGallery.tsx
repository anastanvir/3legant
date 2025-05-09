'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FiZoomIn } from 'react-icons/fi';

export default function ProductGallery({
  images,
  base64,
  name,
}: {
  images: string[];
  base64: string;
  name: string;
}) {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main image container with zoom controls */}
      <div 
        className="relative aspect-square w-full max-h-96 bg-gray-50 dark:bg-base-200 rounded-xl overflow-hidden shadow-sm cursor-zoom-in"
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <Image
          src={selectedImage}
          alt={`${name} - Selected`}
          placeholder="blur"
          blurDataURL={base64}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className={`object-contain p-4 transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}
          priority
        />
        
        {/* Zoom indicator */}
        <div className="absolute bottom-3 right-3 bg-white/80 dark:bg-black/60 p-2 rounded-full shadow-md">
          <FiZoomIn className="text-lg" />
        </div>
      </div>

      {/* Thumbnail navigation with scrollable container */}
      <div className="relative">
        <div className="flex gap-2 overflow-x-auto pt-2 pb-2 scrollbar-hide px-1">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(img);
                setIsZoomed(false);
              }}
              aria-label={`View ${name} variation ${index + 1}`}
              className={`flex-shrink-0 relative aspect-square w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-box transition-all duration-200 border-2 ${
                selectedImage === img
                  ? 'border-primary dark:border-primary-focus scale-105 shadow-md'
                  : 'border-transparent hover:border-gray-300 dark:hover:border-base-300 opacity-90 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt=""
                placeholder="blur"
                blurDataURL={base64}
                fill
                sizes="80px"
                className="object-cover"
                aria-hidden
              />
            </button>
          ))}
        </div>
      </div>

      {/* Mobile swipe indicator (only shows when scrolling is possible) */}
      {images.length > 4 && (
        <div className="lg:hidden text-center text-xs text-gray-500 dark:text-gray-400">
          ← Swipe to view more →
        </div>
      )}
    </div>
  );
}