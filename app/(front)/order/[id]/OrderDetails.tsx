'use client';

import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import { OrderItem } from '@/lib/models/OrderModel';

interface IOrderDetails {
  orderId: string;
  paypalClientId: string;
}

const OrderDetails = ({ orderId, paypalClientId }: IOrderDetails) => {
  const { data: session } = useSession();

  // Add type guard for session.user
  const isAdmin = session?.user?.isAdmin || false;

  // Mark order as paid (admin only)
  const { trigger: payOrder } = useSWRMutation(
    `/api/admin/orders/${orderId}/pay`,
    async (url) => {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    },
  );

  // Mark order as delivered (admin only)
  const { trigger: deliverOrder } = useSWRMutation(
    `/api/admin/orders/${orderId}/deliver`,
    async (url) => {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    },
  );

  const handleMarkAsDelivered = async () => {
    try {
      if (!data?.isPaid) {
        await toast.promise(payOrder(), {
          loading: 'Marking order as paid...',
          success: 'Order marked as paid successfully',
          error: (err) => err.message,
        });
      }

      await toast.promise(deliverOrder(), {
        loading: 'Marking order as delivered...',
        success: 'Order marked as delivered successfully',
        error: (err) => err.message,
      });

      mutate();
    } catch (error) {
      console.error('Delivery failed:', error);
    }
  };

  // PayPal payment flow
  function createPayPalOrder() {
    return fetch(`/api/orders/${orderId}/create-paypal-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((order) => order.id);
  }

  function onApprovePayPalOrder(data: any) {
    return fetch(`/api/orders/${orderId}/capture-paypal-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(() => {
        toast.success('Order paid successfully');
      });
  }

  const { data, error, mutate } = useSWR(`/api/orders/${orderId}`);

  if (error) return <div className='alert alert-error'>{error.message}</div>;
  if (!data) return <div className='loading loading-spinner loading-lg'></div>;

  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isDelivered,
    deliveredAt,
    isPaid,
    paidAt,
  } = data;

  return (
    <div className='p-4'>
      <h1 className='mb-4 text-xl font-bold sm:text-2xl'>Order {orderId}</h1>

      <div className='grid gap-4 md:grid-cols-4'>
        <div className='space-y-4 md:col-span-3'>
          {/* Shipping Address Card */}
          <div className='card bg-base-200'>
            <div className='card-body'>
              <h2 className='card-title'>Shipping Address</h2>
              <div className='space-y-1'>
                <p>{shippingAddress.fullName}</p>
                <p>
                  {shippingAddress.address}, {shippingAddress.city},{' '}
                  {shippingAddress.postalCode}, {shippingAddress.country}
                </p>
                <div
                  className={`badge ${isDelivered ? 'badge-success' : 'badge-error'}`}
                >
                  {isDelivered
                    ? `Delivered at ${new Date(deliveredAt).toLocaleString()}`
                    : 'Not Delivered'}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className='card bg-base-200'>
            <div className='card-body'>
              <h2 className='card-title'>Payment Method</h2>
              <div className='space-y-1'>
                <p>{paymentMethod}</p>
                <div
                  className={`badge ${isPaid ? 'badge-success' : 'badge-error'}`}
                >
                  {isPaid
                    ? `Paid at ${new Date(paidAt).toLocaleString()}`
                    : 'Not Paid'}
                </div>
              </div>
            </div>
          </div>

          {/* Order Items Card */}
          <div className='card bg-base-200'>
            <div className='card-body'>
              <h2 className='card-title'>Items</h2>
              <div className='overflow-x-auto'>
                <table className='table'>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item: OrderItem) => {
                      // const image = items.images[0];
                      return (
                        <tr key={item.slug}>
                          <td>
                            <Link
                              href={`/product/${item.slug}`}
                              className='flex items-center space-x-2'
                            >
                              <Image
                                src={item.images[0]}
                                alt={item.name}
                                width={50}
                                height={50}
                                className='rounded'
                              />
                              <span>
                                {item.name} ({item.color} {item.size})
                              </span>
                            </Link>
                          </td>
                          <td>{item.qty}</td>
                          <td>${item.price}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className='card bg-base-200'>
          <div className='card-body'>
            <h2 className='card-title'>Order Summary</h2>
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span>Items</span>
                <span>${itemsPrice}</span>
              </div>
              <div className='flex justify-between'>
                <span>Tax</span>
                <span>${taxPrice}</span>
              </div>
              <div className='flex justify-between'>
                <span>Shipping</span>
                <span>${shippingPrice}</span>
              </div>
              <div className='flex justify-between border-t pt-2 font-bold'>
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>

              {/* Payment Section */}
              {!isPaid && paymentMethod === 'PayPal' && (
                <div className='mt-4'>
                  <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                    <PayPalButtons
                      createOrder={createPayPalOrder}
                      onApprove={onApprovePayPalOrder}
                    />
                  </PayPalScriptProvider>
                </div>
              )}

              {/* Admin Controls */}
              {isAdmin && !isDelivered && (
                <button
                  className='btn btn-primary mt-4 w-full'
                  onClick={handleMarkAsDelivered}
                >
                  Mark as Delivered
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
