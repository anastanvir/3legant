import Image from 'next/image';
import Link from 'next/link';

import Overlay from './Overlay';
import Handbags from '../../public/slider/slider1.jpg';
import Pants from '../../public/slider/slider2.jpg';
import Shirts from '../../public/slider/slider3.jpg';

const Categories = () => {
  return (
    <div className='grid auto-rows-[300px] grid-cols-2 gap-4 md:auto-rows-[330px] md:grid-cols-4'>
      <Link
        href='/search?category=Home Assistant'
        className='group relative col-span-2 row-span-1 overflow-hidden md:row-span-2'
      >
        <Image
          src={Shirts}
          alt='Collection of shirts'
          width={500}
          height={500}
          className='h-full w-full object-cover'
          placeholder='blur'
          loading='lazy'
        />
        <Overlay category='Home Assistant' />
      </Link>
      <Link
        href='/search?category=Earbuds'
        className='group relative col-span-2 overflow-hidden'
      >
        <Image
          src={Pants}
          alt='Collection of pants'
          width={500}
          height={500}
          className='h-full w-full object-cover'
          placeholder='blur'
          loading='lazy'
        />
        <Overlay category='Mobile Phones' />
      </Link>
      <Link
        href='/search?category=Earpods'
        className='group relative col-span-2 overflow-hidden'
      >
        <Image
          src={Handbags}
          alt='Collection of handbags'
          width={500}
          height={500}
          className='h-full w-full object-cover'
          placeholder='blur'
          loading='lazy'
        />
        <Overlay category='earbuds' />
      </Link>
    </div>
  );
};

export default Categories;
