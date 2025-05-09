'use client';

import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

import useCartService from '@/lib/hooks/useCartStore';
import Loading from '../loading';

const EmptyCart = () => {
  return (
    <div className='flex flex-col items-center justify-center gap-4 px-4 py-12 text-center'>
      <div className='rounded-full bg-base-300 p-6'>
        <ShoppingCart className='h-12 w-12 text-primary' />
      </div>
      <h2 className='text-2xl font-bold'>Your Cart is Empty</h2>
      <p className='max-w-md text-base-content/80'>
        {"Looks like you haven't added anything to your cart yet. Start shopping to discover amazing products!"}
      </p>
      <Link
        href='/search?q=all&category=all&price=all&rating=all&sort=newest&page=1'
        className='btn btn-primary mt-4 px-6 py-3'
      >
        Browse Products
      </Link>
    </div>
  );
};

const CartDetails = () => {
  const { items, itemsPrice, decrease, increase } = useCartService();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const shippingPrice = 250; // Fixed shipping cost
  const totalPrice = itemsPrice + shippingPrice;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className='flex min-h-[400px] items-center justify-center'><Loading /></div>;

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='mb-8 text-center text-3xl font-bold'>Shopping Cart</h1>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className='grid gap-8 md:grid-cols-4'>
          {/* Cart Items - Desktop */}
          <div className='md:col-span-3'>
            <div className='hidden overflow-x-auto rounded-lg border border-base-300 md:block'>
              <table className='table w-full'>
                <thead className='bg-base-200'>
                  <tr>
                    <th className='px-4 py-3'>Item</th>
                    <th className='px-4 py-3'>Quantity</th>
                    <th className='px-4 py-3 text-right'>Price</th>
                    <th className='px-4 py-3 text-right'>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.slug} className='hover:bg-base-200'>
                      <td className='px-4 py-3'>
                        <div className='flex items-center space-x-4'>
                          <Link href={`/product/${item.slug}`} className='shrink-0'>
                            <Image
                              src={item.images[0]}
                              alt={item.name}
                              width={80}
                              height={80}
                              className='rounded-lg object-cover'
                              priority
                            />
                          </Link>
                          <span className='font-medium'>{item.name}</span>
                        </div>
                      </td>
                      <td className='px-4 py-3'>
                        <div className='flex items-center space-x-2'>
                          <button
                            className='btn btn-square btn-sm'
                            onClick={() => decrease(item)}
                            disabled={item.qty <= 1}
                          >
                            -
                          </button>
                          <span className='w-8 text-center'>{item.qty}</span>
                          <button
                            className='btn btn-square btn-sm'
                            onClick={() => increase(item)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className='px-4 py-3 text-right font-medium'>
                        ${item.price.toFixed(2)}
                      </td>
                      <td className='px-4 py-3 text-right font-bold'>
                        ${(item.price * item.qty).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

            {/* Cart Items - Mobile */}
            <div className='space-y-4 md:hidden'>
              {items.map((item) => (
                <div key={item.slug} className='card border border-base-300 bg-base-100'>
                  <div className='card-body p-4'>
                    {/* Image at the top for better visibility */}
                    <div className='mb-4 flex justify-center'>
                      <Link href={`/product/${item.slug}`}>
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          width={160}
                          height={160}
                          className='rounded-lg object-cover'
                          priority
                        />
                      </Link>
                    </div>

                    <div className='space-y-3'>
                      <h3 className='text-center font-medium'>{item.name}</h3>

                      <div className='flex justify-between items-center'>
                        <span className='font-bold'>Price:</span>
                        <span className='font-medium'>${item.price.toFixed(2)}</span>
                      </div>

                      <div className='flex justify-between items-center'>
                        <span className='font-bold'>Total:</span>
                        <span className='font-bold text-lg'>${(item.price * item.qty).toFixed(2)}</span>
                      </div>

                      <div className='flex items-center justify-between pt-2'>
                        <span className='font-bold'>Quantity:</span>
                        <div className='flex items-center space-x-3'>
                          <button
                            className='btn btn-square btn-sm'
                            onClick={() => decrease(item)}
                            disabled={item.qty <= 1}
                          >
                            -
                          </button>
                          <span className='w-8 text-center font-medium'>{item.qty}</span>
                          <button
                            className='btn btn-square btn-sm'
                            onClick={() => increase(item)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className='md:col-span-1'>
            <div className='card border border-base-300 bg-base-100 md:sticky md:top-36'>
              <div className='card-body'>
                <h2 className='card-title mb-4 text-lg'>Order Summary</h2>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span>Subtotal</span>
                    <span className='font-medium'>${itemsPrice.toFixed(2)}</span>
                  </div>

                  <div className='flex justify-between'>
                    <span>Shipping</span>
                    <span className='font-medium'>${shippingPrice.toFixed(2)}</span>
                  </div>

                  <div className='divider my-0'></div>

                  <div className='flex justify-between text-lg font-bold'>
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={() => router.push('/shipping')}
                    className='btn btn-primary w-full mt-4'
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartDetails;