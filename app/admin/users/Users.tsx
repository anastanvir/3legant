'use client';

import Link from 'next/link';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import { User } from '@/lib/models/UserModel';
import { formatId } from '@/lib/utils';

export default function Users() {
  const { data: users, error, isLoading } = useSWR(`/api/admin/users`);
  const { trigger: deleteUser } = useSWRMutation(
    `/api/admin/users`,
    async (url, { arg }: { arg: { userId: string } }) => {
      const toastId = toast.loading('Deleting user...');
      const res = await fetch(`${url}/${arg.userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      res.ok
        ? toast.success('User deleted successfully', {
            id: toastId,
          })
        : toast.error(data.message, {
            id: toastId,
          });
    }
  );

  if (error) return (
    <div className="alert alert-error">
      <span>Error loading users: {error.message}</span>
    </div>
  );

  if (isLoading || !users) return (
    <div className="flex justify-center items-center h-64">
      <div className="loading loading-spinner loading-lg"></div>
    </div>
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-base-300">
        <table className="table w-full">
          <thead className="bg-base-200">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Admin</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: User) => (
              <tr key={user._id} className="hover:bg-base-200">
                <td className="px-4 py-3 font-mono">{formatId(user._id)}</td>
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${user.isAdmin ? 'badge-success' : 'badge-neutral'}`}>
                    {user.isAdmin ? 'Admin' : 'User'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end space-x-2">
                    <Link
                      href={`/admin/users/${user._id}`}
                      className="btn btn-outline btn-sm btn-primary"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteUser({ userId: user._id })}
                      className="btn btn-outline btn-sm btn-error"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {users.map((user: User) => (
          <div key={user._id} className="card border border-base-300 bg-base-100 shadow">
            <div className="card-body p-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="font-semibold">ID:</div>
                <div className="font-mono text-right">{formatId(user._id)}</div>
                
                <div className="font-semibold">Name:</div>
                <div className="text-right font-medium">{user.name}</div>
                
                <div className="font-semibold">Email:</div>
                <div className="text-right">{user.email}</div>
                
                <div className="font-semibold">Admin:</div>
                <div className="text-right">
                  <span className={`badge ${user.isAdmin ? 'badge-success' : 'badge-neutral'}`}>
                    {user.isAdmin ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
              
              <div className="card-actions mt-4 grid grid-cols-2 gap-2">
                <Link
                  href={`/admin/users/${user._id}`}
                  className="btn btn-primary btn-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteUser({ userId: user._id })}
                  className="btn btn-error btn-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}