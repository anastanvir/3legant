import { Metadata } from 'next';
import { Suspense } from 'react';

import Carousel, { CarouselSkeleton } from '@/components/carousel/carousel';
import Categories from '@/components/categories/Categories';
import Icons from '@/components/icons/Icons';
import ProductItems, {
  ProductItemsSkeleton,
} from '@/components/products/ProductItems';
import ReadMore from '@/components/readMore/ReadMore';
import Text from '@/components/readMore/Text';
import Slider from '@/components/slider/Slider';

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'Fullstack Next.js Store',
  description:
    process.env.NEXT_PUBLIC_APP_DESC ||
    'Fullstack Next.js Store - Server Components, MongoDB, Next Auth, Tailwind, Zustand',
};

const HomePage = () => {
  return (
    <div className='mb-8 flex flex-col gap-4 md:gap-16'>
      <div>
        <Suspense fallback={<CarouselSkeleton />}>
          <Carousel />
        </Suspense>
      </div>
      <div className='flex justify-between items-center flex-col md:gap-8 gap-4 md:flex-row container'>
        <div className='flex-1'>
          <p className='text-nowrap text-3xl font-semibold md:text-6xl md:text-start text-center py-5 '>
            Modern Gear <br /> <span className='text-neutral-400' >Timeless Service.</span>
          </p>
        </div>
        <div className=''>
          <div className='md:text-start text-center' >
            <span className='font-bold  '>3legant.</span> is a leading tech store in Pakistan, <br className='hidden sm:inline' />
            providing quality gadgets and accessories since 2025.

          </div>
        </div>
      </div>
      <Categories />
      <Icons />

      <Suspense
        fallback={<ProductItemsSkeleton qty={8} name='Latest Products' />}
      >
        <ProductItems />
      </Suspense>

      <Suspense fallback={<ProductItemsSkeleton qty={4} name='Top Rated' />}>
        <Slider />
      </Suspense>

      <ReadMore>
        <Text />
      </ReadMore>
    </div>
  );
};

export default HomePage;
