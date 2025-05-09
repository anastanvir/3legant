'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const Carousel = () => {
  const featuredProducts = [
    {
      image: '/slider/slider1.jpg',
      title: '3legant EchoBeats – Stylish Wireless Audio Redefined',
      description: 'Experience crystal-clear sound with a touch of class. EchoBeats combine sleek aesthetics with immersive audio for modern lifestyles.',
    },
    {
      image: '/slider/slider2.jpg',
      title: '3legant PulsePods – Smart Earbuds with Adaptive Clarity',
      description: "Seamlessly engineered for work and play, PulsePods offer intelligent noise control and real-time audio sync in a compact design.",
    },
    {
      image: '/slider/slider3.jpg',
      title: '3legant HomeCore AI – Smart Living, Beautifully Simplified',
      description: "Enhance your space with HomeCore AI—your intelligent assistant designed to adapt, anticipate, and elevate your daily routine.",
    },
  ];

  // Animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.5,
        ease: "backOut"
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  return (
    <div className='group relative h-[80vh] w-full overflow-hidden md:h-screen'>
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          renderBullet: (index, className) => {
            return `<span class="${className} bg-white/50 hover:bg-white/80 transition-all duration-300"></span>`;
          },
        }}
        className='h-full w-full'
      >
        {featuredProducts.map((product, index) => (
          <SwiperSlide key={index}>
            <div className='relative h-full w-full'>
              {/* Background Image */}
              <Image
                src={product.image}
                fill
                className='object-cover'
                alt={product.title}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              />

              {/* Gradient Overlay */}
              <div className='absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/50 to-transparent md:bg-gradient-to-r md:from-black/70 md:via-black/40 md:to-transparent' />

              {/* Animated Content */}
              <div className='absolute inset-0 z-20 flex items-end pb-12 px-6 md:items-center md:pb-0 md:px-12 lg:px-20'>
                <motion.div
                  className='max-w-4xl space-y-4 md:space-y-6'
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                >
                  <motion.h2
                    className='text-2xl font-semibold text-white sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl'
                    variants={textVariants}
                  >
                    {product.title}
                  </motion.h2>

                  <motion.p
                    className='text-sm text-gray-200 sm:text-base md:text-lg lg:max-w-2xl lg:text-xl'
                    variants={textVariants}
                  >
                    {product.description}
                  </motion.p>

                  <motion.div variants={buttonVariants}>
                    <Link
                      href='/products'
                      className='mt-4 inline-block rounded-lg bg-white/10 px-6 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:shadow-lg md:px-8 md:py-3 md:text-base'
                    >
                      Shop Now
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;

export const CarouselSkeleton = () => {
  return <div className='h-[80vh] w-full bg-gray-800 md:h-screen' />;
};