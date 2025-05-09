'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/lib/models/ProductModel';
import { motion } from 'framer-motion';

const ProductItem = ({ product }: { product: Product }) => {
  const images = product.images || [product.images];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);

  // Cancel any pending animations on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const difference = touchStartX.current - touchEndX.current;
    if (difference > 5) nextImage();
    else if (difference < -5) prevImage();

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Optimized auto-rotation using requestAnimationFrame
  useEffect(() => {
    if (!isHovered || images.length <= 1) return;

    let lastTime = 0;
    const delay = 3000; // 3 seconds

    const tick = (time: number) => {
      if (!lastTime || time - lastTime >= delay) {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
        lastTime = time;
      }
      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isHovered, images.length]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      className="group card bg-base-300 p-3 hover:shadow-lg transition-all duration-300 cursor-pointer w-full border border-base-300 rounded-xl overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <figure className="relative pt-[100%] rounded-box overflow-hidden">
        <Link
          href={`/product/${product.slug}`}
          className="absolute inset-0"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Simple fade transition instead of slide for better performance */}
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={images[currentImageIndex]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              priority
            />
          </motion.div>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-base-100 bg-opacity-60 rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                onClick={(e) => {
                  e.preventDefault();
                  prevImage();
                }}
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-base-100 bg-opacity-60 rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                onClick={(e) => {
                  e.preventDefault();
                  nextImage();
                }}
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Optimized indicators - no motion */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-1.5">
              {images.map((_, index: number) => (
                <span
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    index === currentImageIndex ? 'bg-primary w-4' : 'bg-base-300 w-1.5'
                  }`}
                />
              ))}
            </div>
          )}
        </Link>
      </figure>

      <div className="card-body p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="card-title font-medium text-base md:text-lg line-clamp-2 h-[3em]">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-base-content/70 mb-2 line-clamp-1">{product.brand}</p>
        <div className="card-actions flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
          {product.countInStock > 0 ? (
            <span className="badge badge-success badge-sm md:badge-md">In Stock</span>
          ) : (
            <span className="badge badge-error badge-sm md:badge-md">Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
