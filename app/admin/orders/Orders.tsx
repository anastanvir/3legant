'use client';

import Link from 'next/link';
import useSWR from 'swr';

import { Order } from '@/lib/models/OrderModel';

export default function Orders() {
  const { data: orders, error, isLoading } = useSWR('/api/admin/orders');

  if (error)
    return (
      <div className='alert alert-error'>
        <span>Error loading orders: {error.message}</span>
      </div>
    );

  if (isLoading)
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='loading loading-spinner loading-lg'></div>
      </div>
    );

  return (
    <div className='p-4'>
      <h1 className='mb-4 text-2xl font-bold'>Orders</h1>

      {/* Desktop Table */}
      <div className='hidden overflow-x-auto rounded-lg border border-base-300 md:block'>
        <table className='table w-full'>
          <thead className='bg-base-200'>
            <tr>
              <th className='px-4 py-3'>ID</th>
              <th className='px-4 py-3'>User</th>
              <th className='px-4 py-3'>Date</th>
              <th className='px-4 py-3 text-right'>Total</th>
              <th className='px-4 py-3'>Payment</th>
              <th className='px-4 py-3'>Delivery</th>
              <th className='px-4 py-3'>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: Order) => (
              <tr key={order._id} className='hover:bg-base-200'>
                <td className='px-4 py-3 font-mono'>..{order._id.substring(20, 24)}</td>
                <td className='px-4 py-3'>{order.user?.name || <span className='text-error'>Deleted user</span>}</td>
                <td className='px-4 py-3'>{order.createdAt.substring(0, 10)}</td>
                <td className='px-4 py-3 text-right'>${order.totalPrice.toFixed(2)}</td>
                <td className='px-4 py-3'>
                  <span className={`badge ${order.isPaid ? 'badge-success' : 'badge-error'}`}>
                    {order.isPaid && order.paidAt
                      ? order.paidAt.substring(0, 10)
                      : 'Not paid'}
                  </span>
                </td>
                <td className='px-4 py-3'>
                  <span className={`badge ${order.isDelivered ? 'badge-success' : 'badge-error'}`}>
                    {order.isDelivered && order.deliveredAt
                      ? order.deliveredAt.substring(0, 10)
                      : 'Not delivered'}
                  </span>
                </td>
                <td className='px-4 py-3'>
                  <Link
                    href={`/order/${order._id}`}
                    className='btn btn-mute btn-block btn-sm'
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className='space-y-4 md:hidden'>
        {orders.map((order: Order) => (
          <div key={order._id} className='card border border-base-300 bg-base-100 shadow'>
            <div className='card-body p-4'>
              <div className='grid grid-cols-2 gap-2'>
                <div className='font-semibold'>Order ID:</div>
                <div className='font-mono text-right'>..{order._id.substring(20, 24)}</div>
                
                <div className='font-semibold'>User:</div>
                <div className='text-right'>{order.user?.name || <span className='text-error'>Deleted</span>}</div>
                
                <div className='font-semibold'>Date:</div>
                <div className='text-right'>{order.createdAt.substring(0, 10)}</div>
                
                <div className='font-semibold'>Total:</div>
                <div className='text-right font-medium'>${order.totalPrice.toFixed(2)}</div>
                
                <div className='font-semibold'>Payment:</div>
                <div className='text-right'>
                  <span className={`badge ${order.isPaid ? 'badge-success' : 'badge-error'}`}>
                    {order.isPaid && order.paidAt ? order.paidAt.substring(0, 10) : 'Not paid'}
                  </span>
                </div>
                
                <div className='font-semibold'>Delivery:</div>
                <div className='text-right'>
                  <span className={`badge ${order.isDelivered ? 'badge-success' : 'badge-error'}`}>
                    {order.isDelivered && order.deliveredAt ? order.deliveredAt.substring(0, 10) : 'Not delivered'}
                  </span>
                </div>
              </div>
              
              <div className='card-actions mt-4 justify-center'>
                <Link
                  href={`/order/${order._id}`}
                  className='btn btn-mute btn-block btn-sm'
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}