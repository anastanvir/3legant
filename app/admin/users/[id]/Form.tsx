'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ValidationRule, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import { User } from '@/lib/models/UserModel';
import { formatId } from '@/lib/utils';

export default function UserEditForm({ userId }: { userId: string }) {
  // Fetch user data
  const { data: user, error: userError } = useSWR(`/api/admin/users/${userId}`);

  // Fetch user orders with mutate function for refreshing
  const {
    data: orders,
    error: ordersError,
    isLoading: ordersLoading,
    mutate: mutateOrders,
  } = useSWR(`/api/admin/users/${userId}/orders`, async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 404) return [];
      throw new Error('Failed to fetch orders');
    }
    return res.json();
  });

  const router = useRouter();
  const { trigger: updateUser, isMutating: isUpdating } = useSWRMutation(
    `/api/admin/users/${userId}`,
    async (url, { arg }) => {
      const res = await fetch(`${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message);

      toast.success('User updated successfully');
      router.push('/admin/users');
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<User>();

  useEffect(() => {
    if (!user) return;
    setValue('name', user.name);
    setValue('email', user.email);
    setValue('isAdmin', user.isAdmin);
  }, [user, setValue]);

  const formSubmit = async (formData: any) => {
    await updateUser(formData);
  };

  if (userError) return <div className="alert alert-error">{userError.message}</div>;
  if (!user) return <div className="loading loading-spinner loading-lg"></div>;

  const FormInput = ({
    id,
    name,
    required,
    pattern,
  }: {
    id: keyof User;
    name: string;
    required?: boolean;
    pattern?: ValidationRule<RegExp>;
  }) => (
    <div className="form-control w-full">
      <label className="label" htmlFor={id}>
        <span className="label-text font-medium">{name}</span>
        {required && <span className="label-text-alt text-error">*required</span>}
      </label>
      <input
        type="text"
        id={id}
        {...register(id, {
          required: required && `${name} is required`,
          pattern,
        })}
        className={`input input-bordered w-full ${errors[id] ? 'input-error' : ''}`}
      />
      {errors[id]?.message && (
        <label className="label">
          <span className="label-text-alt text-error">{errors[id]?.message}</span>
        </label>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
      {/* User Edit Form */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            Edit User: <span className="text-primary">{user.name}</span>
          </h1>
          <div className="badge badge-neutral">{formatId(userId)}</div>
        </div>

        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <form onSubmit={handleSubmit(formSubmit)} className="space-y-4">
              <FormInput name="Name" id="name" required />
              <FormInput name="Email" id="email" required />

              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-4">
                  <span className="label-text font-medium">Admin Privileges</span>
                  <input
                    id="isAdmin"
                    type="checkbox"
                    className="toggle toggle-primary"
                    {...register('isAdmin')}
                  />
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button type="submit" disabled={isUpdating} className="btn btn-primary flex-1">
                  {isUpdating ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Updating...
                    </>
                  ) : (
                    'Update User'
                  )}
                </button>
                <Link href="/admin/users" className="btn btn-outline flex-1">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Order History Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Order History</h2>
          {ordersError && (
            <button onClick={() => mutateOrders()} className="btn btn-sm btn-ghost">
              Retry
            </button>
          )}
        </div>

        {ordersError ? (
          <div className="alert alert-error">
            <div className="flex-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="w-6 h-6 mx-2 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
              <label>{ordersError.message}</label>
            </div>
          </div>
        ) : ordersLoading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : !orders?.length ? (
          <div className="card bg-base-200">
            <div className="card-body text-center">
              <svg
                className="w-12 h-12 mx-auto text-base-content/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                ></path>
              </svg>
              <p className="mt-2 text-base-content/80">No orders found for this user</p>
            </div>
          </div>
        ) : (
          <div className="card bg-base-200 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr className="bg-base-300">
                    <th className="text-base-content">ID</th>
                    <th className="text-base-content">DATE</th>
                    <th className="text-base-content">TOTAL</th>
                    <th className="text-base-content">PAID</th>
                    <th className="text-base-content">DELIVERED</th>
                    <th className="text-base-content">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: any) => (
                    <tr key={order._id} className="hover:bg-base-300/50">
                      <td className="font-mono text-sm">{order._id.substring(20, 24)}</td>
                      <td className="whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td>${order.totalPrice.toFixed(2)}</td>
                      <td>
                        {order.isPaid ? (
                          <span className="badge badge-success">
                            {new Date(order.paidAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="badge badge-error">Not Paid</span>
                        )}
                      </td>
                      <td>
                        {order.isDelivered ? (
                          <span className="badge badge-success">
                            {new Date(order.deliveredAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="badge badge-warning">Pending</span>
                        )}
                      </td>
                      <td>
                        <Link href={`/admin/orders/${order._id}`} className="btn btn-ghost btn-xs">
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
