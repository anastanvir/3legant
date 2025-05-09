import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPlaiceholder } from 'plaiceholder';
import { FiArrowLeft, FiShare2, FiHeart } from 'react-icons/fi';

import AddToCart from '@/components/products/AddToCart';
import { Rating } from '@/components/products/Rating';
import productService from '@/lib/services/productService';
import { convertDocToObj } from '@/lib/utils';

const ProductGallery = dynamic(() => import('@/components/ProductGallery'), {
  ssr: false,
  loading: () => <div className="aspect-square bg-base-200 animate-pulse rounded-xl" />
});

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const product = await productService.getBySlug(params.slug);
  if (!product) return notFound();

  return {
    title: `${product.name} | Gizmoz`,
    description: product.description,
    openGraph: {
      images: product.images,
    },
  };
};

const ProductPage = async ({ params }: { params: { slug: string } }) => {
  const product = await productService.getBySlug(params.slug);
  if (!product) return notFound();

  const buffer = await fetch(product.images[0]).then(async (res) =>
    Buffer.from(await res.arrayBuffer())
  );
  const { base64 } = await getPlaiceholder(buffer);

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
      {/* Mobile Back Button */}
      <div className="lg:hidden mb-4">
        <Link href="/" className="btn btn-ghost btn-sm">
          <FiArrowLeft className="mr-1" />
          Back
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
        {/* Product Gallery - Full width on mobile, 60% on desktop */}
        <div className="w-full lg:w-[58%]">
          <ProductGallery
            images={product.images}
            base64={base64}
            name={product.name}
          />
        </div>

        {/* Product Info - Sticky on desktop */}
        <div className="w-full lg:w-[42%] lg:sticky lg:top-32 h-fit bg-base-300 md:p-10 p-5 rounded-box">
          <div className="space-y-6">
            {/* Title and Actions */}
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {product.name}
                  </h1>
                  <p className="mt-1 text-sm text-base-content/70">
                    {product.brand}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-ghost btn-sm btn-square">
                    <FiShare2 />
                  </button>
                  <button className="btn btn-ghost btn-sm btn-square">
                    <FiHeart />
                  </button>
                </div>
              </div>

              {/* Rating - Mobile top placement */}
              <div className="mt-3 lg:hidden">
                <Rating 
                  value={product.rating} 
                  caption={`(${product.numReviews})`}
                />
              </div>
            </div>

            {/* Rating - Desktop placement */}
            <div className="hidden lg:block">
              <Rating 
                value={product.rating} 
                caption={`(${product.numReviews})`}
              />
            </div>

            {/* Price and Stock */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-base-200">
                <span className="text-lg font-medium">Price</span>
                <span className="text-2xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-base-200">
                <span className="text-lg font-medium">Availability</span>
                <span className={`text-lg font-medium ${
                  product.countInStock > 0 ? 'text-success' : 'text-error'
                }`}>
                  {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* Add to Cart */}
              {product.countInStock > 0 && (
                <div className="pt-2">
                  <AddToCart
                    item={{
                      ...convertDocToObj(product),
                      qty: 1,
                      color: '',
                      size: '',
                    }}
                  />
                </div>
              )}
            </div>

            {/* Highlights - Mobile only */}
            {/* <div className="lg:hidden bg-base-200 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Key Features</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {product.highlights?.map((feature: string, i: number) => (
                  <li key={i}>{feature}</li>
                )) || (
                  <li>Premium quality materials</li>
                )}
              </ul>
            </div> */}
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-8 lg:mt-12">
        <div className="tabs">
          <a className="tab tab-bordered tab-active">Description</a>
          <a className="tab tab-bordered">Specifications</a>
          <a className="tab tab-bordered">Reviews ({product.numReviews})</a>
        </div>

        <div className="mt-4 bg-base-100 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Product Details</h2>
          <div className="prose max-w-none text-base-content">
            {product.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;