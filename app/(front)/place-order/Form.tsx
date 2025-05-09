'use client';

import mongoose from 'mongoose';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaEdit, FaBox, FaShippingFast, FaCreditCard, FaHome } from 'react-icons/fa';

import useSWRMutation from 'swr/mutation';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import useCartService from '@/lib/hooks/useCartStore';

type OrderItem = {
  _id: string;
  name: string;
  slug: string;
  qty: number;
  images: string[];
  price: number;
  color?: string;
  size?: string;
};

type ShippingAddress = {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

type OrderData = {
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
};

const Form = () => {
  const router = useRouter();
  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    clear,
  } = useCartService();

  const [mounted, setMounted] = useState(false);

  const { trigger: placeOrder, isMutating: isPlacing } = useSWRMutation(
    '/api/orders',
    async (url, { arg }: { arg: OrderData }) => {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to place order');
      return data;
    }
  );

  const handlePlaceOrder = async () => {
    try {
      const invalidItems = items.filter((item) => {
        try {
          if (!item._id) return true;
          new mongoose.Types.ObjectId(item._id.toString());
          return false;
        } catch {
          return true;
        }
      });

      if (invalidItems.length > 0) {
        throw new Error('Some items have invalid IDs');
      }

      const orderData: OrderData = {
        paymentMethod,
        shippingAddress,
        items: items.map((item) => ({
          _id: item._id.toString(),
          name: item.name,
          slug: item.slug,
          qty: item.qty,
          images: item.images,
          price: item.price,
          color: item.color || '',
          size: item.size || '',
        })),
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      const result = await placeOrder(orderData);
      clear();
      toast.success('Order placed successfully');
      router.push(`/order/${result.order._id}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order');
    }
  };

  useEffect(() => {
    setMounted(true);
    if (!paymentMethod) router.push('/payment');
    if (items.length === 0) router.push('/');
  }, [paymentMethod, items.length, router]);

  if (!mounted) return (
    <div className="flex justify-center items-center h-64">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <CheckoutSteps current={4} />

      <div className="my-6 flex flex-col lg:flex-row gap-6">
        {/* Left Column - Order Details */}
        <div className="flex-1 space-y-6">
          {/* Shipping Address Card */}
          <div className="card bg-base-300 shadow-sm">
            <div className="card-body p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="card-title text-lg flex items-center gap-2">
                  <FaHome className="text-primary text-xl" />
                  <span>Shipping Address</span>
                </h2>
                <Link href="/shipping" className="btn btn-sm btn-ghost">
                  <FaEdit className="mr-1" /> Edit
                </Link>
              </div>
              <div className="space-y-1 text-sm sm:text-base">
                <p className="font-medium">{shippingAddress.fullName}</p>
                <p>{shippingAddress.address}</p>
                <p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
                <p>{shippingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="card bg-base-300 shadow-sm">
            <div className="card-body p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="card-title text-lg flex items-center gap-2">
                  <FaCreditCard className="text-primary text-xl" />
                  <span>Payment Method</span>
                </h2>
                <Link href="/payment" className="btn btn-sm btn-ghost">
                  <FaEdit className="mr-1" /> Edit
                </Link>
              </div>
              <p className="font-medium text-sm sm:text-base">{paymentMethod}</p>
            </div>
          </div>

          {/* Order Items Card */}
          <div className="card bg-base-300 shadow-sm">
            <div className="card-body p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="card-title text-lg flex items-center gap-2">
                  <FaBox className="text-primary text-xl" />
                  <span>Order Items</span>
                </h2>
                <Link href="/cart" className="btn btn-sm btn-ghost">
                  <FaEdit className="mr-1" /> Edit
                </Link>
              </div>

              <div className="space-y-4 sm:hidden">
                {items.map((item) => (
                  <div key={item.slug} className="flex gap-4 border-b pb-4 last:border-0">
                    <Link href={`/product/${item.slug}`} className="shrink-0">
                      {item.images?.[0] && (
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover"
                        />
                      )}
                    </Link>
                    <div className="flex-1">
                      <Link href={`/product/${item.slug}`} className="font-medium">
                        {item.name}
                      </Link>
                      {(item.color || item.size) && (
                        <p className="text-xs text-base-content/70 mt-1">
                          {item.color} {item.size}
                        </p>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm">Qty: {item.qty}</span>
                        <span className="font-medium">${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden sm:block overflow-x-auto">
                <table className="table table-compact w-full">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th className="text-right">Qty</th>
                      <th className="text-right">Price</th>
                      <th className="text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.slug}>
                        <td>
                          <Link href={`/product/${item.slug}`} className="flex items-center space-x-4">
                            {item.images?.[0] && (
                              <Image
                                src={item.images[0]}
                                alt={item.name}
                                width={64}
                                height={64}
                                className="rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium">{item.name}</p>
                              {(item.color || item.size) && (
                                <p className="text-sm text-base-content/70">
                                  {item.color} {item.size}
                                </p>
                              )}
                            </div>
                          </Link>
                        </td>
                        <td className="text-right">{item.qty}</td>
                        <td className="text-right">${item.price.toFixed(2)}</td>
                        <td className="text-right font-medium">
                          ${(item.price * item.qty).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:w-96">
          <div className="card bg-base-300 shadow-sm sticky top-32">
            <div className="card-body p-4 sm:p-6">
              <h2 className="card-title text-lg mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm sm:text-base">
                <div className="flex justify-between">
                  <span>Items ({items.reduce((a, c) => a + c.qty, 0)})</span>
                  <span className="font-medium">${itemsPrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium">${shippingPrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="font-medium">${taxPrice.toFixed(2)}</span>
                </div>

                <div className="divider my-2"></div>

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacing}
                  className="btn btn-primary w-full mt-4"
                >
                  {isPlacing ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;